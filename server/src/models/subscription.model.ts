import { Document } from 'mongoose';
import { PushSubscription } from 'web-push';
/**
 * Interface for Subscription
 *
 * @interface SubscriptionModel
 */
export interface SubscriptionModel extends Document {
    subscription: string;
    session: string | Express.Session;
    getSubscription: () => PushSubscription;
    setSubscription: (subscription: PushSubscription) => void;
}
