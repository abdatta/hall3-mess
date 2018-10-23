import { Document } from 'mongoose';
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
    tokens: string[];
    generateHash: (password: string) => string;
    validPassword: (password: string) => boolean;
}
