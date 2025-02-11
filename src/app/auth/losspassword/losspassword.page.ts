import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {IonAlert, IonContent, IonCard, IonCardTitle, IonCardHeader,IonCardContent,IonItem,IonLabel
  ,IonInput,IonButton
 } from "@ionic/angular/standalone";

 import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
 import { Router, RouterLink } from '@angular/router';
 import { LoginService } from '../../servicios/server/login.service';
 import { BehaviorSubject } from 'rxjs';





@Component({
  selector: 'app-losspassword',
  templateUrl: './losspassword.page.html',
  styleUrls: ['./losspassword.page.scss'],
  standalone: true,
  imports: [IonAlert, ReactiveFormsModule, IonCardHeader,IonCardContent,IonItem,IonLabel
    ,IonInput,IonButton,IonCardTitle, IonCard, IonContent, CommonModule, FormsModule],
    providers: [FormBuilder]
})
export class LosspasswordPage implements OnInit {
  emailForm!: FormGroup;
  
  invalidEmailAlertVisible = new BehaviorSubject<boolean>(false);
  successAlertVisible = new BehaviorSubject<boolean>(false);
  errorAlertVisible = new BehaviorSubject<boolean>(false);

  constructor(private fb: FormBuilder, private router: Router, private loginService: LoginService) {}

  ngOnInit(): void {
    this.emailForm = this.fb.group({
      correo: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit(): void {
    if (this.emailForm.invalid) {
      this.invalidEmailAlertVisible.next(true);
      return;
    }

    const correo = this.emailForm.value.correo;

    this.loginService.changePass(correo).subscribe({
      next: () => {
        this.successAlertVisible.next(true);
        setTimeout(() => {
          if (this.successAlertVisible.value) {
            this.router.navigate(['/login']);
          }
        }, 2000);
      },
      error: () => {
        this.errorAlertVisible.next(true);
      }
    });
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }

}
