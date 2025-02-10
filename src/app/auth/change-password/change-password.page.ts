import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {IonAlert,IonInputPasswordToggle,IonCard,IonCardHeader,IonCardTitle,IonCardContent, IonItem, IonButton, IonContent, IonInput } from "@ionic/angular/standalone";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LoginService } from '../../servicios/server/login.service';
import { Router } from '@angular/router';



@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.page.html',
  styleUrls: ['./change-password.page.scss'],
  standalone: true,
  imports: [IonAlert,IonInput, IonInputPasswordToggle, ReactiveFormsModule, IonCard,IonCardHeader,IonCardTitle,IonCardContent, IonItem, IonButton, IonContent, CommonModule, FormsModule]
})
export class ChangePasswordPage implements OnInit {

  passwordForm!: FormGroup;
  changedata: any = {
    correo: 'null',
    id: 'null'
  };

  loadingAlertVisible = false;
  successAlertVisible = false;
  errorAlertVisible = false;
  mismatchAlertVisible = false;
  formErrorAlertVisible = false;

  constructor(
    private fb: FormBuilder,
    private loginService: LoginService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadUserData();
    this.passwordForm = this.fb.group(
      {
        clave: ['', [Validators.required, Validators.minLength(6)]],
        confirmarclave: ['', [Validators.required, Validators.minLength(6)]]
      }
    );
  }

  loadUserData(): void {
    const userData = this.loginService.getChange();
    this.changedata = userData ? { ...userData } : { correo: 'null', id: 'null' };
  }

  passwordsMatch(group: FormGroup): { [key: string]: boolean } | null {
    const password = group.get('clave')?.value;
    const confirmPassword = group.get('confirmarclave')?.value;

    if (password && confirmPassword && password !== confirmPassword) {
      return { mismatch: true };
    }

    return null;
  }
  
  onSubmit(): void {
    if (this.passwordForm.valid) {
      const { clave, confirmarclave } = this.passwordForm.value;
      if (clave !== confirmarclave) {
        this.mismatchAlertVisible = true;
        return;
      }
      
      this.loadingAlertVisible = true;
      const usuarioId = this.changedata.id;
      this.loginService.cambiarClave(usuarioId, clave).subscribe({
        next: () => {
          this.loadingAlertVisible = false;
          this.successAlertVisible = true;
          this.router.navigate(['/login']);
          this.loginService.deleteCHANGE();
        },
        error: () => {
          this.loadingAlertVisible = false;
          this.errorAlertVisible = true;
        }
      });
    } else {
      this.formErrorAlertVisible = true;
    }
  }

 
}
