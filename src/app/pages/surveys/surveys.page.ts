import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonGrid,
  IonRow,
  IonCol,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonButton,
  IonIcon
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { ellipsisHorizontal } from 'ionicons/icons';  // Cambio importante aquí

addIcons({
  'ellipsis-horizontal': ellipsisHorizontal,  // Registro del icono
});

import { Encuesta } from '../../Interfaces/interfaceEncuestas';

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
    IonHeader,
    IonTitle,
    IonToolbar,
    IonGrid,
    IonRow,
    IonCol,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonCardContent,
    IonButton,
    IonIcon
  ]
})
export class SurveysPage implements OnInit {
  encuestas: Encuesta[] = [
    { id: 1, titulo: 'Encuesta de Satisfacción', cantidadDeRespuestas: 120, objetivo: 'Evaluar la satisfacción general de los usuarios.' },
    { id: 2, titulo: 'Encuesta de Productos', cantidadDeRespuestas: 85, objetivo: 'Recabar opiniones sobre los productos ofrecidos.' },
    // { id: 3, titulo: 'Encuesta de Clases', cantidadDeRespuestas: 45, objetivo: 'Obtener retroalimentación sobre las clases impartidas.' },
    // { id: 4, titulo: 'Encuesta de Ubicaciones', cantidadDeRespuestas: 40, objetivo: 'Evaluar la conveniencia de las ubicaciones actuales.' },
    // { id: 5, titulo: 'Encuesta de Recreación', cantidadDeRespuestas: 80, objetivo: 'Conocer las preferencias sobre actividades recreativas.' },
    // { id: 6, titulo: 'Encuesta de Amigos Secreto', cantidadDeRespuestas: 60, objetivo: 'Planificar y organizar el evento de amigo secreto.' },
    // { id: 7, titulo: 'Encuesta de Navidad', cantidadDeRespuestas: 10, objetivo: 'Obtener ideas para las celebraciones navideñas.' },
    // { id: 8, titulo: 'Encuesta de Halloween', cantidadDeRespuestas: 67, objetivo: 'Recabar opiniones sobre actividades de Halloween.' },
    // { id: 9, titulo: 'Encuesta de ThanksGiven', cantidadDeRespuestas: 29, objetivo: 'Planificar el evento de Thanksgiving en base a las sugerencias.' },
    // { id: 10, titulo: 'Encuesta de Satisfacción', cantidadDeRespuestas: 75, objetivo: 'Evaluar nuevamente la satisfacción de los usuarios.' },
    // { id: 11, titulo: 'Encuesta de Productos', cantidadDeRespuestas: 36, objetivo: 'Identificar posibles mejoras en los productos actuales.' },
    // { id: 12, titulo: 'Encuesta de Servicios', cantidadDeRespuestas: 0, objetivo: 'Evaluar la calidad de los servicios proporcionados.' },
  ];

  constructor() { }

  ngOnInit() {
  }
}