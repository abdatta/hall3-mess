import { Schema } from 'mongoose';

export let TokenSchema: Schema = new Schema({
    date: {type: String, required: true},
    rollno: {type: String, required: true},
    dishes: {type: [{
        name: {type: String, required: true},
        price: {type: Number, required: true},
        quantity: {type: Number, required: true}
    }], required: true}
});
