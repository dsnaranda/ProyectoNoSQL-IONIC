import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-multiopcion',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, IonicModule],
  templateUrl: './multiopcion.page.html',
  styleUrls: ['./multiopcion.page.scss']
})
export class MultiopcionPage {
  @Input() pregunta: any;
  @Input() disabled: boolean = false;
  @Input() respondiendo: boolean = false;

  @Output() respuesta = new EventEmitter<{ valor: string }>();

  seleccionarOpcion(opcion: string) {
    this.respuesta.emit({ valor: opcion });
  }

  toggleObligatoria() {
    this.pregunta.obligatorio = !this.pregunta.obligatorio;
    console.log(`Pregunta ID ${this.pregunta?.id} - Obligatoria: ${this.pregunta.obligatorio}`);
  }

  toggleAction() {
    console.log('Acción de toggle ejecutada');
  }
}