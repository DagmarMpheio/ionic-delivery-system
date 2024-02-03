import { Injectable } from '@angular/core';
import { Product } from '../../shared/product';

import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor(
    private ngFirestore: AngularFirestore,
    private router: Router,
    private storage: AngularFireStorage
  ) {}

  // Novo produto
  /* createProduct(product: Product) {
    return this.ngFirestore.collection('produtos').add(product);
  } */
  async createProduct(product: Product, imageFile: File) {
    try {
      // Faz o upload da imagem
      const imageUrl = await this.uploadImage(imageFile);

      // Adiciona o URL da imagem ao objeto do produto
      product.imgUrl = imageUrl;

      // Adiciona o produto ao Firestore
      const docRef = await this.ngFirestore.collection('produtos').add(product);

      console.log(`Produto criado com ID: ${docRef.id}`);
    } catch (error) {
      console.error('Erro ao criar o produto:', error);
    }
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
  /*  deleteProduct(id: string) {
    this.ngFirestore.doc('produtos/' + id).delete();
  } */

  deleteProduct(id: string, imageUrl: string) {
    // Verificar se há uma URL de imagem associada ao produto
    if (imageUrl) {
      // Obter a referência do armazenamento a partir da URL da imagem
      const storageRef = this.storage.refFromURL(imageUrl);

      // Excluir a imagem do armazenamento
      storageRef.delete().subscribe(
        () => console.log('Imagem excluída com sucesso.'),
        (error) => console.error('Erro ao excluir imagem:', error)
      );
    }

    // Excluir o documento no Firestore
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

  // Marcar um produto como em promoção
  markProductAsPromotional(productId: string, desconto: number) {
    this.ngFirestore
      .collection('produtos')
      .doc(productId)
      .update({ emPromocao: true, desconto: desconto })
      .then(() => {
        console.log('Produto adicionado da promoção com sucesso.');
      })
      .catch((error) => {
        console.log('Erro ao adicionar o produto da promoção\nErro: ' + error);
      });
  }

  // Remover um produto da promoção
  removeProductFromPromotion(productId: any) {
    this.ngFirestore
      .collection('produtos')
      .doc(productId)
      .update({ emPromocao: false, desconto: 0 })
      .then(() => {
        console.log('Produto removido da promoção com sucesso.');
      })
      .catch((error) => {
        console.log('Erro ao remover o produto da promoção\nErro: ' + error);
      });
  }

  //metodo para fazer upload de imagens
  uploadImage(file: File) {
    const currentDate = Date.now();

    const filePath = `product_images/${currentDate}.jpg`;
    const storageRef = this.storage.ref(filePath);
    const uploadTask = this.storage.upload(filePath, file);

    return new Promise<string>((resolve, reject) => {
      uploadTask
        .snapshotChanges()
        .pipe(
          finalize(() => {
            storageRef.getDownloadURL().subscribe(
              (downloadURL) => resolve(downloadURL),
              (error) => reject(error)
            );
          })
        )
        .subscribe();
    });
  }
}
