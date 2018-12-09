import { Request, Response, NextFunction } from 'express';
import { Model } from 'mongoose';
import request from 'request';

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
     * @method sanitize
     */
    public sanitize = (user: any) => {
        user = JSON.parse(JSON.stringify(user));
        user['tokens'] = undefined;
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
     * Check authentication status
     *
     * @class AccountCtrl
     * @method getAuthStatus
     */
    public getAuthStatus = (req: Request, res: Response, next: NextFunction) => {
        res.status(200).json({
            user: req.isAuthenticated() ? this.sanitize(req.user) : null,
            mess: req.session ? req.session.mess : null
        });
    }

    /**
     * Update a account of a user
     *
     * @class AccountCtrl
     * @method updateUser
     */
    public updateUser = (req: Request, res: Response) => {
        this.userModel.findOne({
            'rollno': req.user.rollno
        }, (err: Error, user: UserModel) => {
            if (err) {
                this.internalServer(res, err);
            } else if (!user) {
                res.sendStatus(404);  // Not found
            } else if (req.body['newpassword'] && !user.validPassword(req.body.password)) {
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
     * Fetch photo of a user from IITK OA
     *
     * @class AccountCtrl
     * @method fetchPhoto
     */
    public fetchPhoto = (req: Request, res: Response) => {
        const url = `https://oa.cc.iitk.ac.in/Oa/Jsp/Photo/${req.params.roll}_0.jpg`;
        request.get(url).pipe(res);
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
     * Authenticate and start mess session
     *
     * @class AccountCtrl
     * @method messIn
     */
    public messIn = (req: Request, res: Response) => {
        if (req.session === undefined) {
            this.internalServer(res, { err: 'Session not initialised'});
            return;
        }
        this.userModel.findOne({
            rollno: 'mess'
        }, (err: Error, user: UserModel) => {
            if (err) {
                this.internalServer(res, err);
            } else if (!user) {
                res.sendStatus(401);  // Unauthorised, only mess login allowed
            } else if (!user.validPassword(req.body.password)) {
                res.sendStatus(403); // Wrong Password, forbidden
            } else {
                (req.session as Express.Session).mess = true;
                res.sendStatus(200);
            }
        });
    }

    /**
     * Check mess session authentication status
     *
     * @class AccountCtrl
     * @method checkMessAuth
     */
    public checkMessAuth = (req: Request, res: Response, next: NextFunction) => {
        if (req.session && req.session.mess === true) {
            next();
        } else {
            res.sendStatus(401);  // Unauthorized
        }
    }

    /**
     * End mess session
     *
     * @class AccountCtrl
     * @method messOut
     */
    public messOut = (req: Request, res: Response) => {
        if (req.session) {
            req.session.mess = undefined;
        }
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
