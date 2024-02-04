import { Component, OnInit } from '@angular/core';
import { Product, ProductWithSupermarket } from '../../shared/product';
import { ProductService } from '../shared/product.service';
import { Observable } from 'rxjs';
import { CartService } from '../shared/cart.service';
import { Cart } from 'src/shared/cart';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
})
export class Tab1Page implements OnInit {
  products: Product[] = [];
  cartItems: Cart[] = [];
  productsWithSupermarkets$: Observable<ProductWithSupermarket[]>;

  private readonly localStorageKey = 'cartItems'; // Chave para armazenar dados no localStorage

  constructor(
    public productService: ProductService,
    private cartService: CartService,
  ) {}

  ngOnInit() {
    this.productsWithSupermarkets$ =
      this.productService.getProductsWithSupermarkets();

    // Subscribe to the observable to log emitted data
    this.productsWithSupermarkets$.subscribe(
      (data) => {
        console.log('Emitted data:', data);
      },
      (error) => {
        console.error('Error fetching products with supermarkets:', error);
      }
    );

    this.productService.getProductList().subscribe((res) => {
      this.products = res.map((t) => {
        return {
          id: t.payload.doc.id,
          ...(t.payload.doc.data() as Product),
        };
      });
    });

    //carrinho
    this.cartService.cartItems$.subscribe((items) => {
      this.cartItems = items;
    });
  }

  addToCart(product: Product): void {
    this.cartService.addToCart(product);
    // Adicionar lógica adicional, se necessário
  }
}
