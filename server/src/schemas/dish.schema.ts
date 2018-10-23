import { Schema } from 'mongoose';

export let DishSchema: Schema = new Schema({
    _id: {type: String, unique: true, required: true},
    name: {type: String, required: true},
    price: {type: Number, required: true},
    days: {type: [{type: String, enum: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']}], required: true},
    slot: {type: [{type: String, enum: ['Breakfast', 'Lunch', 'Dinner']}], required: true},
    prebookable: {type: Boolean, default: false}
});
