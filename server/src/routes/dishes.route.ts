import { Router } from 'express';

import { DishesCtrl } from '../controllers/dishes.controller';

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
    public static create(dishesCtrl: DishesCtrl): Router {

        const router: Router = Router();

        router
            .get('/:day((mon|tues|wednes|thurs|fri|satur|sun)day)', dishesCtrl.getSomedaysDishes)
            .get('/all', dishesCtrl.getAllDishes)
            .post('/add', dishesCtrl.addDish)
            .put('/update/:id', dishesCtrl.updateDish)
            .delete('/delete/:id', dishesCtrl.deleteDish);

        return router;
    }

}
