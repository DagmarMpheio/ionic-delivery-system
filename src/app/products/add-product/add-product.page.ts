import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductService } from '../../shared/product.service';
import { Supermarket } from '../../../shared/supermarket';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.page.html',
  styleUrls: ['./add-product.page.scss'],
})
export class AddProductPage implements OnInit {
  productForm: FormGroup;
  supermercados: Supermarket[];
  imageFile: File;

  constructor(
    private productService: ProductService,
    public formBuilder: FormBuilder,
    private router: Router,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    this.productForm = this.formBuilder.group({
      nome: ['', Validators.required],
      preco: [0, [Validators.required, Validators.min(0)]],
      descricao: ['', Validators.required],
      emPromocao: [false],
      desconto: [0, [Validators.min(0), Validators.max(100)]],
      supermercadoId: ['', Validators.required],
      imageFile: [null, Validators.required],
    });

    // Carregue a lista de supermercados
    this.productService.getSupermarketsList().subscribe((data) => {
      this.supermercados = data.map((e) => {
        return {
          id: e.payload.doc.id,
          ...(e.payload.doc.data() as Supermarket),
        };
      });
    });
  }

  formSubmit() {
    if (!this.productForm.valid) {
      return false;
    } else {
      return this.productService
        .createProduct(this.productForm.value, this.imageFile)
        .then((res) => {
          console.log(res);
          this.productForm.reset();
          this.router.navigate(['/product-list']);
          this.presentSuccessAlert();
        })
        .catch((error) => console.log(error));
    }
  }

  onFileSelected(event: any): void {
    this.imageFile = event.target.files[0];
  }

  async presentSuccessAlert() {
    const alert = await this.alertController.create({
      header: 'Sucesso!',
      message: 'Produto cadastrado com sucesso.',
      buttons: ['OK'],
    });

    await alert.present();
  }
}
