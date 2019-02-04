export interface DishModel {
    _id: string;
    short_id: string;
    name: string;
    price: number;
    days?: ('Sun' | 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat')[];
    slot?: ('Breakfast' | 'Lunch' | 'Dinner')[];
    prebookable?: boolean;
    frequency?: number;
    quantity?: number;
}
