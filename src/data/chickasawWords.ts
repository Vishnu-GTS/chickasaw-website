export interface ChickasawWord {
    id: string;
    english: string;
    chickasaw: string;
    category: string;
    audioUrl?: string;
}

export const chickasawWords: ChickasawWord[] = [
    // Animals
    { id: '1', english: 'Baby', chickasaw: 'Puskush', category: 'People' },
    { id: '2', english: 'Bear', chickasaw: 'Kinta', category: 'Animal' },
    { id: '3', english: 'Bird', chickasaw: 'Foshi', category: 'Animal' },
    { id: '4', english: 'Boy', chickasaw: 'Chepota nukni', category: 'Animal' },
    { id: '5', english: 'Buffalo', chickasaw: 'Yunush', category: 'Animal' },
    { id: '6', english: 'Cat', chickasaw: 'Katoshi', category: 'Animal' },
    { id: '7', english: 'Dog', chickasaw: 'Ofi', category: 'Animal' },
    { id: '8', english: 'Eagle', chickasaw: 'Imoshe', category: 'Animal' },
    { id: '9', english: 'Fish', chickasaw: 'Nani', category: 'Animal' },
    { id: '10', english: 'Horse', chickasaw: 'Sobak', category: 'Animal' },

    // People
    { id: '11', english: 'Girl', chickasaw: 'Tek', category: 'People' },
    { id: '12', english: 'Man', chickasaw: 'Hattak', category: 'People' },
    { id: '13', english: 'Woman', chickasaw: 'Ihollo', category: 'People' },
    { id: '14', english: 'Child', chickasaw: 'Osi', category: 'People' },
    { id: '15', english: 'Friend', chickasaw: 'Ishki', category: 'People' },

    // Colors
    { id: '16', english: 'Red', chickasaw: 'Homma', category: 'Colors' },
    { id: '17', english: 'Blue', chickasaw: 'Okchamali', category: 'Colors' },
    { id: '18', english: 'Green', chickasaw: 'Lakna', category: 'Colors' },
    { id: '19', english: 'Yellow', chickasaw: 'Lakna homma', category: 'Colors' },
    { id: '20', english: 'Black', chickasaw: 'Losa', category: 'Colors' },

    // Weather
    { id: '21', english: 'Sun', chickasaw: 'Hash', category: 'Weather' },
    { id: '22', english: 'Rain', chickasaw: 'Osh', category: 'Weather' },
    { id: '23', english: 'Wind', chickasaw: 'Mahli', category: 'Weather' },
    { id: '24', english: 'Snow', chickasaw: 'Osh homma', category: 'Weather' },
    { id: '25', english: 'Cloud', chickasaw: 'Osh homma', category: 'Weather' },

    // Plants & Trees
    { id: '26', english: 'Tree', chickasaw: 'Iti', category: 'Plants & Trees' },
    { id: '27', english: 'Flower', chickasaw: 'Iti homma', category: 'Plants & Trees' },
    { id: '28', english: 'Grass', chickasaw: 'Hashi', category: 'Plants & Trees' },
    { id: '29', english: 'Leaf', chickasaw: 'Iti homma', category: 'Plants & Trees' },
    { id: '30', english: 'Root', chickasaw: 'Iti homma', category: 'Plants & Trees' },

    // Fruits & Foods
    { id: '31', english: 'Apple', chickasaw: 'Iti homma', category: 'Fruits & Foods' },
    { id: '32', english: 'Bread', chickasaw: 'Paska', category: 'Fruits & Foods' },
    { id: '33', english: 'Corn', chickasaw: 'Champuli', category: 'Fruits & Foods' },
    { id: '34', english: 'Meat', chickasaw: 'Nipi', category: 'Fruits & Foods' },
    { id: '35', english: 'Water', chickasaw: 'Oka', category: 'Fruits & Foods' },

    // Transportation
    { id: '36', english: 'Car', chickasaw: 'Mobila', category: 'Transportation' },
    { id: '37', english: 'Boat', chickasaw: 'Oka', category: 'Transportation' },
    { id: '38', english: 'Train', chickasaw: 'Mobila', category: 'Transportation' },
    { id: '39', english: 'Plane', chickasaw: 'Mobila', category: 'Transportation' },
    { id: '40', english: 'Bicycle', chickasaw: 'Mobila', category: 'Transportation' }
];
