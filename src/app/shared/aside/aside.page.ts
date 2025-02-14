import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { addIcons } from 'ionicons';
import { library, playCircle, radio, search } from 'ionicons/icons';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonTabs, IonTabButton, IonTabBar } from '@ionic/angular/standalone';

@Component({
  selector: 'app-aside',
  templateUrl: './aside.page.html',
  styleUrls: ['./aside.page.scss'],
  standalone: true,
  imports: [IonTabBar, IonTabButton, IonTabs, CommonModule, FormsModule]
})
export class AsidePage implements OnInit {

  constructor() { 
    addIcons({ library, playCircle, radio, search });

  }

  ngOnInit() {
  }

}
