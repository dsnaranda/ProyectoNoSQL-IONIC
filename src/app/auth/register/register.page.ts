import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {IonAlert, IonContent, IonCard, IonCardTitle, IonCardHeader,IonCardContent,IonItem,IonLabel
  ,IonInput,IonButton,IonInputPasswordToggle
 } from "@ionic/angular/standalone";




import { FormBuilder } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { FormGroup,ReactiveFormsModule,Validators } from '@angular/forms';
import { LoginService } from 'src/app/servicios/server/login.service';
import { UserProfile } from 'src/app/Interfaces/interfaceUsuarios';
import { AlertController } from '@ionic/angular'; // Importa AlertController



@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [IonAlert,RouterLink,ReactiveFormsModule,IonInputPasswordToggle,IonCardHeader,IonCardContent,IonItem,IonLabel
    ,IonInput,IonButton,IonCardTitle, IonCard, IonContent, CommonModule, FormsModule]
  })
export class RegisterPage implements OnInit {

  errorAlertButtons = ['Aceptar'];
  successAlertButtons = ['Aceptar'];

  errorAlertVisible = false;
  invalidEmailAlertVisible = false;
  invalidPhoneAlertVisible = false;
  passwordMismatchAlertVisible = false;
  invalidPasswordAlertVisible = false; // Nueva propiedad
  successAlertVisible = false;

  registerForm!: FormGroup;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private usuariosService: LoginService,
    private alertController: AlertController // Inyecta AlertController
  ) { }

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      correo: ['', [Validators.required, Validators.email]],
      confirmpassword: ['', [Validators.required]],
      clave: ['', [Validators.required, Validators.minLength(8), this.passwordValidator]],
      nombre: ['', [Validators.required]],
      apellido: ['', [Validators.required]],
      telefono: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10), Validators.pattern('^[0-9]+$')]],
      usuario: [''],
      validacion: [true]
    }, {
      validators: this.matchPassword
    });

    this.registerForm.get('nombre')?.valueChanges.subscribe(() => this.generarUsuario());
    this.registerForm.get('apellido')?.valueChanges.subscribe(() => this.generarUsuario());
  }

  generarUsuario(): void {
    const nombre = this.registerForm.get('nombre')?.value;
    const apellido = this.registerForm.get('apellido')?.value;
    if (nombre && apellido) {
      const usuario = nombre.charAt(0).toLowerCase() + apellido.toLowerCase();
      this.registerForm.get('usuario')?.setValue(usuario);
    }
  }

  camposLlenos(): boolean {
    const formValues = this.registerForm.value;
    return Object.values(formValues).every(value => value !== null && value !== '');
  }

  matchPassword(form: FormGroup): boolean {
    const password = form.get('clave')?.value;
    const confirmPassword = form.get('confirmpassword')?.value;
    return password === confirmPassword;
  }

  passwordValidator(control: any): { [key: string]: boolean } | null {
    const value = control.value;
    if (!/[A-Z]/.test(value) || !/[0-9]/.test(value) || !/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
      return { 'passwordInvalid': true };
    }
    return null;
  }

  // ESTO SI ME SIRVE
  // validatePhoneNumber(event: any): void {
  //   const input = event.target as HTMLInputElement;
  //   input.value = input.value.replace(/[^0-9]/g, '').slice(0, 10);
  // }

  validatePhoneNumber(event: any): void {
    let inputValue = event.detail.value || ''; // Obtiene el valor correctamente
    inputValue = inputValue.replace(/[^0-9]/g, '').slice(0, 10); // Filtra solo números y limita a 10 dígitos
    this.registerForm.controls['telefono'].setValue(inputValue); // Actualiza el FormControl
  }
  

  onSubmit(): void {
    if (!this.camposLlenos()) {
      this.showErrorAlert('¡Error!', 'Por favor, llena todos los campos.');
      console.log('Formulario no lleno');
      return; // Detiene la ejecución si no se llenan todos los campos
    }
    else if (!this.registerForm.controls['correo'].valid) {
      this.showErrorAlert('¡Error!', 'El correo electrónico no es válido.');
      console.log('Correo no válido');
      return; // Detiene la ejecución si el correo no es válido
    }
    else if (!this.registerForm.controls['telefono'].valid) {
      this.showErrorAlert('¡Error!', 'El número de teléfono no es válido.');
      console.log('Número de teléfono no válido');
      return; // Detiene la ejecución si el teléfono no es válido
    }
    else if (!this.registerForm.controls['clave'].valid) {
      this.showErrorAlert('¡Error!', 'La contraseña debe tener al menos 8 caracteres, incluir una letra mayúscula, una letra minúscula, un número y un carácter especial.');
      console.log('Contraseña no válida');
      return; // Detiene la ejecución si la contraseña no es válida
    }
    else if (!this.matchPassword(this.registerForm)) {
      this.showErrorAlert('¡Error!', 'Las contraseñas no coinciden.');
      console.log('Las contraseñas no coinciden');
      return; // Detiene la ejecución si las contraseñas no coinciden
    } else {
      // Continuar con el registro si todo es válido
      const userProfile: UserProfile = {
        nombre: this.registerForm.get('nombre')?.value,
        apellido: this.registerForm.get('apellido')?.value,
        usuario: this.registerForm.get('usuario')?.value,
        clave: this.registerForm.get('clave')?.value,
        correo: this.registerForm.get('correo')?.value,
        telefono: this.registerForm.get('telefono')?.value,
        rol: 'user',
        validacion: true,
      };
  
      this.usuariosService.saveUsuario(userProfile).subscribe({
        next: (response) => {
          this.showSuccessAlert('¡Registro exitoso!', 'El usuario ha sido registrado correctamente.');
          console.log('Usuario registrado:', response);
          this.router.navigate(['/login']);
        },
        error: (error) => {
          const errorMessage = error.error?.message || 'Ocurrió un error desconocido al registrar el usuario.';
          this.showErrorAlert('¡Error!', errorMessage);
          console.error('Error al registrar el usuario:', error);
        }
      });
    }
  }

  async showErrorAlert(header: string, message: string): Promise<void> {
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: ['Aceptar']
    });
  
    await alert.present();
  }
  
  async showSuccessAlert(header: string, message: string): Promise<void> {
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: ['Aceptar']
    });
  
    await alert.present();
  }
  


}
