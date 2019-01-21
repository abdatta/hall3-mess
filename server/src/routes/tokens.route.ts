import { Router } from 'express';
import { Model } from 'mongoose';

import { AccountCtrl } from '../controllers/accounts.controller';
import { TokensCtrl } from '../controllers/tokens.controller';

import { UserModel } from '../models/user.model';
import { DishModel } from '../models/dish.model';
import { TokenModel } from '../models/token.model';

/**
 * For tokens of booked extras
 *
 * @class TokensRoute
 */
export class TokensRoute {

    /**
     * Create the router
     *
     * @class TokensRoute
     * @method create
     * @return {Router} the router for this route
     * @static
     */
    public static create(tokenCtrl: TokensCtrl, accountCtrl: AccountCtrl): Router {

        const router: Router = Router();

        router
            .get('/', accountCtrl.checkMessAuth, tokenCtrl.getLatestTokens)
            .get('/user', accountCtrl.checkAuth, tokenCtrl.getUserTokens)
            .post('/book', accountCtrl.checkAuth, tokenCtrl.addToken)
            .post('/reduce/:id', accountCtrl.checkAuth, tokenCtrl.reduceDishesInToken)
            .get('/filter', accountCtrl.checkAuth, tokenCtrl.getEditTokens);
        return router;
    }

}
