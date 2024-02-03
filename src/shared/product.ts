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
