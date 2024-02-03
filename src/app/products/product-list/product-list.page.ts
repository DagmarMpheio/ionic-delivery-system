import { Component, OnInit } from '@angular/core';
import { Product } from '../../../shared/product';
import { ProductService } from '../../shared/product.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.page.html',
  styleUrls: ['./product-list.page.scss'],
})
export class ProductListPage implements OnInit {
  products: Product[] = [];

  constructor(
    public productService: ProductService,
    private alertController: AlertController
  ) {}

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
      this.presentSuccessAlert();
    }
  }

  async presentSuccessAlert() {
    const alert = await this.alertController.create({
      header: 'Sucesso!',
      message: 'Produto excluído com sucesso.',
      buttons: ['OK'],
    });

    await alert.present();
  }
}
