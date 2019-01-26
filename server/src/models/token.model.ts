import { Document, Types } from 'mongoose';
/**
 * Interface for Token
 *
 * @interface TokenModel
 */
export interface TokenModel extends Document {
    id: string | Types.ObjectId;
    date: string;
    rollno: string;
    dishes: {
        _id: string;
        name: string;
        price: number;
        quantity: number;
    }[];
}
