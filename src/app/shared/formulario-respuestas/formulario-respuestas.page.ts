import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Encuesta } from '../../Interfaces/interfaceEncuestas';
import { ActivatedRoute, Router } from '@angular/router';
import { DashboardHomeService } from '../../servicios/server/encuestas.service';
import { CommonModule } from '@angular/common';
import { LargeanswerPage } from '../../pages/forms/largeanswer/largeanswer.page';
import { LikerscalePage } from '../../pages/forms/likerscale/likerscale.page';
import { MultiopcionPage } from '../../pages/forms/multiopcion/multiopcion.page';
import { SubsurveyPage } from '../../pages/forms/subsurvey/subsurvey.page';
import { Pregunta } from '../../Interfaces/interfacePreguntas';
import { PreguntasService } from '../../servicios/server/preguntas.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RespuestasService } from '../../servicios/server/respuestas.service';
import { AlertController, IonContent, IonButton } from "@ionic/angular/standalone";

@Component({
  selector: 'app-formulario-respuestas',
  standalone: true,
  imports: [IonButton, IonContent, 
    CommonModule,
    LargeanswerPage,
    LikerscalePage,
    MultiopcionPage,
    SubsurveyPage,
    ReactiveFormsModule
  ],
  templateUrl: './formulario-respuestas.page.html',
  styleUrls: ['./formulario-respuestas.page.scss']
})
export class FormularioRespuestasPage implements OnInit, OnDestroy {
  encuestaSeleccionada: Encuesta | null = null;
  loading: boolean = true;
  errorMessage: string = '';
  disabled: boolean = false;
  respondiendo: boolean = true;
  preguntasDetalles: Pregunta[] = [];
  RespuestaForm!: FormGroup;
  respuestaTexto: { [key: string]: string } = {};
  respuestasSubsurvey: { [key: string]: any } = {};

  private fechaInicio: number = 0; // Inicializamos con 0
  public tiempoFormateado: string = '00:00'; // Variable para mostrar el tiempo formateado
  private intervalo: any;
  public tiempoAlHacerClick: number = 0;

  constructor(
    private route: ActivatedRoute,
    private encuestaService: DashboardHomeService,
    private preguntasService: PreguntasService,
    private respuestas: RespuestasService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    this.fechaInicio = Date.now();
    if (id) {
      this.obtenerEncuesta(id);
    }

    this.RespuestaForm = this.fb.group({
      correo: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnDestroy() {
    if (this.intervalo) {
      clearInterval(this.intervalo);
    }
  }

  async mostrarAlerta(titulo: string, mensaje: string, icon: 'success' | 'warning' | 'info') {
    const alert = await this.alertController.create({
      header: titulo,
      message: mensaje,
      buttons: ['OK'],
      cssClass: icon === 'success' ? 'alert-success' : icon === 'warning' ? 'alert-warning' : 'alert-info'
    });
    await alert.present();
  }

  guardarRespuesta(preguntaId: string | undefined, respuesta: string | number, tipoPregunta: string) {
    if (preguntaId) {
      if (tipoPregunta === 'escala') {
        this.respuestaTexto[preguntaId] = respuesta.toString();
      } else if (tipoPregunta === 'texto') {
        this.respuestaTexto[preguntaId] = respuesta.toString();
      }
    } else {
      console.warn('Pregunta ID no definido');
    }
  }

  guardarRespuestasSubsurvey(preguntaId: string | undefined, nuevaRespuesta: { respuesta: { [key: string]: string } }) {
    if (!preguntaId) {
      console.warn('Error: preguntaId es undefined, no se guardará la respuesta.');
      return;
    }

    if (!this.respuestasSubsurvey[preguntaId]) {
      this.respuestasSubsurvey[preguntaId] = { id_pregunta: preguntaId, respuesta: {} };
    }

    this.respuestasSubsurvey[preguntaId].respuesta = {
      ...this.respuestasSubsurvey[preguntaId].respuesta,
      ...nuevaRespuesta.respuesta
    };

    console.log('Respuestas Subsurvey actualizadas:', this.respuestasSubsurvey);
  }

  calculartiempopromedio() {
    if (this.RespuestaForm.valid) {
      this.tiempoAlHacerClick = Date.now() - this.fechaInicio;
      const minutos = Math.floor(this.tiempoAlHacerClick / 60000);
      const segundos = Math.floor((this.tiempoAlHacerClick % 60000) / 1000);
      this.tiempoFormateado = `${this.padZero(minutos)}:${this.padZero(segundos)}`;
      this.generarResultadoFinalCompleto();
    }
  }

  generarResultadoFinal() {
    const correo = this.RespuestaForm.get('correo')?.value;
    const tiempoTotal = this.tiempoFormateado;
    const id_encuesta = this.route.snapshot.paramMap.get('id');
    if (correo && id_encuesta) {
      const respuestas = Object.keys(this.respuestaTexto).map(key => {
        return {
          id_encuesta,
          id_pregunta: key,
          correo,
          respuesta: [this.respuestaTexto[key]],
          tiempoTotal
        };
      });
      return respuestas;
    } else {
      console.warn('Correo o ID de encuesta no definidos');
      return null;
    }
  }

  generarResultadoFinalSubsurvey() {
    const correo = this.RespuestaForm.get('correo')?.value;
    const tiempoTotal = this.tiempoFormateado;
    const id_encuesta = this.route.snapshot.paramMap.get('id');

    if (correo && id_encuesta) {
      const respuestas = Object.keys(this.respuestasSubsurvey).map(key => {
        return {
          id_encuesta,
          id_pregunta: key,
          correo,
          respuesta: { ...this.respuestasSubsurvey[key].respuesta },
          tiempoTotal
        };
      });

      return respuestas;
    } else {
      console.warn('Correo o ID de encuesta no definidos');
      return null;
    }
  }

  generarResultadoFinalCompleto() {
    const respuestasNormales = this.generarResultadoFinal() || [];
    const respuestasSubsurvey = this.generarResultadoFinalSubsurvey() || [];
    const respuestasFinales = [...respuestasNormales, ...respuestasSubsurvey];

    console.log('Respuestas Finales Completas:', respuestasFinales);

    if (respuestasFinales.length === 0) {
      this.mostrarAlerta('No hay respuestas para enviar', '', 'info');
      return;
    }

    let errores: string[] = [];
    let respuestasGuardadas = 0;
    let erroresUsuarioYaRespondio = 0;
    const totalRespuestas = respuestasFinales.length;

    respuestasFinales.forEach(respuesta => {
      this.respuestas.guardarRespuestas(respuesta).subscribe(
        response => {
          respuestasGuardadas++;
          verificarFinalizacion();
        },
        error => {
          const mensajeError = error.error?.error || error.message;

          if (mensajeError === 'El usuario ya respondió esta pregunta') {
            erroresUsuarioYaRespondio++;
          } else {
            errores.push(`Error en la pregunta ${respuesta.id_pregunta}: ${mensajeError}`);
          }

          verificarFinalizacion();
        }
      );
    });

    const verificarFinalizacion = () => {
      if (respuestasGuardadas + errores.length + erroresUsuarioYaRespondio === totalRespuestas) {
        this.mostrarResumen(errores, respuestasGuardadas, erroresUsuarioYaRespondio, totalRespuestas);
      }
    };
  }

  private async mostrarResumen(errores: string[], respuestasGuardadas: number, erroresUsuarioYaRespondio: number, totalRespuestas: number) {
    if (erroresUsuarioYaRespondio === totalRespuestas) {
      await this.mostrarAlerta('Información', 'El usuario ya respondió a esta encuesta.', 'info');
    } else if (errores.length === 0) {
      await this.mostrarAlerta('Éxito', `Se guardaron todas las respuestas (${respuestasGuardadas}/${totalRespuestas}) correctamente.`, 'success');
    } else {
      const alert = await this.alertController.create({
        header: 'Algunas respuestas no se guardaron',
        message: `
          <p>Respuestas guardadas: ${respuestasGuardadas}/${totalRespuestas}</p>
          <p>Errores:</p>
          <ul style="text-align: left;">${errores.map(err => `<li>${err}</li>`).join('')}</ul>
        `,
        buttons: ['OK'],
        cssClass: 'alert-warning'
      });
      await alert.present();
    }
  }

  padZero(value: number): string {
    return value < 10 ? `0${value}` : `${value}`;
  }

  obtenerEncuesta(id: string) {
    this.encuestaService.obtenerEncuestasPorID(id).subscribe({
      next: (response: any) => {
        this.encuestaSeleccionada = { ...response, id: response._id };
        this.loading = false;
  
        // Check if survey is disabled
        if (this.encuestaSeleccionada?.estado === 'Deshabilitada') {
          this.mostrarAlerta('Encuesta deshabilitada', 'Esta encuesta está deshabilitada y no se puede realizar.', 'warning');
          this.disabled = true;
          return; // Stop execution here
        }
  
        this.disabled = false; // Only enable if not disabled
        if (this.encuestaSeleccionada?.preguntas?.length) {
          this.obtenerDetallesPreguntas(this.encuestaSeleccionada.preguntas);
        }
      },
      error: (error) => {
        this.loading = false;
        if (error.status === 404) {
          this.errorMessage = 'Encuesta no encontrada';
          this.router.navigate(['not-found']);
        } else if (error.status === 500) {
          this.errorMessage = 'Error al obtener la encuesta';
          this.router.navigate(['not-found']);
        } else {
          this.errorMessage = 'Ocurrió un error desconocido';
        }
        console.error('Error al obtener la encuesta:', error);
      }
    });
  }

  obtenerDetallesPreguntas(preguntasIds: string[]) {
    this.preguntasDetalles = [];
    preguntasIds.forEach((id) => {
      this.preguntasService.obtenerPreguntaDetalles(id).subscribe({
        next: (pregunta: Pregunta) => {
          this.preguntasDetalles.push(pregunta);
          this.cdr.markForCheck();
        },
        error: (error) => {
          console.error(`Error al obtener la pregunta con ID ${id}:`, error);
        }
      });
    });
    console.log(this.preguntasDetalles);
  }
}