import { Router } from 'express';
import { Model } from 'mongoose';
import { PassportStatic } from 'passport';

import { AccountCtrl } from '../controllers/accounts.controller';
import { UserModel } from '../models/user.model';

/**
 * For authentication purposes
 *
 * @class AccountsRoute
 */
export class AccountsRoute {

    /**
     * Create the router
     *
     * @class AccountsRoute
     * @method create
     * @return {Router} the router for this route
     * @static
     */
    public static create(userModel: Model<UserModel>, passport: PassportStatic): Router {

        const accountCtrl: AccountCtrl = new AccountCtrl(userModel);

        const router: Router = Router();

        router
            .get('/auth',  accountCtrl.getAuthStatus)
            .get('/photo/:roll.jpg', accountCtrl.fetchPhoto)
            .post('/login',  passport.authenticate('signin'), (req, res) => res.json(accountCtrl.sanitize(req.user)))
            .post('/signup', passport.authenticate('signup'), accountCtrl.updateUser)
            .patch('/update', accountCtrl.checkAuth, accountCtrl.updateUser)
            .post('/logout', accountCtrl.checkAuth, accountCtrl.logout)
            .post('/messin', accountCtrl.messIn)
            .post('/messout', accountCtrl.messOut);

        return router;
    }

}
