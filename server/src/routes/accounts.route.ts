import { Router } from 'express';

import { AccountCtrl } from '../controllers/accounts.controller';

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
    public static create(accountCtrl: AccountCtrl): Router {

        const router: Router = Router();

        router
            .get('/auth',  accountCtrl.getAuthStatus)
            .get('/photo/:roll.jpg', accountCtrl.fetchPhoto)
            .post('/login', accountCtrl.logIn)
            .post('/signup', accountCtrl.createNewUser, accountCtrl.sendVerificationMail, accountCtrl.updateUser)
            .post('/verify/:id', accountCtrl.verifyUser)
            .post('/delete_unverified/:id', accountCtrl.deleteUnverifiedUser)
            .patch('/update', accountCtrl.checkAuth, accountCtrl.updateUser)
            .post('/forgot_password', accountCtrl.sendResetPasswordCode)
            .post('/reset_password', accountCtrl.resetPassword)
            .post('/logout', accountCtrl.checkAuth, accountCtrl.logout)
            .post('/messin', accountCtrl.messIn)
            .post('/messout', accountCtrl.messOut);

        return router;
    }

}
