import { Router } from 'express';

import { AccountCtrl } from '../controllers/accounts.controller';

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
    public static create(): Router {

        const accountCtrl: AccountCtrl = new AccountCtrl();

        const router: Router = Router();

        router
            .get('/login', accountCtrl.logIn);

        return router;
    }

}
