import { Injectable,NgZone } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { environment } from 'src/environments/environment';
import {catchError, map, tap} from  'rxjs/operators'  //Dipspara un efecto secundario
import { Observable, of } from 'rxjs';
import { Router } from '@angular/router';


import {RegisterForm}  from '../interfaces/register-form.interface'
import {LoginForm}  from '../interfaces/login-form.interface'

declare const google: any;


const base_url = environment.base_url;

declare const gapi: any;

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  public auth2: any;





      constructor( private http: HttpClient, 
        private router: Router,
        private ngZone: NgZone ) {
       
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
    const token = localStorage.getItem('token') || '';

    //hacemos una peticion al backEnd
   return  this.http.get(`${base_url}/login/renew`,{
      headers: {
        'x-token': token
      }
    }).pipe(
      tap( (resp: any) => {
        localStorage.setItem('token',resp.token)       
      }),
      map( resp => true),
      catchError ( error => of(false))
    );
  }



  crearUsuario ( formData: RegisterForm ) {
    return this.http.post(`${base_url}/usuarios`,formData)
    .pipe (
      tap ( (resp: any )=> {
        localStorage.setItem('token',resp.token)
        })
    )   
    
      
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


}
