import { Request, Response, NextFunction } from 'express';
import { Model } from 'mongoose';
import moment from 'moment';

import { TokenModel } from '../models/token.model';
import { DishModel } from '../models/dish.model';
import { UserModel } from '../models/user.model';

export class TokensCtrl {

    private tokenModel: Model<TokenModel>;
    private dishModel: Model<DishModel>;
    private userModel: Model<UserModel>;

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
        this.dishModel.find({_id: { $in: Object.keys(quantity) }, days: today},
            (error: Error, dishes: DishModel[]) => {
                if (error) {
                    this.internalServer(res, error);
                } else {
                    token.dishes = dishes.map(dish => ({
                        name: dish.name,
                        price: dish.price,
                        quantity: quantity[dish._id]
                    }));
                    if (token.dishes.length > 0) {
                        token.save((err: Error, savedToken: TokenModel) => {
                            if (err) {
                                this.internalServer(res, err);
                            } else {
                                this.insertTokenIntoUser(req, res, savedToken._id);
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
    private insertTokenIntoUser(req: Request, res: Response, token_id: string) {
        this.userModel.findOne({
            'rollno': req.user.rollno
        }, (err, user: UserModel) => {
            if (err) {
                this.internalServer(res, err);
            } else if (!user) {
                res.sendStatus(406);  // Not acceptable
            } else {
                user.tokens.push(token_id);
                user.save((error) => {
                    if (error) {
                        this.internalServer(res, error);
                    } else {
                        res.status(200).json({token_id: token_id});
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
                res.status(200).json(user.tokens);
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
