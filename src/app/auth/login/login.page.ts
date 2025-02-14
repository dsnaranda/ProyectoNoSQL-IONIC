import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonAlert, IonContent, IonCard, IonCardTitle, IonCardHeader,IonCardContent,IonItem,IonLabel
  ,IonInput,IonButton,IonInputPasswordToggle
 } from "@ionic/angular/standalone";

 import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
 import { Router, RouterLink } from '@angular/router';
 import { LoginService } from '../../servicios/server/login.service';

// import {}

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [ ReactiveFormsModule, IonAlert, IonInputPasswordToggle,IonCardHeader,IonCardContent,IonItem,IonLabel
    ,IonInput,IonButton,IonCardTitle, IonCard, IonContent, CommonModule, FormsModule]
})
export class LoginPage implements OnInit {

  loadingAlertVisible = false; 
  successAlertVisible = false; 
  errorAlertVisible = false; 
  invalidFormAlertVisible = false; 
  wrongPasswordAlertVisible = false;

  loginForm!: FormGroup;

  constructor(private fb: FormBuilder, private router: Router, private loginService: LoginService) { }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      correo: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const { correo, password } = this.loginForm.value;
  
      // Mostrar alerta de carga
      this.loadingAlertVisible = true;
  
      this.loginService.Loggin(correo, password).subscribe({
        next: (response) => {
          // Ocultar alerta de carga
          this.loadingAlertVisible = false;
  
          if (response && response.usuario) {
            console.log('Usuario autenticado:', response.usuario);
  
            // Mostrar alerta de éxito
            this.successAlertVisible = true;
  
            // Esperar 2 segundos antes de redirigir
            setTimeout(() => {
              this.successAlertVisible = false;
              this.router.navigate(['/aside/perfil']);
            }, 2000);
          } else {
            this.errorAlertVisible = true;
          }
        },
        error: () => {
          // Ocultar alerta de carga y mostrar alerta de error
          this.loadingAlertVisible = false;
          this.errorAlertVisible = true;
        }
      });
    } else {
      // Mostrar alerta de formulario inválido
      this.invalidFormAlertVisible = true;
    }
  }

  navigateToRegister() {
    this.router.navigate(['/register']);
  }
  
  navigateToRecovery() {
    this.router.navigate(['/login/identify']);
  }
  
  

}