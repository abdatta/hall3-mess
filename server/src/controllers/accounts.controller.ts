import { Request, Response, NextFunction } from 'express';

export class AccountCtrl {

    /**
     * Constructor
     *
     * @class AccountCtrl
     * @constructor
     */
    constructor() {
    }

    /**
     * Log In a user
     *
     * @class AccountCtrl
     * @method logIn
     */
    public logIn = (req: Request, res: Response) => {
        res.status(200).send('Test log in successful.');
    }
}
