import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface Administrador {
  id: number;
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  noTrabajador: string;
  correo: string;
  contrasena: string;
}

@Component({
  selector: 'app-administradores',
  standalone: true,  // ← ESTO ES NUEVO
  imports: [CommonModule, FormsModule],  // ← ESTO ES NUEVO
  templateUrl: './administradores.html',
  styleUrls: ['./administradores.css']
})
export class AdministradoresComponent implements OnInit {
  
  // ========== PROPIEDADES (Variables del componente) ==========
  
  // Array que almacena todos los administradores
  administradores: Administrador[] = [
    { id: 1, nombre: 'Laura', apellidoPaterno: 'Hernández', apellidoMaterno: 'Mendoza', noTrabajador: '101', correo: 'laura.hernandez@ejemplo.com', contrasena: 'pass1234' },
    { id: 2, nombre: 'Carlos', apellidoPaterno: '', apellidoMaterno: 'López', noTrabajador: '102', correo: 'carlos.lopez@ejemplo.com', contrasena: 'admin2024' },
    { id: 3, nombre: 'Ana', apellidoPaterno: 'Martínez', apellidoMaterno: '', noTrabajador: '103', correo: 'ana.martinez@ejemplo.com', contrasena: 'securepwd' },
    { id: 4, nombre: 'Pedro', apellidoPaterno: '', apellidoMaterno: '', noTrabajador: '104', correo: 'pedro.admin@ejemplo.com', contrasena: '12345678' },
    { id: 5, nombre: 'Sofía', apellidoPaterno: 'Ramírez', apellidoMaterno: 'Gómez', noTrabajador: '105', correo: 'sofia.ramirez@ejemplo.com', contrasena: 'sofia2025' },
    { id: 6, nombre: 'Fer', apellidoPaterno: 'y', apellidoMaterno: 'x', noTrabajador: '106', correo: 'example@gmail.com', contrasena: '1234' }
  ];
  
  // Array filtrado que se muestra en la tabla
  administradoresFiltrados: Administrador[] = [];
  
  // Variable para el término de búsqueda
  terminoBusqueda: string = '';
  
  // Variable para saber si busca por 'id' o 'noTrabajador'
  buscarPor: string = 'id';
  
  // Variable para mostrar/ocultar el modal
  mostrarModal: boolean = false;
  
  // Variable para saber si el modal es para 'agregar' o 'editar'
  modoModal: 'agregar' | 'editar' = 'agregar';
  
  // Administrador seleccionado para editar
  adminSeleccionado: Administrador | null = null;
  
  // Objeto que almacena los datos del formulario
  formulario: Administrador = {
    id: 0,
    nombre: '',
    apellidoPaterno: '',
    apellidoMaterno: '',
    noTrabajador: '',
    correo: '',
    contrasena: ''
  };

  // ========== CONSTRUCTOR Y LIFECYCLE HOOKS ==========
  
  constructor() { }

  // Se ejecuta cuando el componente se inicializa
  ngOnInit(): void {
    // Al inicio, muestra todos los administradores
    this.administradoresFiltrados = [...this.administradores];
  }

  // ========== MÉTODOS (Funciones del componente) ==========
  
  /**
   * Filtra los administradores según el término de búsqueda
   */
  buscar(): void {
    // Si no hay término de búsqueda, muestra todos
    if (!this.terminoBusqueda.trim()) {
      this.administradoresFiltrados = [...this.administradores];
      return;
    }

    // Filtra según el criterio seleccionado
    this.administradoresFiltrados = this.administradores.filter(admin => {
      if (this.buscarPor === 'id') {
        return admin.id.toString() === this.terminoBusqueda;
      } else {
        return admin.noTrabajador === this.terminoBusqueda;
      }
    });
  }

  /**
   * Limpia el término de búsqueda y muestra todos los registros
   */
  limpiarBusqueda(): void {
    this.terminoBusqueda = '';
    this.administradoresFiltrados = [...this.administradores];
  }

  /**
   * Abre el modal en modo "agregar"
   */
  abrirModalAgregar(): void {
    this.modoModal = 'agregar';
    // Limpia el formulario
    this.formulario = {
      id: 0,
      nombre: '',
      apellidoPaterno: '',
      apellidoMaterno: '',
      noTrabajador: '',
      correo: '',
      contrasena: ''
    };
    this.mostrarModal = true;
  }

  /**
   * Abre el modal en modo "editar"
   * @param admin - Administrador a editar
   */
  abrirModalEditar(admin: Administrador): void {
    this.modoModal = 'editar';
    this.adminSeleccionado = admin;
    // Copia los datos del admin al formulario
    this.formulario = { ...admin };
    this.mostrarModal = true;
  }

  /**
   * Cierra el modal
   */
  cerrarModal(): void {
    this.mostrarModal = false;
    this.adminSeleccionado = null;
  }

  /**
   * Guarda los cambios (agregar o editar)
   */
  guardar(): void {
    if (this.modoModal === 'agregar') {
      // MODO AGREGAR: Crea un nuevo administrador
      const nuevoId = Math.max(...this.administradores.map(a => a.id)) + 1;
      const nuevoAdmin: Administrador = {
        ...this.formulario,
        id: nuevoId
      };
      this.administradores.push(nuevoAdmin);
    } else {
      // MODO EDITAR: Actualiza el administrador existente
      const index = this.administradores.findIndex(a => a.id === this.adminSeleccionado?.id);
      if (index !== -1) {
        this.administradores[index] = { ...this.formulario };
      }
    }
    
    // Actualiza la vista filtrada
    this.buscar();
    // Cierra el modal
    this.cerrarModal();
  }

  /**
   * Elimina un administrador
   * @param id - ID del administrador a eliminar
   */
  eliminar(id: number): void {
    // Pide confirmación antes de eliminar
    if (confirm('¿Está seguro de eliminar este administrador?')) {
      // Elimina del array principal
      this.administradores = this.administradores.filter(admin => admin.id !== id);
      // Actualiza la vista filtrada
      this.buscar();
    }
  }

  /**
   * Genera puntos para ocultar la contraseña
   * @param contrasena - Contraseña a ocultar
   * @returns String con puntos
   */
  ocultarContrasena(contrasena: string): string {
    return '•'.repeat(contrasena.length);
  }
}