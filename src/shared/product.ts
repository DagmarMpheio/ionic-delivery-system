import { Supermarket } from './supermarket';

export interface Product {
  $key: string;
  nome: string;
  preco: number;
  descricao: string;
  emPromocao: boolean;
  desconto?: number;
  imgUrl: string;
  supermercadoId: string;
}

export interface ProductWithSupermarket {
  product: Product;
  supermarket: Supermarket;
}
