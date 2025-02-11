import { Component, OnInit } from '@angular/core';
import { UserProfile } from '../../Interfaces/interfaceUsuarios';
import { LoginService } from '../../servicios/server/login.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { IonicModule, AlertController } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { mailOutline, callOutline } from 'ionicons/icons';

addIcons({
  'mail-outline': mailOutline,
  'call-outline': callOutline,
});

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [IonicModule, FormsModule, CommonModule],
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss']
})

export class PerfilPage implements OnInit {
  userProfile: any = {}; // Inicializar como objeto vacío
  isDisabled: boolean = true;
  foto: string = 'https://pbs.twimg.com/media/GJHy4U6XEAAdfAI?format=jpg&name=360x360';

  constructor(private loginService: LoginService, private alertController: AlertController) {}

  ngOnInit(): void {
    this.loadUserData();
  }

  loadUserData(): void {
    const userData = this.loginService.getUser();

    if (userData) {
      this.userProfile = { ...userData };

      if (!this.userProfile.id) {
        const savedId = localStorage.getItem('userId');
        if (savedId) {
          console.warn('ID no encontrado en la cookie. Restaurando desde localStorage:', savedId);
          this.userProfile.id = savedId;
        } else {
          console.error('No se encontró el ID del usuario en cookies ni en localStorage.');
        }
      }

      console.log('Datos de usuario actualizados:', this.userProfile);
    } else {
      console.warn('No se encontraron datos de usuario en la cookie.');
    }
  }

  enableForm(): void {
    this.isDisabled = false;
  }

  async cancel(): Promise<void> {
    this.loadUserData();
    this.isDisabled = true;

    const alert = await this.alertController.create({
      header: 'Cancelado',
      message: 'Los cambios han sido descartados.',
      buttons: ['OK'],
      cssClass: 'alert-custom',
    });

    await alert.present();
  }

  async saveData(): Promise<void> {
    if (!this.userProfile || !this.userProfile.id) {
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'No se puede actualizar el perfil. Falta el ID del usuario.',
        buttons: ['Aceptar'],
        cssClass: 'alert-error',
      });
      await alert.present();
      return;
    }

    const loading = await this.alertController.create({
      header: 'Guardando cambios...',
      message: 'Por favor, espera mientras actualizamos tu información.',
      backdropDismiss: false,
      cssClass: 'alert-loading',
    });
    await loading.present();

    this.loginService.updateUsuario(this.userProfile.id, this.userProfile).subscribe({
      next: async (updatedUser) => {
        console.log('Usuario actualizado correctamente:', updatedUser);
        this.loginService.updateUserCookie(updatedUser);
        setTimeout(() => {
          this.loadUserData();
          if (!this.userProfile.id) {
            console.warn('Se recuperó el usuario, pero falta el ID. Restaurando...');
            this.userProfile.id = updatedUser.id;
          }
        }, 200);

        this.isDisabled = true;
        loading.dismiss();

        const successAlert = await this.alertController.create({
          header: '¡Éxito!',
          message: 'Tu perfil se actualizó correctamente.',
          buttons: ['OK'],
          cssClass: 'alert-success',
        });
        await successAlert.present();
      },
      error: async (error) => {
        console.error('Error al actualizar el usuario:', error);
        this.isDisabled = true;
        loading.dismiss();

        const errorAlert = await this.alertController.create({
          header: 'Error',
          message: 'Hubo un problema al actualizar tu perfil. Por favor, intenta nuevamente.',
          buttons: ['Aceptar'],
          cssClass: 'alert-error',
        });
        await errorAlert.present();
      },
    });
  }
}
