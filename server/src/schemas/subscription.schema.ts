import { Schema, SchemaTypes } from 'mongoose';
import { PushSubscription } from 'web-push';

export let SubscriptionSchema: Schema = new Schema({
    subscription: {type: String, unique: true, required: true},
    session: {type: SchemaTypes.ObjectId, ref: 'Session'}
});

// return subscription as a PushSubscription object
SubscriptionSchema.methods.getSubscription = function() {
    return JSON.parse(this.subscription) as PushSubscription;
};

// converts a PushSubscription object to a string before setting it.
SubscriptionSchema.methods.setSubscription = function(subscription: PushSubscription) {
    this.subscription = JSON.stringify(subscription);
};
