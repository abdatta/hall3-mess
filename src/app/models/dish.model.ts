export interface DishModel {
    _id: string;
    short_id: string;
    name: string;
    price: number;
    slot?: ('Breakfast' | 'Lunch' | 'Dinner')[];
    prebookable?: boolean;
    quantity?: number;
}
