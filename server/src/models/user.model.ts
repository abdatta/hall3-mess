import { Document } from 'mongoose';
import { TokenModel } from './token.model';
/**
 * Interface for User
 *
 * @interface UserModel
 */
export interface UserModel extends Document {
    name: string;
    rollno: string;
    password: string;
    email: string;
    tokens: string[] | TokenModel[];
    generateHash: (password: string) => string;
    validPassword: (password: string) => boolean;
}
