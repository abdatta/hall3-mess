import { Request, Response, NextFunction } from 'express';
import { Model } from 'mongoose';
import moment from 'moment';

import { DishModel } from '../models/dish.model';

export class DishesCtrl {

    private dishModel: Model<DishModel>;

    /**
     * Constructor
     *
     * @class DishesCtrl
     * @constructor
     */
    constructor(model: Model<DishModel>) {
        this.dishModel = model;
    }

    /**
     * Add a new dish to database
     *
     * @class DishesCtrl
     * @method addDish
     */
    public addDish = (req: Request, res: Response) => {
        const dish = new this.dishModel();
        dish.name = req.body.name;
        dish.days = req.body.days;
        dish.price = req.body.price;
        dish.slot = req.body.slot;
        if (req.body.prebookable) {
            dish.prebookable = req.body.prebookable;
        }
        dish.save((err: Error, savedDish: DishModel) => {
            if (err) {
                this.internalServer(res, err);
            } else {
                res.status(200).json(savedDish);
            }
        });

    }

    /**
     * Get list of today's dishes
     *
     * @class DishesCtrl
     * @method getTodaysDishes
     */
    public getTodaysDishes = (req: Request, res: Response) => {
        const today = moment().format('ddd');
        this.dishModel.find({ days: today }, '-days -__v',
          (err: Error, dishes: DishModel[]) => {
            if (err) {
                this.internalServer(res, err);
            } else {
                res.status(200).json(dishes);
            }
          });
    }

    /**
     * Get list of someday's dishes
     *
     * @class DishesCtrl
     * @method getSomedaysDishes
     */
    public getSomedaysDishes = (req: Request, res: Response) => {
        const day = moment(req.params.day + 'day', 'dddd').format('ddd');
        this.dishModel.find({ days: day }, '-days -__v',
          (err: Error, dishes: DishModel[]) => {
            if (err) {
                this.internalServer(res, err);
            } else {
                res.status(200).json(dishes);
            }
          });
    }

    /**
     * Update details of a dish in database
     *
     * @class DishesCtrl
     * @method updateDish
     */
    public updateDish = (req: Request, res: Response) => {
        this.dishModel.findById(req.params.id, (err: Error, dish: DishModel) => {
            if (err) {
                this.internalServer(res, err);
            } else if (!dish) {
                res.sendStatus(404); // Not Found
            } else {
                dish.name = req.body.name || dish.name;
                dish.days = req.body.days || dish.days;
                dish.price = req.body.price || dish.price;
                dish.slot = req.body.slot || dish.slot;
                if (req.body.prebookable !== undefined) {
                    dish.prebookable = req.body.prebookable;
                }
                dish.save((err2: Error, savedDish: DishModel) => {
                    if (err2) {
                        this.internalServer(res, err2);
                    } else {
                        res.status(200).json(savedDish);
                    }
                });
            }
        });
    }

    /**
     * Delete a dish from database
     *
     * @class DishesCtrl
     * @method deleteDish
     */
    public deleteDish = (req: Request, res: Response) => {
        this.dishModel.findById(req.params.id, (err: Error, dish: DishModel) => {
            if (err) {
                this.internalServer(res, err);
            } else if (!dish) {
                res.sendStatus(404); // Not Found
            } else {
                dish.remove((err2: Error, savedDish: DishModel) => {
                    if (err2) {
                        this.internalServer(res, err2);
                    } else {
                        res.sendStatus(200);
                    }
                });
            }
        });
    }

    /**
     * Send internal server error messages
     *
     * @class DishesCtrl
     * @method internalServer
     */
    private internalServer = (res: Response, err: any) => {
        res.status(500).json({ 'Error': err });
    }
}
