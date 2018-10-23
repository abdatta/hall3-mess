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
    public static create(tokenModel: Model<TokenModel>,
        dishModel: Model<DishModel>, userModel: Model<UserModel>): Router {

        const accountCtrl: AccountCtrl = new AccountCtrl(userModel);
        const tokenCtrl: TokensCtrl = new TokensCtrl(tokenModel, dishModel, userModel);

        const router: Router = Router();

        router
            .get('/', accountCtrl.checkAuth, tokenCtrl.getTokens)
            .post('/book', accountCtrl.checkAuth, tokenCtrl.addToken);

        return router;
    }

}
