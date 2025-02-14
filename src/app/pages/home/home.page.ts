import { Component, OnInit, ViewChild, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, IonSelect, AlertController } from '@ionic/angular';
import { DashboardHomeService } from '../../servicios/server/encuestas.service';
import { LoginService } from '../../servicios/server/login.service';
import { ChangeDetectorRef } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { addIcons } from 'ionicons';
import { logOutOutline } from 'ionicons/icons';

addIcons({
  'log-out-outline': logOutOutline,
});

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonicModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class HomePage implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(IonSelect) selectElement!: IonSelect;

  totalEncuestas: number = 0;
  encuestasActivas: number = 0;
  encuestasCerradas: number = 0;
  titulosEncuestas: string[] = [];
  displayedColumns: string[] = ['titulo', 'objetivo', 'fecha_creacion', 'estado', 'area', 'acciones'];
  dataSource = new MatTableDataSource<any>([]);
  estadoFiltro: string = '';
  encuestasOriginales: any[] = [];
  pageSize: number = 5; // Agregar pageSize
  userName: string = ''; // Variable para almacenar el nombre del usuario

  constructor(
    private encuestaService: DashboardHomeService,
    private loginService: LoginService,
    private cdr: ChangeDetectorRef,
    private alertController: AlertController // Inyectar AlertController
  ) {}

  ngOnInit(): void {
    const usuario = this.loginService.getUser();
    if (usuario) {
      this.userName = usuario.nombre; // Obtener el nombre del usuario
      this.obtenerEncuestas(usuario.id);
    }

    this.dataSource.filterPredicate = (data, filter) => {
      return data.estado.toLowerCase() === filter.toLowerCase();
    };
  }

  async onLogout() {
    const alert = await this.alertController.create({
      header: 'Confirmar',
      message: '¿Estás seguro de que quieres cerrar sesión?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Cerrar sesión',
          handler: () => {
            this.loginService.logout();
          },
        },
      ],
    });

    await alert.present();
  }

  obtenerEncuestas(idUsuario: string) {
    this.encuestaService.obtenerEncuestasPorUsuario(idUsuario).subscribe(
      (response: any) => {
        if (response.totalEncuestas > 0) {
          this.totalEncuestas = response.totalEncuestas;
          this.encuestasActivas = response.encuestas.filter((encuesta: any) => encuesta.estado === 'Habilitada').length;
          this.encuestasCerradas = response.encuestas.filter((encuesta: any) => encuesta.estado === 'Deshabilitada').length;
          this.titulosEncuestas = response.encuestas.slice(0, 3).map((encuesta: any) => encuesta.titulo);
          this.encuestasOriginales = response.encuestas.map((encuesta: any) => ({
            _id: encuesta._id,
            titulo: encuesta.titulo,
            objetivo: encuesta.objetivo,
            fecha_creacion: encuesta.fecha_creacion,
            estado: encuesta.estado,
            area: encuesta.area
          }));

          this.dataSource.data = [...this.encuestasOriginales]; // Usar los datos originales

          setTimeout(() => {
            this.dataSource.paginator = this.paginator;
          }, 0);
        }
      },
      (error) => {
        console.warn('Error al obtener encuestas:', error);
      }
    );
  }

  filtrarPorEstado() {
    if (this.estadoFiltro) {
      this.dataSource.data = this.encuestasOriginales.filter((encuesta: any) => encuesta.estado === this.estadoFiltro);
    } else {
      this.dataSource.data = [...this.encuestasOriginales];
    }
  }

  onAccion(encuestaId: string) {
    console.log('Acción realizada para la encuesta:', encuestaId);

    this.encuestaService.cambiarEstadoID(encuestaId).subscribe(
      (response) => {
        console.log('Estado cambiado exitosamente:', response);
        const usuario = this.loginService.getUser();
        if (usuario) {
          this.obtenerEncuestas(usuario.id);
        }
      },
      (error) => {
        console.error('Error al cambiar el estado:', error);
      }
    );
  }

  onPaginateChange(event: any) {
    console.log('Página cambiada:', event);
  }

  get dataSourceData() {
    return this.dataSource.data;
  }
}