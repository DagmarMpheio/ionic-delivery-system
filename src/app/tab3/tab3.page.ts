import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Order } from 'src/shared/order';
import { OrdersService } from '../shared/orders.service';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
})
export class Tab3Page implements OnInit {
  orders$: Observable<Order[]>;
  selectedOrder: Order | null = null;

  constructor(private ordersService: OrdersService) {}

  ngOnInit(): void {
    this.orders$ = this.ordersService.getOrdersForAuthenticatedUser();
  }

  showOrderDetails(order: Order): void {
    this.selectedOrder = order;
  }

  hideOrderDetails(): void {
    this.selectedOrder = null;
  }
}
