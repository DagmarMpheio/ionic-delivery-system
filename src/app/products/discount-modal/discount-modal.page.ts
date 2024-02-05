import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { DiscountService } from '../../shared/discount.service';

@Component({
  selector: 'app-discount-modal',
  templateUrl: './discount-modal.page.html',
  styleUrls: ['./discount-modal.page.scss'],
})
export class DiscountModalPage implements OnInit {
  desconto: number;

  constructor(
    private modalController: ModalController,
    private discountService: DiscountService,
    private alertController: AlertController
  ) {}

  ngOnInit() {}

  // Fechar a modal sem aplicar desconto
  closeModal() {
    this.modalController.dismiss();
  }

  // Aplicar desconto e fechar a modal
  applyDiscount() {
    if (this.desconto >= 0 && this.desconto <= 100) {
      this.discountService.setDesconto(this.desconto);
      this.modalController.dismiss({ role: 'ok', desconto: this.desconto });
      //this.modalController.dismiss(this.desconto);
    }else{
      this.presentSuccessAlert();
    }
  }

  async presentSuccessAlert() {
    const alert = await this.alertController.create({
      header: 'Sucesso!',
      message: 'O valor de desconto deve ser maior que 0 e menor ou igual a 100 .',
      buttons: ['OK'],
    });

    await alert.present();
  }
}
