import { Component, OnInit } from '@angular/core';
import { Product } from '../../shared/product';
import { ProductService } from '../shared/product.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
})
export class Tab1Page implements OnInit {
  products: Product[] = [];

  constructor(public productService: ProductService) {}

  ngOnInit() {
    this.productService.getProductList().subscribe((res) => {
      this.products = res.map((t) => {
        return {
          id: t.payload.doc.id,
          ...(t.payload.doc.data() as Product),
        };
      });
    });
  }

  productList() {
    this.productService.getProductList().subscribe((data) => {
      console.log(data);
    });
  }

  remove(id: any) {
    console.log(id);
    if (window.confirm('Tem a certeza que deseja excluir?')) {
      this.productService.deleteProduct(id);
    }
  }
}
