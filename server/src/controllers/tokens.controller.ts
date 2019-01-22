import { Request, Response, NextFunction } from 'express';
import { Model, Types } from 'mongoose';
import moment from 'moment';
import XLSX from 'xlsx';

import { TokenModel } from '../models/token.model';
import { DishModel } from '../models/dish.model';
import { UserModel } from '../models/user.model';

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
     * Sanitize token json being sent
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
                quantity[dish._id] = dish.quantity);
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
                    });
            })
            .catch((error) => this.internalServer(res, error));
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
            .catch((error) => this.internalServer(res, error));
    }

    /**
     * Get list of user's tokens
     *
     * @class TokensCtrl
     * @method getUserTokens
     */
    public getUserTokens = (req: Request, res: Response) => {
        const rollno = req.user.rollno;
        this.userModel.findOne({ rollno: rollno }, 'tokens')
          .populate('tokens')
          .exec((err: Error, user: UserModel) => {
            if (err) {
                this.internalServer(res, err);
            } else {
                res.status(200).json((user.tokens as TokenModel[])
                    .map(token => this.sanitize(token)));
            }
          });
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
            .catch((error) => this.internalServer(res, error));
    }

    /**
     * Get latest tokens of a user for edit
     *
     * @class TokensCtrl
     * @method getEditTokens
     */
    // TODO: Unify this function with getUserToken
    public getEditTokens = (req: Request, res: Response) => {
        const rollno = req.query.rollno;
        const maxtoken = 10;
        this.userModel.findOne({ rollno: rollno }, 'tokens')
            .populate('tokens')
            .then(user => {
                if (!user) {
                    res.sendStatus(404); // not found
                    return;
                }
                user.tokens.splice(maxtoken);
                res.status(200).json(user.tokens);
            })
            .catch((error) => this.internalServer(res, error));
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

        let billData: any = {};
        this.userModel.find({ permissions: { $size: 0 }, verified: true})
            .then((users: UserModel[]) => {
                users.forEach(user => billData[user.rollno] = {'Name': user.name, 'Total (₹)': 0});
                billData['TOTAL EXTRAS'] = {'Name': '', 'Total (₹)': 0};
                return this.tokenModel.find({date: {$gte: from.format(), $lte: to.format()}}).exec();
            })
            .then((tokens: TokenModel[]) => {
                tokens.forEach(token => {
                    token.dishes.forEach(dish => {
                        const dishName = `${dish.name} (₹${dish.price})`;
                        billData[token.rollno] = billData[token.rollno] || {};
                        billData[token.rollno][dishName] = billData[token.rollno][dishName] || 0;
                        billData[token.rollno][dishName] += (dish.price * dish.quantity);
                        billData[token.rollno]['Total (₹)'] = billData[token.rollno]['Total (₹)'] || 0;
                        billData[token.rollno]['Total (₹)'] += (dish.price * dish.quantity);
                        billData['TOTAL EXTRAS'] = billData['TOTAL EXTRAS'] || {};
                        billData['TOTAL EXTRAS'][dishName] = billData['TOTAL EXTRAS'][dishName] || 0;
                        billData['TOTAL EXTRAS'][dishName] += (dish.price * dish.quantity);
                        billData['TOTAL EXTRAS']['Total (₹)'] += (dish.price * dish.quantity);
                    });
                });
            })
            .then(() => {
                billData = Object.keys(billData).map((key: string) => ({
                    'Roll No': key,
                    ...billData[key]
                }));
                const dishes: any = {};
                let longestNameLength = 0;
                billData.forEach((bill: any) => {
                    if (bill['Name'] && bill['Name'].length > longestNameLength) {
                        longestNameLength = bill['Name'].length;
                    }
                    Object.keys(bill).forEach(col => {
                        if (col !== 'Name' && col !== 'Roll No') {
                            dishes[col] = true;
                        }
                    });
                });
                /* generate workbook */
                // Add Heading Text
                const ws = XLSX.utils.aoa_to_sheet([['INDIAN INSTITUTE OF TECHNOLOGY KANPUR', '', '', '', '',
                                                     'MESS EXTRAS BILL FOR THE FOLLOWING DURATION', '', '', '', ''],
                                                     ['HALL OF RESIDENCE NO. 3', '', '', '',
                                                      'FROM:', from.format('Do MMMM YYYY').toUpperCase(), '',
                                                      'TO:', to.format('Do MMMM YYYY').toUpperCase()]]);
                // Append bill data
                XLSX.utils.sheet_add_json(ws, billData, { origin: 'A4' });
                ws['!cols'] = [{width: 13}, {width: longestNameLength}, ...Object.keys(dishes).map(dish => ({width: dish.length}))];
                ws['!merges'] = [{s: {c: 0, r: 0}, e: {c: 3, r: 0}},
                                 {s: {c: 0, r: 1}, e: {c: 2, r: 1}},
                                 {s: {c: 0, r: 2}, e: {c: 2, r: 2}},
                                 {s: {c: 5, r: 0}, e: {c: 7, r: 0}},
                                 {s: {c: 5, r: 1}, e: {c: 6, r: 1}},
                                 {s: {c: 8, r: 1}, e: {c: 9, r: 1}}]
                const wb = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(wb, ws, 'HALL3_EXTRAS');

                /* generate buffer */
                const buf = XLSX.write(wb, {type: 'buffer', bookType: 'xlsx'});

                /* send to client */
                res.status(200).send(buf);
            })
            .catch((error) => this.internalServer(res, error));
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
