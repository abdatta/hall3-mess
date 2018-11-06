import { Router } from 'express';
import { Model } from 'mongoose';

import { DishesCtrl } from '../controllers/dishes.controller';
import { DishModel } from '../models/dish.model';

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
    public static create(dishModel: Model<DishModel>): Router {

        const dishesCtrl: DishesCtrl = new DishesCtrl(dishModel);

        const router: Router = Router();

        router
            .get('/today', dishesCtrl.getTodaysDishes)
            .get('/:day((mon|tues|wednes|thurs|fri|satur|sun)day)', dishesCtrl.getSomedaysDishes)
            .post('/add', dishesCtrl.addDish)
            .put('/update/:id', dishesCtrl.updateDish)
            .delete('/delete/:id', dishesCtrl.deleteDish);

        return router;
    }

}
