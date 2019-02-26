import { Document } from 'mongoose';
/**
 * Interface for prebooking
 *
 * @interface PrebookingModel
 */
export interface PrebookingModel extends Document {
    dish_id: string;
    quantity: number;
    date: string;
    rollno: string;
}
