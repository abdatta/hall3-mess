import { Request, Response, NextFunction } from 'express';
import { Model, Types } from 'mongoose';
import moment from 'moment';

import { PrebookingModel } from '../models/prebooking.model';

export class PrebookingCtrl {

    private prebookingModel: Model<PrebookingModel>;

    /**
     * Constructor
     *
     * @class PrebookingCtrl
     * @constructor
     */
    constructor(model1: Model<PrebookingModel>) {
        this.prebookingModel = model1;
        moment.defaultFormat = 'YYYY-MM-DD HH:mm:ss';
    }

    /**
     * Add a new prebooking
     *
     * @class PrebookingCtrl
     * @method addPrebooking
     */
    public addPrebooking = (req: Request, res: Response) => {
        const prebooking = new this.prebookingModel();
        prebooking.date = moment().format();
        prebooking.rollno = req.user.rollno;
        prebooking.dish_id = req.body.dish_id;
        prebooking.quantity = req.body.quantity;

        prebooking.save()
                .then((savedPrebooking: PrebookingModel) => res.sendStatus(200))
                .catch((error: Error) => this.internalServer(res, error));
    }

        /**
     * Send internal server error messages
     *
     * @class PrebookingCtrl
     * @method internalServer
     */
    private internalServer = (res: Response, err: any) => {
        console.error('[Internal Server Error]', err);
        res.status(500).json({ 'Error': err });
    }
}