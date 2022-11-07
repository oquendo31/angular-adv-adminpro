import { Component, OnDestroy, OnInit } from '@angular/core';
import Swal from 'sweetalert2';

import { Usuario } from 'src/app/models/usuario.model';

import { BusquedasService } from '../../../services/busquedas.service';
import { ModalImagenService } from 'src/app/services/modal-imagen.service';
import { UsuarioService } from '../../../services/usuario.service';
import { delay } from 'rxjs/operators';
import { Subscription } from 'rxjs';



@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html'
  
})
export class UsuariosComponent implements OnInit, OnDestroy {

  public totalUsuarios: number = 0;
  public usuarios: Usuario[] = [];
  public usuariosTemp: Usuario[] = [];

  public imgSubs: Subscription;
  public desde: number = 0;
  public cargando: boolean = true;
  public busquedaTermino: boolean = false;

  constructor ( private usuarioService: UsuarioService, 
                private busquedasServices: BusquedasService,
                private modalImagenService: ModalImagenService) { }

  ngOnDestroy(): void {
    this.imgSubs.unsubscribe();
  }


  ngOnInit(): void {
    this.cargarUsuarios();
    this.imgSubs =  this.modalImagenService.nuevaImagen
            .pipe(delay(100)) // es paqra darle un tiempo de que cargue la dirección de la imagen
            .subscribe( img => this.cargarUsuarios()  );
  }

  cargarUsuarios() {
   this.cargando = true;
    this.usuarioService.cargarUsuarios( this.desde )
    .subscribe( ({ total, usuarios}) => {
      this.totalUsuarios = total;
      this.usuarios = usuarios;
      this.usuariosTemp = usuarios;
      this.cargando = false;
  })

  }

  cambiarPagina( valor: number ) {
  this.desde += valor;
  if (this.desde < 0) {
    this.desde = 0;
    } else if ( this.desde >= this.totalUsuarios ) {
      this.desde -= valor;
    }
    this.cargarUsuarios();
  }


  buscar ( termino: string ) {

    if ( termino.length === 0 ) {      
     this.busquedaTermino = true;
      return this.usuarios = this.usuariosTemp;      
    }

  this.busquedasServices.buscar( 'usuarios',termino )
  .subscribe( resultados => {
    this.busquedaTermino = true;
    this.usuarios = resultados;  
  } );
  }


  eliminarUsuario ( usuario: Usuario ) {
    
  if ( usuario.uid === this.usuarioService.uid ) {
    return Swal.fire('Error','No puede borrarse a sí mismo', 'error');    
  }

    Swal.fire({
      title: '¿Borrar usuario?',
      text: `Está a punto de borrar a ${usuario.nombre}`,
      icon: 'question',
      showCancelButton: true, 
      confirmButtonText: 'Si, borrarlo'
    }).then((result) => {
      if (result.isConfirmed) {        
        this.usuarioService.eliminarUsuario( usuario )
              .subscribe ( resp => {
                this.cargarUsuarios();
                Swal.fire (
                  'Usuario barrado',
                  `${ usuario.nombre } fué eliminado correctamente`,
                  'success'
                  )
              });    
                 
      }
    })

  }


  cambiarRole(usuario: Usuario) {
  this.usuarioService.guardarUsuario( usuario ) .subscribe ( resp => {
     console.log( resp )
  })
  }

  abrirModal( usuario: Usuario ) {
  console.log (usuario)
  this.modalImagenService.abrirModal( 'usuarios', usuario.uid, usuario.img );
  }
  
}
