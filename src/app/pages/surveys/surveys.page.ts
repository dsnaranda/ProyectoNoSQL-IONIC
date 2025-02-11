  import {ChangeDetectorRef, Component, OnInit } from '@angular/core';
  import { CommonModule } from '@angular/common';
  import { FormsModule } from '@angular/forms';
  import {Router, RouterLink } from '@angular/router';
  import { Encuesta } from '../../Interfaces/interfaceEncuestas';
  import { LoginService } from 'src/app/servicios/server/login.service';
  import { RespuestasService } from 'src/app/servicios/server/respuestas.service';
  import { DashboardHomeService } from 'src/app/servicios/server/encuestas.service';
  import { Respuestas } from 'src/app/Interfaces/interfaceRespuestas';
  import { AlertController } from '@ionic/angular';


  import {
    IonContent,
    IonItem,
    IonPopover,
    IonList,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonButton,
    IonIcon
  } from '@ionic/angular/standalone';
  import { addIcons } from 'ionicons';
  import { ellipsisHorizontal, ellipsisVertical } from 'ionicons/icons';  // Cambio importante aquí

  addIcons({
    'ellipsis-horizontal': ellipsisHorizontal,  // Registro del icono
  });


  @Component({
    selector: 'app-surveys',
    templateUrl: './surveys.page.html',
    styleUrls: ['./surveys.page.scss'],
    standalone: true,
    imports: [
      CommonModule,
      FormsModule,
      RouterLink,
      IonContent,
      IonItem,
      IonPopover,
      IonList,
      IonCard,
      IonCardHeader,
      IonCardTitle,
      IonCardContent,
      IonButton,
      IonIcon
    ]
  })
  export class SurveysPage implements OnInit {
    encuestas: Encuesta[] = [];
    respuestas: Respuestas[] = [];
    

    isMenuOpen = false;
    menuEvent: any;
    selectedEncuestaId: number | null = null;

    constructor(
      private encuestaService: DashboardHomeService,
      private loginService: LoginService,
      private cdr: ChangeDetectorRef,
      private respuestaService: RespuestasService,
      private router: Router,
      private alertController: AlertController
    ) {
        addIcons({ellipsisVertical});}

    ngOnInit(): void {
      const usuario = this.loginService.getUser();
      if (usuario) {
        this.obtenerEncuestas(usuario.id);
      }
    }

    obtenerEncuestas(idUsuario: string) {
      this.encuestaService.obtenerEncuestasPorUsuario(idUsuario).subscribe(
        (data: any) => {
          if (data && data.encuestas) {
            this.encuestas = data.encuestas.map((encuesta: any) => ({
              id: encuesta._id,
              titulo: encuesta.titulo,
              objetivo: encuesta.objetivo,
              fecha_creacion: new Date(encuesta.fecha_creacion),
            }));

            // Obtener respuestas para cada encuesta
            this.encuestas.forEach(encuesta => {
              this.obtenerRespuestas(String(encuesta.id));
            });
          }
        },
        error => {
          console.error('Error obteniendo encuestas: ', error);
        }
      );
    }

    obtenerRespuestas(idEncuesta: string) {
      this.respuestaService.obtenerRespuestasPorEncuesta(idEncuesta).subscribe(
        (data: any) => {
          if (data && data.cantidadUsuarios !== undefined) {
            const encuesta = this.encuestas.find(enc => String(enc.id) === idEncuesta);
            if (encuesta) {
              encuesta['cantidadDeRespuestas'] = data.cantidadUsuarios;
              this.cdr.detectChanges();
            }
          }
        },
        error => {
          console.error('Error obteniendo respuestas: ', error);
        }
      );
    }

    openMenu(event: Event, id: number) {
      this.isMenuOpen = true;
      this.menuEvent = event;
      this.selectedEncuestaId = id;  // Ahora siempre tendrá un número válido
    }

    verEncuesta(id: number | null) {
      if (id !== null) {
        this.router.navigate(['/aside/surveys', id]);
        console.log('Ver encuesta con ID:', id);
      }
      this.isMenuOpen = false;
    }
    
    verDashboard(id: number | null) {
      if (id !== null) {
        this.router.navigate(['/aside/surveys', id, 'dashboard']);
        console.log('Ver dashboard de la encuesta con ID:', id);
      }
      this.isMenuOpen = false;
    }
    
    async compartirEncuesta(id: number | null) {
      if (id === null) return;
    
      const url = `${window.location.origin}/respuesta/${id}`;
    
      const alert = await this.alertController.create({
        header: 'Compartir Encuesta',
        message: 'Copia el enlace y compártelo:',
        inputs: [
          {
            name: 'link',
            type: 'text',
            value: url,
            attributes: { readonly: true }
          }
        ],
        buttons: [
          {
            text: 'Cerrar',
            role: 'cancel'
          },
          {
            text: 'Copiar enlace',
            handler: async () => {
              try {
                await navigator.clipboard.writeText(url);
                this.mostrarAlerta('Copiado', 'El enlace ha sido copiado al portapapeles.');
              } catch {
                this.mostrarAlerta('Error', 'No se pudo copiar el enlace.');
              }
            }
          }
        ]
      });
    
      await alert.present();
      console.log('Compartir encuesta con ID:', id);
      this.isMenuOpen = false;
    }
    

    async mostrarAlerta(header: string, message: string) {
      const alert = await this.alertController.create({
        header,
        message,
        buttons: ['OK']
      });

      await alert.present();
    }
  }