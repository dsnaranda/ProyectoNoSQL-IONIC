import { Component, Input, Output, EventEmitter } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-subsurvey',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './subsurvey.page.html',
  styleUrls: ['./subsurvey.page.scss']
})
export class SubsurveyPage {
  @Input() pregunta: any = { obligatorio: false, filas: [] }; // Inicializar con un objeto que tenga la propiedad obligatorio
  @Input() disabled: boolean = false;
  @Input() respondiendo: boolean = false;
  @Output() respuestasEmitidas = new EventEmitter<any>(); 

  obligatoria: boolean = false;

  respuestas: { [key: string]: string } = {};

  // Método para manejar la selección de opción en la tabla de evaluación
  onRadioChange(filaIndex: number, columnaIndex: number): void {
    const filaTexto = this.pregunta?.filas[filaIndex];
    const columnaTexto = ['Nunca', 'Poco Frecuente', 'Frecuente', 'Muy Frecuente', 'Siempre'][columnaIndex];
    this.respuestas[`${filaTexto}`] = columnaTexto;
    this.emitirRespuestas(filaTexto, columnaTexto);
  }

  // Método para emitir las respuestas seleccionadas
  emitirRespuestas(filaTexto: string, columnaTexto: string): void {
    const respuestaEmitida = {
      id_pregunta: this.pregunta?.id,
      respuesta: {
        [filaTexto]: columnaTexto
      }
    };

    console.log(`Pregunta ID: ${this.pregunta?.id} - ${filaTexto} : ${columnaTexto}`);
    this.respuestasEmitidas.emit(respuestaEmitida);
  }

  // Método para alternar si la pregunta es obligatoria
  toggleObligatoria() {
    this.obligatoria = !this.obligatoria;
    console.log(`Pregunta ID ${this.pregunta?.id} - Obligatoria: ${this.obligatoria}`);
  }

  // Método para obtener el nombre del grupo de radio
  getRadioName(filaIndex: number): string {
    return `radio-group-${filaIndex}`;
  }

  // Método para obtener el valor del radio
  getRadioValue(filaIndex: number, columnaIndex: number): string {
    return `${filaIndex}-${columnaIndex}`;
  }
}