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
        this.getUniqueShortId((error, short_id) => {
            if (error) {
                this.internalServer(res, error);
            } else if (!short_id) {
                console.log('Couldn\'t save dish. short_id is undefined', error);
                this.internalServer(res, { err: 'short_id is undefined'});
            } else {
                dish.short_id = short_id;
                dish.save((err: Error, savedDish: DishModel) => {
                    if (err) {
                        this.internalServer(res, err);
                    } else {
                        res.status(200).json(savedDish);
                    }
                });
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
     * Create a random unique short_id for dish
     *
     * @class TokenssCtrl
     * @method getUniqueId
     */
    private getUniqueShortId(cb: (err: Error | null,  short_id?: string) => void) {
        // 16 <= short_id < 256 (in hex, 10 <= short_id < 100)
        const short_id = Math.floor((Math.random() * 15 + 1) * 16).toString(16);
        // checking if duplicate
        this.dishModel.findOne({ short_id: short_id }, (err: Error, dish: DishModel) => {
            if (err) {
                cb(err);
            } else if (dish) {
                this.getUniqueShortId(cb);
            } else {
                cb(null, short_id);
            }
        });
    }

    // TODO: Remove this controller later.
    public fillMissingShortIds = (req: Request, res: Response) => {
        this.dishModel.find({}, (err: Error, dishes: DishModel[]) => {
            if (err) {
                this.internalServer(res, err);
            } else {
                dishes.forEach(dish => {
                    if (!dish.short_id) {
                        this.getUniqueShortId((error, short_id) => {
                            if (error || !short_id) {
                                console.log('Error: ', error);
                            } else {
                                console.log('Generated short_id: ' + short_id);
                                dish.short_id = short_id;
                                dish.save();
                            }
                        });
                    }
                });
                res.sendStatus(200);
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
