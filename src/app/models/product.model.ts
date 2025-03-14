export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  quantity: number;
  category: string;
  rating: Rating;
}

export interface Rating {
  rate: number;
  count: number;
}
