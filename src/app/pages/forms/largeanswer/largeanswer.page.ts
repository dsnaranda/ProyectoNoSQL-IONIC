import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Pregunta } from '../../../Interfaces/interfacePreguntas';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-largeanswer',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, IonicModule],
  templateUrl: './largeanswer.page.html',
  styleUrls: ['./largeanswer.page.scss']
})
export class LargeanswerPage {
  @Input() pregunta: Pregunta | null = null;
  @Input() disabled: boolean = false;
  @Input() respondiendo: boolean = false;

  @Output() respuesta: EventEmitter<string> = new EventEmitter<string>();

  respuestaTexto: string = '';
  respuestaLarga: boolean = false;
  obligatoria: boolean = false;

  onRespuestaChange() {
    this.respuesta.emit(this.respuestaTexto);
  }

  toggleRespuestaLarga() {
    this.respuestaLarga = !this.respuestaLarga;
    console.log(`Pregunta ID ${this.pregunta?.id} - Respuesta Larga: ${this.respuestaLarga}`);
  }

  toggleObligatoria() {
    this.obligatoria = !this.obligatoria;
    console.log(`Pregunta ID ${this.pregunta?.id} - Obligatoria: ${this.obligatoria}`);
  }
}