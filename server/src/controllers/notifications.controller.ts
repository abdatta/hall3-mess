import { Request, Response, NextFunction } from 'express';
import { Model } from 'mongoose';
import webpush from 'web-push';

import { SubscriptionModel } from '../models/subscription.model';

const PUBLIC_KEY  = process.env.VAPID_PUBLIC_KEY  || '';
const PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY || '';

export class NotificationsCtrl {

    private subscriptionModel: Model<SubscriptionModel>;

    /**
     * Constructor
     *
     * @class NotificationsCtrl
     * @constructor
     */
    constructor(model: Model<SubscriptionModel>) {
        this.subscriptionModel = model;
        webpush.setVapidDetails(
            'mailto:hall3-mess@googlegroups.com',
            PUBLIC_KEY,
            PRIVATE_KEY
        );
    }

    /**
     * Get VAPID keys for subscribing to notifications
     *
     * @class NotificationsCtrl
     * @method getVAPIDkeys
     */
    public getVAPIDkeys = (req: Request, res: Response) => {
        res.status(200).json({ publicKey: PUBLIC_KEY });
    }

    /**
     * Add a new dish to database
     *
     * @class NotificationsCtrl
     * @method addDish
     */
    public subscribeToNotifictions = (req: Request, res: Response) => {
        const newSub = new this.subscriptionModel();
        newSub.setSubscription(req.body);
        if (req.sessionID) {
            newSub.session = req.sessionID;
        }
        this.subscriptionModel.findOneAndUpdate({ subscription: newSub.subscription }, newSub,
                                                { upsert: true, runValidators: true, new: true })
            .then((sub: SubscriptionModel) => {
                console.log('New Subscription added for User: ', req.user.rollno, ', Subscription ID: ', sub.id);
                if (req.session) {
                    req.session.sub = sub.id;
                }
                this.sendNotification('Hall 3 Mess Automation', 'Thanks for subscribing to notificatons!');
                res.sendStatus(200);
            })
            .catch(error => this.internalServer(res, error));
    }

    public sendNotification = async (title: string, body: string) => {
        const notificationPayload = {
            notification: {
                title: title,
                body: body,
                icon: 'assets/img/mauryans_logo.png',
                vibrate: [100, 50, 100],
                data: {
                    dateOfArrival: Date.now(),
                    primaryKey: 1
                },
                // actions: [{
                //     action: 'explore',
                //     title: 'OK'
                // }]
            }
        };

        return this.subscriptionModel.find({})
            .then((subs: SubscriptionModel[]) => {
                subs.map(sub => {
                    webpush.sendNotification(JSON.parse(sub.subscription), JSON.stringify(notificationPayload))
                        .then(() => console.log('Notification sent successfully.'))
                        .catch(() => console.log('Error occured while sending notification.'));
                });
            })
            .catch(error => console.log('Error finding subscriptions from database => ', error));
        }

    /**
     * Send internal server error messages
     *
     * @class NotificationsCtrl
     * @method internalServer
     */
    private internalServer = (res: Response, err: any) => {
        console.error('[Internal Server Error]', JSON.stringify(err));
        res.status(500).json({ 'Error': err });
    }
}
