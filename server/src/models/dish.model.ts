import { Document } from 'mongoose';
/**
 * Interface for Dish
 *
 * @interface DishModel
 */
export interface DishModel extends Document {
    _id: string;
    short_id: string;
    name: string;
    price: number;
    days: ('Sun' | 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat')[];
    slot: ('Breakfast' | 'Lunch' | 'Dinner')[];
    frequency: any;
    prebookable: boolean;
}
