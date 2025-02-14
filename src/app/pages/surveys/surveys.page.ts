import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AlertController, IonContent, IonItem, IonPopover, IonList, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonButton, IonIcon, IonSelect, IonSelectOption, IonHeader, IonToolbar, IonTitle, IonLabel, IonButtons } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { logOutOutline, ellipsisVertical } from 'ionicons/icons';
import { Encuesta } from '../../Interfaces/interfaceEncuestas';
import { LoginService } from 'src/app/servicios/server/login.service';
import { RespuestasService } from 'src/app/servicios/server/respuestas.service';
import { DashboardHomeService } from 'src/app/servicios/server/encuestas.service';
import { Respuestas } from 'src/app/Interfaces/interfaceRespuestas';

addIcons({
  'log-out-outline': logOutOutline,
  'ellipsis-vertical': ellipsisVertical,
});

@Component({
  selector: 'app-surveys',
  templateUrl: './surveys.page.html',
  styleUrls: ['./surveys.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
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
    IonIcon,
    IonSelect,
    IonSelectOption,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonLabel,
    IonButtons
  ]
})
export class SurveysPage implements OnInit {
  encuestas: Encuesta[] = [];
  encuestasOriginales: Encuesta[] = []; // Agregar propiedad para almacenar las encuestas originales
  respuestas: Respuestas[] = [];
  isMenuOpen = false;
  menuEvent: any;
  selectedEncuestaId: number | null = null;
  totalEncuestas: number = 0;

  surveyForm: FormGroup;
  listaAreas: string[] = [
    "Matemáticas", "Ciencias de la Computación", "Ingeniería", "Historia", 
    "Física", "Química", "Biología", "Geografía", "Lengua y Literatura", 
    "Artes", "Música", "Deportes", "Psicología", "Economía", "Derecho", "Ambiente",
    "Medicina", "Arquitectura", "Administración", "Marketing", "Sociología", "TI"
  ];

  constructor(
    private encuestaService: DashboardHomeService,
    private loginService: LoginService,
    private cdr: ChangeDetectorRef,
    private respuestaService: RespuestasService,
    private router: Router,
    private alertController: AlertController,
    private fb: FormBuilder
  ) {
    // Inicializar el FormGroup para filtros
    this.surveyForm = this.fb.group({
      selectedArea: [''],
      selectedEstado: ['']
    });
  }

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
            area: encuesta.area,
            estado: encuesta.estado
          }));
          this.encuestasOriginales = [...this.encuestas]; // Guardar las encuestas originales
          this.totalEncuestas = this.encuestas.length; // Actualizar el total de encuestas
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
        console.error('Error obteniendo respuestas:', error);
      }
    );
  }

  filtrarPorArea() {
    const selectedArea = this.surveyForm.get('selectedArea')?.value;
    const selectedEstado = this.surveyForm.get('selectedEstado')?.value;

    this.encuestas = this.encuestasOriginales.filter(encuesta => {
      const areaMatch = selectedArea ? encuesta.area === selectedArea : true;
      const estadoMatch = selectedEstado ? encuesta.estado === selectedEstado : true;
      return areaMatch && estadoMatch;
    });

    if (this.encuestas.length === 0) {
      this.mostrarAlerta('No hay encuestas', `No hay encuestas en el área de ${selectedArea || 'cualquiera'} con estado ${selectedEstado || 'cualquiera'}`);
    }

    this.totalEncuestas = this.encuestas.length; // Actualizar el total de encuestas
  }

  filtrarPorEstado() {
    const selectedEstado = this.surveyForm.get('selectedEstado')?.value;

    this.encuestas = this.encuestasOriginales.filter(encuesta => {
      return selectedEstado ? encuesta.estado === selectedEstado : true;
    });

    if (this.encuestas.length === 0) {
      this.mostrarAlerta('No hay encuestas', `No hay encuestas con estado ${selectedEstado || 'cualquiera'}`);
    }

    this.totalEncuestas = this.encuestas.length; // Actualizar el total de encuestas
  }

  limpiarFiltros() {
    this.surveyForm.reset();
    this.encuestas = [...this.encuestasOriginales];
    this.totalEncuestas = this.encuestas.length; // Actualizar el total de encuestas
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

  openMenu(event: Event, id: number) {
    this.isMenuOpen = true;
    this.menuEvent = event;
    this.selectedEncuestaId = id;
  }

  verEncuesta(id: number | null) {
    if (id !== null) {
      this.router.navigate(['/survey-id', id]);
      console.log('Ver encuesta con ID:', id);
    }
    this.isMenuOpen = false;
  }

  verDashboard(id: number | null) {
    if (id !== null) {
      this.router.navigate([`/aside/surveys/${id}/dashboard`]);
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
  }

  async mostrarAlerta(titulo: string, mensaje: string, icon: 'success' | 'warning' | 'info' = 'info') {
    const alert = await this.alertController.create({
      header: titulo,
      message: mensaje,
      buttons: ['OK'],
      cssClass: icon === 'success' ? 'alert-success' : icon === 'warning' ? 'alert-warning' : 'alert-info'
    });
    await alert.present();
  }
}