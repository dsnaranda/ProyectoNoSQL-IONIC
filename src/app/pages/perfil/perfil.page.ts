import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { UserProfile } from '../../Interfaces/interfaceUsuarios';
import { LoginService } from '../../servicios/server/login.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { IonicModule, AlertController, LoadingController } from '@ionic/angular';
import { Router } from '@angular/router'; // Importar Router
import { addIcons } from 'ionicons';
import { mailOutline, callOutline, logOutOutline } from 'ionicons/icons';

addIcons({
  'mail-outline': mailOutline,
  'call-outline': callOutline,
  'log-out-outline': logOutOutline,
});

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [IonicModule, FormsModule, CommonModule],
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss']
})
export class PerfilPage implements OnInit {
  @ViewChild('fileInput', { static: false }) fileInput!: ElementRef;
  userProfile: any = {}; // Inicializar como objeto vacío
  isDisabled: boolean = true;
  isUploadDisabled: boolean = true;
  loading: boolean = false;
  foto: string = 'https://pbs.twimg.com/media/GJHy4U6XEAAdfAI?format=jpg&name=360x360';

  constructor(
    private loginService: LoginService,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private router: Router // Inyectar Router correctamente
  ) {}

  ngOnInit(): void {
    this.loadUserData();
  }

  async onLogout() {
    const alert = await this.alertController.create({
      header: 'Confirmar',
      message: '¿Estás seguro de que quieres cerrar sesión?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Cerrar sesión',
          handler: () => {
            this.loginService.logout();
          },
        },
      ],
    });

    await alert.present();
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

  async showPhotoOptions() {
    const alert = await this.alertController.create({
      header: 'Foto de Perfil',
      message: '¿Quieres cambiar tu foto de perfil?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Cambiar',
          handler: () => {
            this.isUploadDisabled = false; // Habilita el input
            setTimeout(() => {
              this.fileInput.nativeElement.click(); // Abre el selector de archivos
            }, 100);
          },
        },
      ],
    });

    await alert.present();
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];

    if (file) {
      if (!this.userProfile?.id) {
        this.showAlert('Error', 'No se puede subir la imagen, falta el ID del usuario.', 'error');
        return;
      }

      // Crear una URL local para la imagen seleccionada
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = () => {
        this.userProfile.foto = reader.result as string;
      };

      this.uploadImage(this.userProfile.id, file);
    }
  }

  async uploadImage(userId: string, file: File): Promise<void> {
    this.loading = true; // Mostrar animación de carga
    this.loginService.uploadImage(userId, file).subscribe({
      next: async (response) => {
        console.log('Imagen subida correctamente:', response);

        // Actualizar la imagen en el perfil
        this.userProfile.foto = response.usuario.foto;
        this.loginService.updateUserCookie(this.userProfile);

        const successAlert = await this.alertController.create({
          header: '¡Éxito!',
          message: 'Tu foto de perfil se actualizó correctamente.',
          buttons: ['OK'],
          cssClass: 'alert-success',
        });
        await successAlert.present();

        this.isUploadDisabled = true; // Deshabilita nuevamente
        this.loading = false; // Ocultar animación de carga
      },
      error: async (error) => {
        console.error('Error al subir la imagen:', error);
        const errorAlert = await this.alertController.create({
          header: 'Error',
          message: 'Hubo un problema al subir la imagen.',
          buttons: ['Aceptar'],
          cssClass: 'alert-error',
        });
        await errorAlert.present();
        this.loading = false; // Ocultar animación de carga
      },
    });
  }

  async confirmarcambiarClave() {
    const correo = this.userProfile.correo;

    if (!correo) {
      this.showAlert('Error', 'No se puede cambiar la contraseña, falta el correo del usuario.', 'error');
      return;
    }

    this.loginService.changePass(correo).subscribe({
      next: async () => {
        const alert = await this.alertController.create({
          header: 'Confirmar',
          message: '¿Estás seguro de que quieres cambiar tu contraseña?',
          buttons: [
            {
              text: 'Cancelar',
              role: 'cancel',
            },
            {
              text: 'Cambiar',
              handler: () => {
                this.router.navigate(['/change']);
              },
            },
          ],
        });

        await alert.present();
      },
      error: async (error) => {
        console.error('Error al solicitar el cambio de contraseña:', error);
        this.showAlert('Error', 'Hubo un problema al solicitar el cambio de contraseña.', 'error');
      },
    });
  }

  async showAlert(header: string, message: string, icon: 'success' | 'error') {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK'],
      cssClass: icon === 'success' ? 'alert-success' : 'alert-error',
    });
    await alert.present();
  }
}