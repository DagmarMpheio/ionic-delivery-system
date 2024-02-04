import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Order } from 'src/shared/order';

@Injectable({
  providedIn: 'root',
})
export class OrdersService {
  constructor(private ngFirestore: AngularFirestore) {}

  continuarComprar(order: Order) {
    const pedidosCollection = this.ngFirestore.collection('pedidos');

    // Adiciona um novo documento à coleção "pedidos" com os dados da compra
    return pedidosCollection
      .add(order.toJSON())
      .then(() => {
        console.log('Compra registrada com sucesso!');
      })
      .catch((error) => {
        console.error('Erro ao registrar a compra:', error);
      });
  }
}
