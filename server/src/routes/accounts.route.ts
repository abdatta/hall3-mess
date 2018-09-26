import { Router } from 'express';
import { Model } from 'mongoose';

import { AccountCtrl } from '../controllers/accounts.controller';
import { UserModel } from '../models/user.model';

/**
 * For supplying data
 *
 * @class InfoRoute
 */
export class AccountsRoute {

    /**
     * Create the router
     *
     * @class InfoRoute
     * @method create
     * @return {Router} the router for this route
     * @static
     */
    public static create(userModel: Model<UserModel>): Router {

        const accountCtrl: AccountCtrl = new AccountCtrl(userModel);

        const router: Router = Router();

        router
            .post('/login', accountCtrl.logIn)
            .post('/signup', accountCtrl.createUser);

        return router;
    }

}
