import { Schema, SchemaTypes } from 'mongoose';

export let PrebookingSchema: Schema = new Schema({
    dish_id: {type: SchemaTypes.ObjectId, ref: 'Dish'},
    quantity: {type: Number, required: true},
    date: {type: String, required: true},
    rollno: {type: String, required: true}, 
});
