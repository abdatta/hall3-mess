export interface DishModel {
    _id: string;
    name: string;
    price: number;
    slot: ('Breakfast' | 'Lunch' | 'Dinner')[];
    prebookable: boolean;
    quantity?: number;
}
