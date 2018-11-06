import { Request, Response, NextFunction } from 'express';
import { Model, Types } from 'mongoose';
import moment from 'moment';

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
            ]},
            (error: Error, dishes: DishModel[]) => {
                if (error) {
                    this.internalServer(res, error);
                } else {
                    token.dishes = dishes.map(dish => ({
                        _id: dish._id,
                        name: dish.name,
                        price: dish.price,
                        quantity: quantity[dish._id]
                    }));
                    if (token.dishes.length > 0) {
                        this.getUniqueId((err: Error, id: string) => {
                            if (err) {
                                this.internalServer(res, err);
                            } else {
                                token._id = Types.ObjectId(id);
                                token.save((err2: Error, savedToken: TokenModel) => {
                                    if (err2) {
                                        this.internalServer(res, err2);
                                    } else {
                                        this.insertTokenIntoUser(req, res, savedToken);
                                    }
                                });
                            }
                        });
                    } else {
                        res.sendStatus(400); // Bad Request
                    }
                }
            });
    }

   /**
     * Insert a token into the user account
     *
     * @class TokenCtrl
     * @method insertTokenIntoUser
     */
    private insertTokenIntoUser(req: Request, res: Response, token: TokenModel) {
        this.userModel.findOne({
            'rollno': req.user.rollno
        }, (err, user: UserModel) => {
            if (err) {
                this.internalServer(res, err);
            } else if (!user) {
                res.sendStatus(406);  // Not acceptable
            } else {
                (user.tokens as string[]).push(token._id);
                user.save((error) => {
                    if (error) {
                        this.internalServer(res, error);
                    } else {
                        res.status(200).json(this.sanitize(token));
                    }
                });
            }
        });
    }

    /**
     * Get list of user's tokens
     *
     * @class TokensCtrl
     * @method getTokens
     */
    public getTokens = (req: Request, res: Response) => {
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
     * Create a random unique id for token
     *
     * @class TokenssCtrl
     * @method getUniqueId
     */
    private getUniqueId(cb: (err: Error | any, id: string | any) => void) {
        const id = TokensCtrl.sid(Math.floor((Math.random() * 15 + 1) * Math.pow(16, 5)).toString(16));
        this.dishModel.findById(id, (err: Error, dish: DishModel) => {
            if (err) {
                cb(err, null);
            } else if (dish) {
                this.getUniqueId(cb);
            } else {
                cb(null, id);
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
        console.log(JSON.stringify(err, null, 2));
        res.status(500).json({ 'Error': err });
    }
}
