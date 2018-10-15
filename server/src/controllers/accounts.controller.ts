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
        user = JSON.parse(JSON.stringify(user));
        user['password'] = undefined;
        user['_id'] = undefined;
        user['__v'] = undefined;
        return user;
    }

    /**
     * Check authentication status
     *
     * @class AccountCtrl
     * @method checkAuth
     */
    public checkAuth = (req: Request, res: Response, next: NextFunction) => {
        if (req.isAuthenticated()) {
            next();
        } else {
            res.sendStatus(401);  // Unauthorized
        }
    }

    /**
     * Update a account of a user
     *
     * @class AccountCtrl
     * @method updateUser
     */
    public updateUser = (req: Request, res: Response) => {
        this.userModel.findOne({
            'rollno': req.body.rollno
        }, (err, user: UserModel) => {
            if (err) {
                this.internalServer(res, err);
            }
            if (!user) {
                res.sendStatus(404);  // Not found
            } else if (!user.validPassword(req.body.password)) {
                res.sendStatus(403); // Wrong Password, forbidden
            } else {
                user.name = req.body.name || user.name;
                if (req.body['newpassword']) {
                    user.password = user.generateHash(req.body['newpassword']);
                }
                user.email = req.body.email || user.email || (user.rollno + '@iitk.ac.in');
                user.save((error) => {
                    if (error) {
                        this.internalServer(res, error);
                    } else {
                        res.status(200).json(this.sanitize(user));
                    }
                });
            }
        });
    }

    /**
     * Logout user
     *
     * @class AccountCtrl
     * @method logout
     */
    public logout = (req: Request, res: Response) => {
        req.logout();
        res.sendStatus(200);
    }

    /**
     * Send internal server error messages
     *
     * @class AccountCtrl
     * @method internalServer
     */
    private internalServer = (res: Response, err: any) => {
        res.status(500).json({ 'Error': err });
    }
}
