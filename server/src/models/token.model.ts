import { Document } from 'mongoose';
/**
 * Interface for Token
 *
 * @interface TokenModel
 */
export interface TokenModel extends Document {
    date: string;
    rollno: string;
    dishes: {
        name: string;
        price: number;
        quantity: number;
    }[];
}
