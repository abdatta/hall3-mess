import { Request, Response, NextFunction } from 'express';
import { Model } from 'mongoose';

import { UserModel } from '../models/user.model';

export class AccountCtrl {

    private userModel: Model<UserModel>;

    /**
     * Constructor
     *
     * @class AccountCtrl
     * @constructor
     */
    constructor(model: Model<UserModel>) {
        this.userModel = model;
    }

    /**
     * Sanitize user json being sent
     *
     * @class AccountCtrl
     * @constructor
     */
    public sanitize = (user: any) => {
        user['password'] = undefined;
        user['__v'] = undefined;
        return user;
    }

    /**
     * Log In a user
     *
     * @class AccountCtrl
     * @method logIn
     */
    public logIn = (req: Request, res: Response) => {
        this.userModel.findOne({
            'rollno': req.body.rollno
        }, (err, user: UserModel) => {
            if (err) {
                this.internalServer(res, err);
            }
            if (!user) {
                res.sendStatus(404);  // User does not exist
            } else {
                if (user.validPassword(req.body.password)) {
                    res.status(200).send('Log in successful.');
                } else {
                    res.status(403).send('Incorrect Password!');
                }
            }
        });
    }

    /**
     * Create an account for a new user
     *
     * @class AccountCtrl
     * @method createUser
     */
    public createUser = (req: Request, res: Response) => {
        this.userModel.findOne({
            'rollno': req.body.rollno
        }, (err, user: UserModel) => {
            if (err) {
                this.internalServer(res, err);
            }
            if (user) {
                res.sendStatus(403);  // Already exists, so forbidden
            } else {
                const newUser = new this.userModel();
                newUser.name = req.body.name;
                newUser.rollno = req.body.rollno;
                newUser.password = newUser.generateHash(req.body.password);
                if (req.body.email) {
                    newUser.email = req.body.email;
                }
                newUser.save((error) => {
                    if (error) {
                        this.internalServer(res, error);
                    } else {
                        res.status(200).json(this.sanitize(newUser));
                    }
                });
            }
        });
    }

    /**
     * Send internal server error messages
     *
     * @class AskTheHECCtrl
     * @method internalServer
     */
    private internalServer = (res: Response, err: any) => {
        res.status(500).json({ 'Error': err });
    }
}
