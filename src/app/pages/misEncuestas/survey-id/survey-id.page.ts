import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, AlertController, NavController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { DashboardHomeService } from '../../../servicios/server/encuestas.service';
import { PreguntasService } from '../../../servicios/server/preguntas.service';
import { LargeanswerPage } from '../../forms/largeanswer/largeanswer.page';
import { LikerscalePage } from '../../forms/likerscale/likerscale.page';
import { MultiopcionPage } from '../../forms/multiopcion/multiopcion.page';
import { SubsurveyPage } from '../../forms/subsurvey/subsurvey.page';

@Component({
  selector: 'app-survey-id',
  standalone: true,
  imports: [CommonModule, IonicModule, LargeanswerPage, LikerscalePage, MultiopcionPage, SubsurveyPage],
  templateUrl: './survey-id.page.html',
  styleUrls: ['./survey-id.page.scss']
})
export class SurveyIDPage implements OnInit {
  encuestaSeleccionada: any;
  preguntasDetalles: any[] = [];
  loading: boolean = true;
  errorMessage: string = '';
  disabled: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private encuestaService: DashboardHomeService,
    private preguntasService: PreguntasService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private navCtrl: NavController,
    private alertCtrl: AlertController,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.obtenerEncuesta(id);
    }
  }

  obtenerEncuesta(id: string) {
    this.encuestaService.obtenerEncuestasPorID(id).subscribe({
      next: (response: any) => {
        this.encuestaSeleccionada = { ...response, id: response._id };
        this.loading = false;

        if (this.encuestaSeleccionada?.estado === 'deshabilitada') {
          this.mostrarAlerta('Encuesta deshabilitada', 'Esta encuesta está deshabilitada y no se puede realizar.', 'warning');
          this.disabled = true;
        } else {
          this.disabled = false;
        }

        if (this.encuestaSeleccionada?.preguntas?.length) {
          this.obtenerDetallesPreguntas(this.encuestaSeleccionada.preguntas);
        }
      },
      error: (error) => {
        this.loading = false;
        this.mostrarAlerta('Error', this.obtenerMensajeError(error.status));
      }
    });
  }

  obtenerDetallesPreguntas(preguntasIds: string[]) {
    this.preguntasDetalles = [];
    preguntasIds.forEach((id) => {
      this.preguntasService.obtenerPreguntaDetalles(id).subscribe({
        next: (pregunta: any) => {
          this.preguntasDetalles.push(pregunta);
          this.cdr.markForCheck();
        },
        error: (error) => {
          console.error(`Error al obtener la pregunta con ID ${id}:`, error);
        }
      });
    });
  }

  async compartirEncuesta(id: number | null) {
    if (id === null) return;
    
    // Crear deep link URL con el esquema personalizado
    const deepLink = `surveyengine://respuesta/${id}`;
    
    const alert = await this.alertController.create({
      header: 'Compartir Encuesta',
      message: 'Copia el enlace y compártelo:',
      inputs: [
        {
          name: 'link',
          type: 'text',
          value: deepLink,
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
              await navigator.clipboard.writeText(deepLink);
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
    const alert = await this.alertCtrl.create({
      header: titulo,
      message: mensaje,
      buttons: ['OK'],
      cssClass: icon === 'success' ? 'alert-success' : icon === 'warning' ? 'alert-warning' : 'alert-info'
    });
    await alert.present();
  }

  obtenerMensajeError(status: number): string {
    switch (status) {
      case 404:
        return 'Encuesta no encontrada';
      case 500:
        return 'Error al obtener la encuesta';
      default:
        return 'Ocurrió un error desconocido';
    }
  }

  volver() {
    this.navCtrl.back();
  }

  verDashboard(id: number) {
    this.router.navigate([`/aside/surveys/${id}/dashboard`]);
  }

  calculartiempopromedio() {
    // Implementa la lógica para calcular el tiempo promedio aquí
    console.log('Calculando tiempo promedio...');
  }
}