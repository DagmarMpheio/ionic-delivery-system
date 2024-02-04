import { Product } from './product';

export class Cart {
  id?: string;
  quantity: number;
  product: Product;
  productId: string;
  price: number;
  subtotal: number;
}
