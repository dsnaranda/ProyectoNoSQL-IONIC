import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-likerscale',
  standalone: true,
  imports: [CommonModule, IonicModule],
  templateUrl: './likerscale.page.html',
  styleUrls: ['./likerscale.page.scss']
})
export class LikerscalePage {
  valorSeleccionado: number = 0;
  @Output() respuesta = new EventEmitter<{ valor: number, tipoPregunta: string }>();

  @Input() pregunta: any;
  @Input() disabled: boolean = false;
  @Input() respondiendo: boolean = false;

  // Función para calificar
  calificar(valor: number): void {
    this.valorSeleccionado = valor;
    this.respuesta.emit({ valor: this.valorSeleccionado, tipoPregunta: 'escala' });
    console.log(this.valorSeleccionado);
  }

  // Toggle para respuesta larga
  respuestaLarga: boolean = false;
  toggleRespuestaLarga() {
    this.respuestaLarga = !this.respuestaLarga;
    console.log(`Pregunta ID ${this.pregunta?.id} - Respuesta Larga: ${this.respuestaLarga}`);
  }

  // Toggle para obligatoria
  obligatoria: boolean = false;
  toggleObligatoria() {
    this.obligatoria = !this.obligatoria;
    console.log(`Pregunta ID ${this.pregunta?.id} - Obligatoria: ${this.obligatoria}`);
  }
}