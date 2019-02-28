import { Request, Response, NextFunction } from 'express';
import { Model, Types } from 'mongoose';
import moment from 'moment';
import XLSX from 'xlsx';

import { TokenModel } from '../models/token.model';
import { DishModel } from '../models/dish.model';
import { UserModel } from '../models/user.model';
import { XLSXConfig } from '../config/xlsx.config';

export class TokensCtrl {

    private tokenModel: Model<TokenModel>;
    private dishModel: Model<DishModel>;
    private userModel: Model<UserModel>;

    private static sid = (id: string) => '5bd00e2bf7c1a46a48' + id;
    private static gid = (id: string) => id.slice(-6);

    /**
     * Constructor
     *
     * @class TokensCtrl
     * @constructor
     */
    constructor(model: Model<TokenModel>,
        model2: Model<DishModel>, model3: Model<UserModel>) {
        this.tokenModel = model;
        this.dishModel = model2;
        this.userModel = model3;
        moment.defaultFormat = 'YYYY-MM-DD HH:mm:ss';
    }

    /**
     * Sanitize token json before being sent
     *
     * @class TokensCtrl
     * @method sanitize
     */
    private sanitize = (token: any) => {
        const copyToken = JSON.parse(JSON.stringify(token));
        if (copyToken['_id']) {
            copyToken._id = TokensCtrl.gid(copyToken._id.toString());
        }
        return copyToken;
    }

    /**
     * Add a new token to database
     *
     * @class TokensCtrl
     * @method addToken
     */
    public addToken = (req: Request, res: Response) => {
        const token = new this.tokenModel();
        token.date = moment().format();
        token.rollno = req.user.rollno;

        const quantity: any = {};
        try {
            req.body.dishes.forEach((dish: any) =>
                quantity[dish._id] = (quantity[dish._id] || 0) + dish.quantity);
        } catch (err) {
            console.log(err);
            this.internalServer(res, 'Property `dishes` is missing or invalid');
            return;
        }

        const today = moment().format('ddd');
        const tomorrow = moment().add(1, 'd').format('ddd');
        this.dishModel.find({_id: { $in: Object.keys(quantity) },
            $or: [
                {days: today},
                {days: tomorrow, prebookable: true}
            ]})
            .then((dishes: DishModel[]) => {
                token.dishes = dishes.map(dish => ({
                    _id: dish._id,
                    name: dish.name,
                    price: dish.price,
                    quantity: quantity[dish._id]
                }));
                if (token.dishes.length === 0) {
                    res.sendStatus(400); // Bad Request
                    return;
                }
                this.getUniqueId()
                    .then((id: string) => {
                        token._id = Types.ObjectId(id);
                        return token.save();
                    })
                    .then((savedToken: TokenModel) => {
                            this.insertTokenIntoUser(req, res, savedToken);
                            dishes.forEach(dish => this.updateFrequencyOfDish(dish));
                    });
            })
            .catch(error => this.internalServer(res, error));
    }

   /**
     * Insert a token into the user account
     *
     * @class TokenCtrl
     * @method insertTokenIntoUser
     */
    private insertTokenIntoUser(req: Request, res: Response, token: TokenModel) {
        this.userModel.findOne({ rollno: req.user.rollno })
            .then((user: UserModel | null) => {
                if (!user) {
                    res.sendStatus(406);  // Not acceptable
                    return;
                }
                (user.tokens as string[]).push(token._id);
                user.save().then((savedUser: UserModel) =>
                        res.status(200).json(this.sanitize(token)));
            })
            .catch(error => this.internalServer(res, error));
    }

    /**
     * Update frequency of dish
     *
     * @class TokenCtrl
     * @method updateFrequencyOfDishes
     */
    private updateFrequencyOfDish(dish: DishModel) {
        this.dishModel.findById(dish._id)
            .then((dishToBeUpdated: DishModel | null) => {
                if (!dishToBeUpdated) {
                    console.error('Could not update dish frequency: Dish not found!', JSON.stringify(dish));
                    return;
                }
                const today = moment().startOf('day');
                dishToBeUpdated.frequency[today.format()] =
                    (dishToBeUpdated.frequency[today.format()] || 0) + 1;
                dishToBeUpdated.markModified('frequency');

                // Optional TODO: add this in a daily cron job
                for (const day in dishToBeUpdated.frequency) {
                    if (moment(day).isBefore(today.subtract(30, 'days'))) {
                        dishToBeUpdated.frequency[day] = undefined;
                    }
                }
                dishToBeUpdated.save();
            })
            .catch(error => console.error('Could not update dish frequency: ', error));
    }

    /**
     * Get list of user's tokens
     *
     * @class TokensCtrl
     * @method getUserTokens
     */
    public getUserTokens = (req: Request, res: Response) => {
        const rollno = req.user.rollno;
        const maxtoken = 20;
        const offset = req.query.offset && moment(req.query.offset).isValid() && moment(req.query.offset) || moment();
        this.userModel.findOne({ rollno: rollno }, 'tokens')
            .populate({
                path: 'tokens',
                match: { date: { $lt: offset.format() }},
                options: { sort: '-date', limit: maxtoken }
            })
            .then((user: UserModel | null) => {
                if (!user) {
                    res.sendStatus(404);
                    return;
                }
                res.status(200).json(
                    (<TokenModel[]>user.tokens).map(token => this.sanitize(token))
                );
            })
            .catch(error => this.internalServer(res, error));
    }

    /**
     * Get list of user's monthly bills
     *
     * @class TokensCtrl
     * @method getUserBills
     */
    public getUserBills = (req: Request, res: Response) => {
        const rollno = req.user.rollno;
        this.userModel.aggregate([
            { $match: { rollno: rollno } }, // queries user with given rollno
            { $lookup: { // populates the tokens field
                from: 'tokens',
                localField: 'tokens',
                foreignField: '_id',
                as: 'tokens'
            }},
            { $project: { 'tokens': 1 }}, // selects only the tokens fields from the user data
            { $unwind: '$tokens'},          // splits the user object into multiple objects,
            { $unwind: '$tokens.dishes'},   // one for each dish for each token,
            { $group: {                     // to help in better grouping by month
                _id: { $substr: ['$tokens.date', 0, 7] }, // selects first 7 chars as YYYY-MM
                bill: { $sum: { // calculates bill = sum of (price * quantity) of all dishes in all tokens
                    $multiply : ['$tokens.dishes.price', '$tokens.dishes.quantity']
                }}
            }},
            { $sort: { _id: -1 }}, // sort the bills in order of decreasing month
            { $project: { // finalises output as an array of { month: string, total: number }
                _id: 0,
                month: '$_id',
                total: '$bill'
            }}
        ])
        .then(bills => res.status(200).json(bills))
        .catch(error => this.internalServer(res, error));
    }

    /**
     * Reduces mistakenly booked dishes in tokens
     *
     * @class TokensCtrl
     * @method reduceDishesInToken
     */
    public reduceDishesInToken = (req: Request, res: Response) => {
        const tokenId = req.params.id;
        const dishId = req.body._id;
        this.tokenModel.findByIdAndUpdate(tokenId, {$pull: {dishes: {_id: dishId }}}, {new: true})
            .then(token => {
                if (!token) {
                    res.sendStatus(404);
                    return;
                }
                res.status(200).json(token);
            })
            .catch(error => this.internalServer(res, error));
    }

    /**
     * Get latest tokens for recents
     *
     * @class TokensCtrl
     * @method getLatestTokens
     */
    public getLatestTokens = (req: Request, res: Response) => {
        const maxtoken = 10;
        const today = moment(moment().format('YYYY-MM-DD')).format();
        this.tokenModel.find({date: { $gte: today } })
            .sort('-date').limit(maxtoken)
            .then((tokens: TokenModel[]) => {
                res.status(200).json(tokens);
            })
            .catch(error => this.internalServer(res, error));
    }

    /**
     * Get latest tokens of a user for edit
     *
     * @class TokensCtrl
     * @method getEditTokens
     */
    // TODO: Unify this function with getUserToken
    public getEditTokens = (req: Request, res: Response) => {
        const maxtoken = 10;
        this.userModel.findOne({ rollno: req.query.rollno }, 'tokens')
            .populate({
                path: 'tokens',
                options: { sort: '-date', limit: maxtoken }
            })
            .then(user => {
                if (!user) {
                    res.sendStatus(404); // not found
                    return;
                }
                res.status(200).json(user.tokens);
            })
            .catch(error => this.internalServer(res, error));
    }

    /**
     * Download mess bill as an excel sheet
     *
     * @class TokensCtrl
     * @method getBillAsExcelSheet
     */
    public getBillAsExcelSheet = (req: Request, res: any) => {
        if (!req.query.from || !req.query.to) {
            res.sendStatus(400); // Bad Request
            return;
        }
        const from = moment(req.query.from).startOf('day');
        const to = moment(req.query.to).endOf('day');
        if (!from.isValid() || !to.isValid()) {
            res.sendStatus(400); // Bad Request
            return;
        }

        // Log that mess bill is being generated
        console.log('\x1b[32mMess Bill Generating:\x1b[0m', // For green color
                    `FROM \x1b[32m${from.format('DD MMM\'YY HH:mm:ss')}\x1b[0m TO \x1b[32m${to.format('DD MMM\'YY HH:mm:ss')}\x1b[0m`);

        let billData: any = {};
        let totalBill: any = {'Total (₹)': 0};
        this.userModel.find({ permissions: { $size: 0 }, verified: true})
            .then((users: UserModel[]) => {
                users.forEach(user => billData[user.rollno] = {'Name': user.name, 'Total (₹)': 0});
                return this.tokenModel.find({date: {$gte: from.format(), $lte: to.format()}}).exec();
            })
            .then((tokens: TokenModel[]) => {
                tokens.forEach(token => {
                    token.dishes.forEach(dish => {
                        const dishName = `${dish.name} (₹${dish.price})`;
                        const date = moment(token.date).format('Do MMMM YYYY').toUpperCase();
                        // Initializers
                        billData[token.rollno] = billData[token.rollno] || {'Total (₹)': 0};
                        billData[token.rollno][date] = billData[token.rollno][date] || {};
                        billData[token.rollno][date][dishName] = billData[token.rollno][date][dishName] || 0;
                        totalBill = totalBill || {'Total (₹)': 0};
                        totalBill[date] = totalBill[date] || {};
                        totalBill[date][dishName] = totalBill[date][dishName] || 0;

                        // Updators
                        billData[token.rollno][date][dishName] += (dish.price * dish.quantity);
                        billData[token.rollno]['Total (₹)'] += (dish.price * dish.quantity);
                        totalBill[date][dishName] += (dish.price * dish.quantity);
                        totalBill['Total (₹)'] += (dish.price * dish.quantity);
                    });
                });
            })
            .then(() => {
                billData = Object.keys(billData).map((key: string) => ({
                    'Roll No': key,
                    ...billData[key]
                }));
                billData.push({
                    'Roll No': 'TOTAL EXTRAS',
                    ...totalBill
                });

                const billDataConfig = XLSXConfig.configure(billData, { keys: ['Roll No', 'Name', ...Object.keys(totalBill)]});

                let longestNameLength = 0;
                billData.forEach((bill: any) => {
                    if (bill['Name'] && bill['Name'].length > longestNameLength) {
                        longestNameLength = bill['Name'].length;
                    }
                });

                /* generate workbook */
                // Add Heading Text
                const ws = XLSX.utils.aoa_to_sheet([['INDIAN INSTITUTE OF TECHNOLOGY KANPUR', '', '', '', '',
                                                     'MESS EXTRAS BILL FOR THE FOLLOWING DURATION', '', '', '', ''],
                                                     ['HALL OF RESIDENCE NO. 3', '', '', '',
                                                      'FROM:', from.format('Do MMMM YYYY').toUpperCase(), '',
                                                      'TO:', to.format('Do MMMM YYYY').toUpperCase()]]);
                // Append bill data
                XLSX.utils.sheet_add_aoa(ws, billDataConfig.aoa, { origin: 'A4' });
                ws['!cols'] = [{width: 8}, {width: longestNameLength}, {width: 8},
                               ...billDataConfig.aoa[1].slice(3).map(dish => ({width: dish.length}))];
                ws['!merges'] = [{s: {c: 0, r: 0}, e: {c: 3, r: 0}},
                                 {s: {c: 0, r: 1}, e: {c: 2, r: 1}},
                                 {s: {c: 0, r: 2}, e: {c: 2, r: 2}},
                                 {s: {c: 5, r: 0}, e: {c: 7, r: 0}},
                                 {s: {c: 5, r: 1}, e: {c: 6, r: 1}},
                                 {s: {c: 8, r: 1}, e: {c: 9, r: 1}},
                                 ...billDataConfig.merges(3, 0),
                                 {s: {c: 0, r: 2 + billDataConfig.aoa.length}, e: {c: 1, r: 2 + billDataConfig.aoa.length}}];
                const wb = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(wb, ws, 'HALL3_EXTRAS');

                /* generate buffer */
                const buf = XLSX.write(wb, {type: 'buffer', bookType: 'xlsx'});

                /* send to client */
                res.status(200).send(buf);

            })
            .catch(error => this.internalServer(res, error));
    }

    /**
     * Create a random unique id for token
     *
     * @class TokenssCtrl
     * @method getUniqueId
     */
    private getUniqueId(): Promise<string> {
        const id = TokensCtrl.sid(Math.floor((Math.random() * 15 + 1) * Math.pow(16, 5)).toString(16));
        return this.tokenModel.findById(id)
            .then((token: TokenModel | null) => {
                if (token) {
                    return this.getUniqueId();
                } else {
                    return id;
                }
            });
    }

    /**
     * Send internal server error messages
     *
     * @class TokensCtrl
     * @method internalServer
     */
    private internalServer = (res: Response, err: any) => {
        console.error('[Internal Server Error]', err);
        res.status(500).json({ 'Error': err });
    }
}
