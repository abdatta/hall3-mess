import { Document } from 'mongoose';
/**
 * Interface for User
 *
 * @interface DishModel
 */
export interface DishModel extends Document {
    _id: string;
    name: string;
    days: ('Sun' | 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat')[];
    slot: ('Breakfast' | 'Lunch' | 'Dinner')[];
    prebookable: boolean;
}
