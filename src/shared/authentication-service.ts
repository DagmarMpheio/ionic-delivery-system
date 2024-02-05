import { Injectable, NgZone } from '@angular/core';
import * as auth from 'firebase/auth';
import { User } from './user';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  userData: any;
  constructor(
    public afStore: AngularFirestore,
    public ngFireAuth: AngularFireAuth,
    public router: Router,
    public ngZone: NgZone
  ) {
    //assim que o usuario fazer autenticacao, obter os dados do mesmo e armazenar no local storage para mantê-lo autenticado
    // caso os dados nao estejam armazenado, o objecto json fica vazio
    this.ngFireAuth.authState.subscribe((user) => {
      if (user) {
        this.userData = user;
        localStorage.setItem('user', JSON.stringify(this.userData));
        JSON.parse(localStorage.getItem('user') || '{}');
      } else {
        localStorage.setItem('user', null || '{}');
        JSON.parse(localStorage.getItem('user') || '{}');
      }
    });
  }

  // Login com email e password
  SignIn(email: any, password: any) {
    return this.ngFireAuth
      .signInWithEmailAndPassword(email, password)
      .then((result) => {
        this.SetUserData(result.user);
      });
  }
  // Registar usuario com email e password
  RegisterUser(email: any, password: any) {
    return this.ngFireAuth
      .createUserWithEmailAndPassword(email, password)
      .then((result) => {
        this.SetUserData(result.user);
      });
  }

  // Enviar Email  de verificacao quando um novo usuario regista-se
  SendVerificationMail() {
    return this.ngFireAuth.currentUser.then((user: any) => {
      return user.sendEmailVerification().then(() => {
        this.router.navigate(['verify-email']);
      });
    });
  }

  /* SendVerificationMail() {
    return this.ngFireAuth.auth.currentUser.sendEmailVerification()
    .then(() => {
      this.router.navigate(['verify-email']);
    })
  } */

  // Repôr password
  PasswordRecover(passwordResetEmail: any) {
    return this.ngFireAuth
      .sendPasswordResetEmail(passwordResetEmail)
      .then(() => {
        window.alert(
          'O e-mail de redefinição da palavra-passe foi enviado, verifique a sua caixa de entrada.'
        );
      })
      .catch((error) => {
        window.alert(error);
      });
  }

  // Retorna verdadeiro se o usuario esta autenticado
  get isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user !== null && user.emailVerified !== false ? true : false;
  }

  // Retornar verdadeiro se o email do usuario foi verificado
  get isEmailVerified(): boolean {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user.emailVerified !== false ? true : false;
  }

  // Retornar verdadeiro se o usuario for admin
  isUserAdmin(): boolean {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user !== null && user.isAdmin === true;
  }

  //Autenticacao com Gmail
  GoogleAuth() {
    return this.AuthLogin(new auth.GoogleAuthProvider());
  }

  //Provedores de autenticacao
  AuthLogin(provider: any) {
    return this.ngFireAuth
      .signInWithPopup(provider)
      .then((result) => {
        this.ngZone.run(() => {
          this.router.navigate(['dashboard']);
        });
        this.SetUserData(result.user);
      })
      .catch((error) => {
        window.alert(error);
      });
  }

  // Armazenar os dados do usuario no local storage e na base de dados
  SetUserData(user: any) {
    const userRef: AngularFirestoreDocument<any> = this.afStore.doc(
      `users/${user.uid}`
    );
    const userData: User = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      emailVerified: user.emailVerified,
      isAdmin: false,
    };
    return userRef.set(userData, {
      merge: true,
    });
  }

  // Terminar sessao
  SignOut() {
    return this.ngFireAuth.signOut().then(() => {
      localStorage.removeItem('user');
      this.router.navigate(['login']);
    });
  }
  // Actualizar o perfil do usuário
  updateUserProfile(displayName: string, photoURL: string): Promise<void> {
    return (
      this.ngFireAuth.currentUser
        /* .then((user) => {
        if (user) {
          // Actualizar o perfil do usuário com os novos dados
          return user.updateProfile({
            displayName,
            photoURL,
          });
        }
      }) */
        .then(() => {
          // Actualizar os dados no Firestore
          return this.updateUserData({ displayName, photoURL });
        })
        .catch((error) => {
          // Lidar com erros durante a actualização do perfil
          console.error(error);
          throw error;
        })
    );
  }

  // Método para actualizar os dados do usuário no Firestore
  updateUserData(userData: any): Promise<void> {
    const userRef: AngularFirestoreDocument<any> = this.afStore.doc(
      `users/${this.userData.uid}`
    );

    return userRef.set(userData, { merge: true });
  }
}
