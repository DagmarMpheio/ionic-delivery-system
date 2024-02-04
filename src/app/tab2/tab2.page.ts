import { Component } from '@angular/core';
import { CartService } from '../shared/cart.service';
import { Cart } from 'src/shared/cart';
import { OrdersService } from '../shared/orders.service';
import { Order } from 'src/shared/order';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
})
export class Tab2Page {
  cartItems: Cart[] = [];

  constructor(
    private cartService: CartService,
    private orderService: OrdersService
  ) {}

  ngOnInit() {
    this.cartService.cartItems$.subscribe((items) => {
      this.cartItems = items;
    });
  }

  async addToCart(productId: string): Promise<void> {
    const product = await this.cartService
      .getProductById(productId)
      .toPromise();

    if (product) {
      this.cartService.addToCart(product);
    }
  }

  get total() {
    return this.cartService.total;
  }

  removeFromCart(productId: string): void {
    this.cartService.removeFromCart(productId);
  }

  clearCart(): void {
    this.cartService.clearCart();
  }

  getCartItemsType(): string {
    return typeof this.cartItems;
  }

  continuarCompra(): void {
    console.log('Objecto map: ', this.cartItems);
    const cartItemsType: string = this.getCartItemsType();
    console.log('Type of cartItems:', cartItemsType);
    // Criar uma instância de Order com os dados do carrinho e outros detalhes necessários
    const compraInfo = new Order();
    compraInfo.userId = 'PbDQAbB985eLf1hNRSsrMYiP6ep1';
    compraInfo.formaPagamento = 'Cartão de Crédito';
    compraInfo.status = 'Pendente';
    compraInfo.endereco = 'Rua da Compra, 123';
    compraInfo.total = this.total; // Valor total da compra
    //compraInfo.items = this.cartItems;
    compraInfo.items = this.cartItems;
    compraInfo.dataHoraCompra = new Date().toISOString(); // Usar a data/hora atual ou obtenha de outra maneira

    console.log('compraInfo:', compraInfo);

    // Chame o método continuarComprar do PedidoService
    this.orderService
      .continuarComprar(compraInfo)
      .then(() => {
        // Ações adicionais após o registro da compra (ex: limpar o carrinho)
        this.cartService.clearCart();
        console.log('A compra foi registrada com sucesso!');
      })
      .catch((error) => {
        console.error('Erro ao registrar a compra:', error);
      });
  }
}
