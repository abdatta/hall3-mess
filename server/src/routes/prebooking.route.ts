import { Router } from 'express';

import { DishesCtrl } from '../controllers/dishes.controller';
import { AccountCtrl } from '../controllers/accounts.controller';
import { PrebookingCtrl } from '../controllers/prebooking.controller';

/**
 * For the various dishes in extras
 *
 * @class PrebookingRoute
 */
export class PrebookingRoute {

    /**
     * Create the router
     *
     * @class PrebookingRoute
     * @method create
     * @return {Router} the router for this route
     * @static
     */
    public static create(prebookingCtrl: PrebookingCtrl, accountCtrl: AccountCtrl): Router {

        const router: Router = Router();

        router
            .post('/add', accountCtrl.checkAuth, prebookingCtrl.addPrebooking);

        return router;
    }

}