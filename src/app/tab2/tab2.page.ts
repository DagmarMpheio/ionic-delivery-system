import { Component } from '@angular/core';
import { CartService } from '../shared/cart.service';
import { Cart } from 'src/shared/cart';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
})
export class Tab2Page {
  cartItems: Cart[] = [];

  constructor(private cartService: CartService) {}

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

  continuarCompra(): void {
    // Adicione o código aqui para navegar para a próxima página ou realizar ações relacionadas à continuação da compra.
    console.log('Continuar Compra!');
  }
}
