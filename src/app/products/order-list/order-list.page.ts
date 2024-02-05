import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { OrdersService } from 'src/app/shared/orders.service';
import { Order } from 'src/shared/order';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.page.html',
  styleUrls: ['./order-list.page.scss'],
})
export class OrderListPage implements OnInit {
  constructor(
    private ordersService: OrdersService,
    private alertController: AlertController
  ) {}
  orders$: Observable<Order[]>;
  selectedOrder: Order | null = null;

  ngOnInit() {
    this.orders$ = this.ordersService.getAllOrders();
  }

  //mostrar os detalhes do pedido
  showOrderDetails(order: Order): void {
    this.selectedOrder = order;
  }

  //ocultar os detalhes do pedido
  hideOrderDetails(): void {
    this.selectedOrder = null;
  }

  aprovarPedido(orderId: string): void {
    this.ordersService.aprovarPedido(orderId);
    this.presentSuccessAlert('Pedido aprovado com sucesso.');
  }

  rejeitarPedido(orderId: string): void {
    this.ordersService.rejeitarPedido(orderId);
    this.presentSuccessAlert('Pedido rejeitado com sucesso.');
  }

  async presentSuccessAlert(msg: any) {
    const alert = await this.alertController.create({
      header: 'Sucesso!',
      message: msg,
      buttons: ['OK'],
    });

    await alert.present();
  }
}
