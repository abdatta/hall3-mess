import { Router } from 'express';

import { NotificationsCtrl } from '../controllers/notifications.controller';
import { AccountCtrl } from '../controllers/accounts.controller';

/**
 * For notification purposes
 *
 * @class NotificationsRoute
 */
export class NotificationsRoute {

    /**
     * Create the router
     *
     * @class NotificationsRoute
     * @method create
     * @return {Router} the router for this route
     * @static
     */
    public static create(notificationsCtrl: NotificationsCtrl, accountCtrl: AccountCtrl): Router {

        const router: Router = Router();

        router
            .get('/vapid', notificationsCtrl.getVAPIDkeys)
            .post('/subscribe', accountCtrl.checkAuth, notificationsCtrl.subscribeToNotifictions);

        return router;
    }

}
