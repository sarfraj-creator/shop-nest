export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;       // mapped from thumbnail in DummyJSON
  rating: {
    rate: number;      // mapped from rating (number) in DummyJSON
    count: number;     // mapped from stock in DummyJSON
  };
  // Extra fields from DummyJSON (available if needed)
  brand?: string;
  stock?: number;
  discountPercentage?: number;
  images?: string[];
}

export interface CartItem extends Product {
  quantity: number;
}

export interface CheckoutFormValues {
  name: string;
  email: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}
