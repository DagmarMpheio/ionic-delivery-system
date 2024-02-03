import { Injectable } from '@angular/core';
import { Product } from '../../shared/product';
import {
  AngularFireDatabase,
  AngularFireList,
  AngularFireObject,
} from '@angular/fire/compat/database';

import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor(private ngFirestore: AngularFirestore, private router: Router) {}

  // Novo produto
  createProduct(product: Product) {
    return this.ngFirestore.collection('produtos').add(product);
  }

  // Obter produto pelo id
  getProduct(id: any) {
    return this.ngFirestore.collection('produtos').doc(id).valueChanges();
  }

  // Obter List de produtos
  getProductList() {
    return this.ngFirestore.collection('produtos').snapshotChanges();
  }

  // Actualizar produto
  updateProduct(id: any, product: Product) {
    this.ngFirestore
      .collection('produtos')
      .doc(id)
      .update(product)
      .then(() => {
        this.router.navigate(['/product-list']);
      })
      .catch((error) => console.log(error));
  }

  // excluir produto
  deleteProduct(id: string) {
    this.ngFirestore.doc('produtos/' + id).delete();
  }

  // Obter produtos em promoção
  getPromotedProducts() {
    return this.ngFirestore
      .collection('produtos', (ref) => ref.where('emPromocao', '==', true))
      .snapshotChanges();
  }

  // Calcular preço com desconto
  calculateDiscountedPrice(preco: number, desconto: number): number {
    if (desconto && desconto > 0 && desconto <= 100) {
      const descontoDecimal = desconto / 100;
      const precoComDesconto = preco - preco * descontoDecimal;
      return parseFloat(precoComDesconto.toFixed(2)); // Arredondar para 2 casas decimais
    } else {
      return preco; // Retornar o preço sem desconto se o desconto for inválido
    }
  }

  //Método para obter a lista de supermercados
  getSupermarketsList() {
    return this.ngFirestore.collection('supermercados').snapshotChanges();
  }
}
