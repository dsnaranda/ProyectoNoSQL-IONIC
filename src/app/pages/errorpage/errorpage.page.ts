import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonIcon, } from "@ionic/angular/standalone";
import { addIcons } from 'ionicons';
import {ellipse, ellipseOutline }  from 'ionicons/icons';
import { Router } from '@angular/router';


@Component({
  selector: 'app-errorpage',
  templateUrl: './errorpage.page.html',
  styleUrls: ['./errorpage.page.scss'],
  standalone: true,
  imports: [IonContent, IonIcon, CommonModule, FormsModule]
})
export class ErrorpagePage implements OnInit {


  constructor(private router: Router) {

    addIcons({ellipse,ellipseOutline});
   }

  ngOnInit() {
  }

  navigateToLogin(): void {
    console.log('Navegando a login...'); // Agrega esto para verificar si la función se ejecuta
    this.router.navigate(['/login']);
  }
  

}
