import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DashboardHomeService } from '../../../servicios/server/encuestas.service';
import { Encuesta } from '../../../Interfaces/interfaceEncuestas';
import { RespuestasService } from '../../../servicios/server/respuestas.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, NavController } from '@ionic/angular';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule],
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss']
})
export class DashboardPage implements OnInit {
  respuestasTexto: { [id: string]: { enunciado: string, respuestas: string[] } } = {};
  preguntasEscala: any[] = [];
  preguntasSeleccion: any[] = [];
  preguntasCuadricula: any[] = [];
  encuestaSeleccionada: Encuesta | null = null;
  loading: boolean = true;
  errorMessage: string = '';
  tiempopromedio: string = '';
  cantidadDeRespuestas: number = 0;

  constructor(
    private route: ActivatedRoute,
    private encuestaService: DashboardHomeService,
    private respuestasService: RespuestasService,
    private cdr: ChangeDetectorRef,
    private navCtrl: NavController
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.obtenerEncuesta(id);
      this.obtenerRespuestas(id);
      this.obtenerPromedio(id);
    }
  }

  obtenerPromedio(id: string) {
    this.respuestasService.obtenerPromedio(id).subscribe({
      next: (response) => {
        this.tiempopromedio = response.tiempoPromedio;
      },
      error: (error) => {
        console.error('Error al obtener el promedio:', error);
      }
    });
  }

  obtenerEncuesta(id: string) {
    this.encuestaService.obtenerEncuestasPorID(id).subscribe({
      next: (response) => {
        this.encuestaSeleccionada = response;
        this.loading = false;

        this.encuestaSeleccionada?.preguntas.forEach((idPregunta: string) => {
          this.respuestasService.obtenerRespuestaPorIDPregunta(idPregunta).subscribe((respuesta) => {
            switch (respuesta.tipoPregunta) {
              case 'texto':
                this.actualizarLista(respuesta, idPregunta);
                break;
            }
          });
        });
      },
      error: () => {
        this.loading = false;
        this.errorMessage = 'Error al obtener la encuesta';
      }
    });
  }

  obtenerRespuestas(idEncuesta: string) {
    this.respuestasService.obtenerRespuestasPorEncuesta(idEncuesta).subscribe(
      (data) => {
        if (data && data.cantidadUsuarios !== undefined) {
          this.cantidadDeRespuestas = data.cantidadUsuarios;
        }
      },
      error => console.error('Error obteniendo respuestas:', error)
    );
  }

  actualizarLista(respuesta: any, idPregunta: string) {
    if (respuesta.tipoPregunta === 'texto') {
      if (!this.respuestasTexto[idPregunta]) {
        this.respuestasTexto[idPregunta] = { enunciado: respuesta.enunciado, respuestas: [] };
      }

      // Se agregan solo respuestas únicas
      Object.keys(respuesta.conteoRespuestas).forEach((respuestaTexto) => {
        if (!this.respuestasTexto[idPregunta].respuestas.includes(respuestaTexto)) {
          this.respuestasTexto[idPregunta].respuestas.push(respuestaTexto);
        }
      });

      this.cdr.detectChanges();
    }
  }

  volver() {
    this.navCtrl.back();
  }
}