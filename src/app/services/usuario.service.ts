import { Injectable,NgZone } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { environment } from 'src/environments/environment';
import {catchError, map, tap} from  'rxjs/operators'  //Dipspara un efecto secundario
import { Observable, of } from 'rxjs';
import { Router } from '@angular/router';

import { CargarUsuario }  from '../interfaces/cargar-usuarios.interface'
import {RegisterForm}  from '../interfaces/register-form.interface'
import {LoginForm}  from '../interfaces/login-form.interface'

import { Usuario }  from '../models/usuario.model'


declare const google: any;


const base_url = environment.base_url;

declare const gapi: any;

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  public auth2: any;
  public usuario: Usuario;


      constructor( private http: HttpClient, 
        private router: Router,
        private ngZone: NgZone ) {
       
        }  
        
        

        get token(): string {
          return localStorage.getItem('token') || '';
        }

        get uid():string {
          return this.usuario.uid || '';
        }

        get headers() {
          return {
            headers: {
              'x-token': this.token
            }

          }    
        } 
               

  logout() {    
    localStorage.removeItem('token');    
      google.accounts.id.revoke(localStorage.email,() => {
      localStorage.removeItem('email');
      this.ngZone.run(() => {
        this.router.navigateByUrl('/login');
      })
      
    })    

  }  



  validarToken(): Observable<boolean> { //Luego utilizamos este servicio en el authGuard
    //Estraigo el token del local store 
    // const token = localStorage.getItem('token') || '';

    //hacemos una peticion al backEnd
   return  this.http.get(`${base_url}/login/renew`,{
      headers: {
        'x-token': this.token
      }
    }).pipe(
      map( (resp: any) => {
  console.log(resp)
        const { nombre, email, img = '',google,role,uid   } = resp.usuario; 
        this.usuario = new Usuario (nombre, email, '', google, role, img, uid );
        // this.usuario.imprimirUsuario();
        localStorage.setItem('token',resp.token)  
        return true;     
      }),
      // map( resp => true),

      catchError ( error => of(false))
    );
  }


//Crear Usuario
  crearUsuario ( formData: RegisterForm ) {
    return this.http.post(`${base_url}/usuarios`,formData)
    .pipe (
      tap ( (resp: any )=> {
        localStorage.setItem('token',resp.token)
        })
    )   
      
  }  


  //Actualizar Perfil
actualizarPerfil( data: { email:string, nombre:string, role: string } ) {
  data = {
    ...data,
    role: this.usuario.role
  }

  return this.http.put(`${base_url}/usuarios/${ this.uid }`,data, this.headers )

}


  
  login ( formData: LoginForm ) {
          return this.http.post(`${base_url}/login`,formData)
                    .pipe (
                        tap ( (resp: any )=> {
                          localStorage.setItem('token',resp.token)
                          })
                      )
                }



  loginGoogle( token: string ) {

    return this.http.post(`${ base_url }/login/google`, { token } )
                .pipe(
                    tap( (resp: any) => {
                    // console.log(resp)
                    localStorage.setItem('token', resp.token )
                    localStorage.setItem('email', resp.email )
                  })
                );
      }

cargarUsuarios( desde: number = 0 ) { 
  const url= `${ base_url}/usuarios?desde=${ desde }`;
  return this.http.get<CargarUsuario>( url, this.headers )
          .pipe(      
            map( resp => {
              const  usuarios = resp.usuarios.map( 
                user => new Usuario( user.nombre, user.email, '', user.google, user.role, user.img,user.uid )
              )
              return {                
                total: resp.total,
                usuarios
              }
            })
          )
}

eliminarUsuario ( usuario: Usuario ) {
  //localhost:3000/api/usuarios/62f725ec86fdd601d0a6d147
  const url= `${ base_url}/usuarios/${ usuario.uid }`;
  return this.http.delete ( url, this.headers )

}

  //Actualizar rol
  guardarUsuario ( usuario: Usuario ) {

    return this.http.put(`${base_url}/usuarios/${ usuario.uid }`,usuario, this.headers )
  
  }
 
}
