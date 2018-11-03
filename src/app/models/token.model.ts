import { DishModel } from '@app/models';

export interface TokenModel {
    _id?: string;
    date: string;
    rollno: string;
    dishes: DishModel[];
}
