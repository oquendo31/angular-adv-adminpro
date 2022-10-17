import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Usuario } from 'src/app/models/usuario.model';
import { UsuarioService } from '../../services/usuario.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: []
})
export class PerfilComponent implements OnInit {

  public perfilForm: FormGroup;
  public usuario: Usuario;

  constructor( private fb: FormBuilder,
               private usuarioService: UsuarioService )   { 
            
                this.usuario = usuarioService.usuario;
          }

  ngOnInit(): void {

    this.perfilForm = this.fb.group({
      nombre: [this.usuario.nombre, Validators.required ],
      email:  [this.usuario.email, [ Validators.required, Validators.email ] ],
    });
    
  }

  actualizarPerfil() {
    console.log(this.perfilForm.value);
    this.usuarioService.actualizarPerfil( this.perfilForm.value )
        .subscribe( () => {
           const { nombre, email } = this.perfilForm.value;
           this.usuario.nombre = nombre;
           this.usuario.email = email;
           Swal.fire( 'Perfil actualizado satsfactoriamente | uppercase '  );    
        })
  }

}
