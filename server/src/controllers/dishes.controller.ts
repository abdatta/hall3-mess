import { Request, Response } from 'express';
import { Model } from 'mongoose';
import moment from 'moment';
import schedule from 'node-schedule';

import { DishModel } from '../models/dish.model';

export class DishesCtrl {

    /**
     * Constructor
     *
     * @class DishesCtrl
     * @constructor
     */
    constructor(private dishModel: Model<DishModel>) {
        schedule.scheduleJob('1 0 * * *', this.cleanupOldFreqsOfDishes);
        console.log('scheduled: cleanup-old-freq-of-dishes at 00:01 AM every day.');
    }

    /**
     * Sanitize token json being sent
     *
     * @class TokensCtrl
     * @method sanitize
     */
    private sanitize(dish: DishModel) {
        const copyDish = JSON.parse(JSON.stringify(dish));
        copyDish.frequency = 0;
        const thirtyDaysAgo = moment().startOf('day').subtract(30, 'days');
        for (const day in dish.frequency) {
            if (moment(day).isSameOrAfter(thirtyDaysAgo)) {
                copyDish.frequency += dish.frequency[day];
            }
        }
        return copyDish;
    }

    /**
     * Add a new dish to database
     *
     * @class DishesCtrl
     * @method addDish
     */
    public addDish = async (req: Request, res: Response) => {
        const dish = new this.dishModel();
        dish.name = req.body.name;
        dish.days = req.body.days;
        dish.price = req.body.price;
        dish.slot = req.body.slot;
        if (req.body.prebookable) {
            dish.prebookable = req.body.prebookable;
        }

        dish.short_id = await this.getUniqueShortId();

        if (!dish.short_id) {
            console.log('Couldn\'t save dish. short_id is undefined');
            this.internalServer(res, { err: 'short_id is undefined'});
        } else {
            dish.save()
                .then((savedDish: DishModel) => res.status(200).json(this.sanitize(savedDish)))
                .catch((error: Error) => this.internalServer(res, error));
        }
    }

    /**
     * Get list of someday's dishes
     *
     * @class DishesCtrl
     * @method getSomedaysDishes
     */
    public getSomedaysDishes = (req: Request, res: Response) => {
        const day = moment(req.params.day + 'day', 'dddd').format('ddd');
        this.dishModel.find({ days: day }, '-days -__v')
            .then((dishes: DishModel[]) => {
                res.status(200).json(dishes.map(dish => this.sanitize(dish)));
            })
            .catch((error) => this.internalServer(res, error));
    }

    /**
     * Get list of all dishes
     *
     * @class DishesCtrl
     * @method getAllDishes
     */
    public getAllDishes = (req: Request, res: Response) => {
        this.dishModel.find({}, '-__v',
          (err: Error, dishes: DishModel[]) => {
            if (err) {
                this.internalServer(res, err);
            } else {
                res.status(200).json(dishes.map(dish => this.sanitize(dish)));
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
                        res.status(200).json(this.sanitize(savedDish));
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
     * Cleans up the frequency record of dishes by deleting old usage counts.
     * This method is supposed to be scheduled as a cron job.
     */
    private cleanupOldFreqsOfDishes = async () => {
        console.log('Starting cleanupOldFreqsOfDishes job');
        const today = moment().startOf('day');
        const dishes = await this.dishModel.find({});
        await Promise.all(dishes.map(dish => {
            for (const day in dish.frequency) {
                if (today.diff(moment(day), 'days') > 30) {
                    delete dish.frequency[day];
                }
            }
            dish.markModified('frequency');
            return dish.save().catch(err => {
                console.error(`Couldn\'t cleanup old frequencies for dish ${dish.name}`, err);
            });
        })).catch(err => {
            console.error(`Error while cleaning up old frequencies from dishes`, err);
        });
        console.log('Finished cleanupOldFreqsOfDishes job');
    }

    /**
     * Create a random unique short_id for dish
     *
     * @class TokenssCtrl
     * @method getUniqueId
     */
    private getUniqueShortId(): Promise<string> {
        // 16 <= short_id < 256 (in hex, 10 <= short_id < 100)
        const short_id = Math.floor((Math.random() * 15 + 1) * 16).toString(16);

        // checking if duplicate
        return this.dishModel
                   .findOne({ short_id: short_id })
                   .then(dish => dish ? this.getUniqueShortId() : short_id);
    }

    /**
     * Send internal server error messages
     *
     * @class DishesCtrl
     * @method internalServer
     */
    private internalServer = (res: Response, err: any) => {
        console.error('[Internal Server Error]', JSON.stringify(err));
        res.status(500).json({ 'Error': err });
    }
}
