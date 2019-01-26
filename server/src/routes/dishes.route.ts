import { Router } from 'express';

import { DishesCtrl } from '../controllers/dishes.controller';
import { AccountCtrl } from '../controllers/accounts.controller';

/**
 * For the various dishes in extras
 *
 * @class DishesRoute
 */
export class DishesRoute {

    /**
     * Create the router
     *
     * @class DishesRoute
     * @method create
     * @return {Router} the router for this route
     * @static
     */
    public static create(dishesCtrl: DishesCtrl, accountCtrl: AccountCtrl): Router {

        const router: Router = Router();

        router
            .get('/:day((mon|tues|wednes|thurs|fri|satur|sun)day)', dishesCtrl.getSomedaysDishes)
            .get('/all', dishesCtrl.getAllDishes)
            .post('/add', accountCtrl.checkPermissions('edit_dishes'), dishesCtrl.addDish)
            .put('/update/:id', accountCtrl.checkPermissions('edit_dishes'), dishesCtrl.updateDish)
            .delete('/delete/:id', accountCtrl.checkPermissions('edit_dishes'), dishesCtrl.deleteDish);

        return router;
    }

}
