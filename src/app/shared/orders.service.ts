import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/compat/firestore';
import { Observable, map, of } from 'rxjs';
import { Order } from 'src/shared/order';

@Injectable({
  providedIn: 'root',
})
export class OrdersService {
  private ordersCollection: AngularFirestoreCollection<Order>;

  constructor(private ngFirestore: AngularFirestore) {
    this.ordersCollection = this.ngFirestore.collection<Order>('pedidos');
  }

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

  //obter todos os pedidos
 /*  getAllOrders(): Observable<Order[]> {
    return this.ordersCollection.valueChanges();
  } */

  getAllOrders(): Observable<Order[]> {
    return this.ordersCollection.snapshotChanges().pipe(
      map((actions) => {
        return actions.map((a) => {
          const data = a.payload.doc.data() as Order;
          const id = a.payload.doc.id;
          return { id, ...data } as unknown as Order;
        });
      })
    );
  }
  
  //obter os pedidos do usuario autenticado
  getOrdersForAuthenticatedUser(): Observable<Order[]> {
    // Obter o UID no localStorage
    const userUID = JSON.parse(localStorage.getItem('user') || '{}').uid;

    if (userUID) {
      return this.ngFirestore
        .collection<Order>('pedidos', (ref) =>
          ref.where('userId', '==', userUID).orderBy('dataHoraCompra', 'desc')
        )
        .valueChanges();
    } else {
      // Retorna um Observable vazio se o UID não estiver presente
      return of([]);
    }
  }

  aprovarPedido(orderId: string): Promise<void> {
    const pedidoRef = this.ordersCollection.doc(orderId);

    // Atualizar o status para 'Aprovado'
    return pedidoRef
      .update({ status: 'Aprovado' })
      .then(() => {
        console.log('Pedido aprovado com sucesso!');
      })
      .catch((error) => {
        console.error('Erro ao aprovar o pedido:', error);
      });
  }

  rejeitarPedido(orderId: string): Promise<void> {
    const pedidoRef = this.ordersCollection.doc(orderId);

    // Atualizar o status para 'Rejeitado'
    return pedidoRef
      .update({ status: 'Rejeitado' })
      .then(() => {
        console.log('Pedido rejeitado com sucesso!');
      })
      .catch((error) => {
        console.error('Erro ao rejeitar o pedido:', error);
      });
  }
}
