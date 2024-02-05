import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { AuthenticationService } from 'src/shared/authentication-service';

@Component({
  selector: 'app-update-profile',
  templateUrl: './update-profile.page.html',
  styleUrls: ['./update-profile.page.scss'],
})
export class UpdateProfilePage implements OnInit {
  constructor(
    public authService: AuthenticationService,
    public router: Router,
    private alertController: AlertController
  ) {}

  userData: any;

  ngOnInit() {
    // Obter o user no localStorage
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    this.userData = user;
  }

  updateProfile() {
    this.authService
      .updateUserProfile(this.userData.uid, this.userData.displayName)
      .then(() => {
        //actualizar no locaStorage
        const updatedUser = JSON.parse(localStorage.getItem('user') || '{}');
        updatedUser.displayName = this.userData.displayName;
        localStorage.setItem('user', JSON.stringify(updatedUser));

        this.router.navigate(['/tabs/tab4']);
        this.presentSuccessAlert();
      });
  }

  async presentSuccessAlert() {
    const alert = await this.alertController.create({
      header: 'Sucesso!',
      message: 'Perfil actualizado.',
      buttons: ['OK'],
    });

    await alert.present();
  }
}
