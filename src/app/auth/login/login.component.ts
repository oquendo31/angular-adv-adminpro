import { ElementAst } from '@angular/compiler';
import { Component,AfterViewInit, OnInit, NgZone, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuarioService } from 'src/app/services/usuario.service';

import Swal from 'sweetalert2';

declare const google: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: [ './login.component.css' ]
})
export class LoginComponent  implements OnInit , AfterViewInit {

  @ViewChild('googleBtn') googleBtn: ElementRef;

  public formSubmitted = false;

  public loginForm = this.fb.group({    
    email: [ localStorage.getItem('email') || '' , [ Validators.required, Validators.email ] ], 
    password:  ['',[Validators.required]],
    remember: [ false ]
   
  });

  constructor( private router: Router,
               private fb: FormBuilder,
               private ussuarioService: UsuarioService,
               private ngZone: NgZone ) { }


      ngOnInit(): void {
        // this.googleInit();
        
      }

      ngAfterViewInit(): void {

       this.googleInit();
      }


      googleInit() {       

        google.accounts.id.initialize({
          client_id: "379771831570-amjt60jue2r2i58iavq6efh2ghkh5fe3.apps.googleusercontent.com",
          callback: (response:any) => this.handleCredentialResponse(response)
        });

        google.accounts.id.renderButton (
          // document.getElementById("buttonDiv"),
          this.googleBtn.nativeElement,
          { theme: "outline", size: "large" }  // customization attributes
        );


      }


      handleCredentialResponse ( response : any) {
        // console.log("Encoded JWT ID token: " + response.credential);
        this.ussuarioService.loginGoogle(response.credential)
                     .subscribe( resp => {
                      console.log({login:  resp})
                      this.router.navigateByUrl('/');
                     })


      }



  login() {
     this.ussuarioService.login(this.loginForm.value).subscribe( resp => {

      if (this.loginForm.get('remember').value) {

            localStorage.setItem('email',this.loginForm.get('email').value);
        } else {

            localStorage.removeItem('email');
      }

      //navegar al dashboard
      this.router.navigateByUrl('/');
   
     }, (err) => {
      // Si sucede un error  
           Swal.fire('Error', err.error.msg, 'error' );    
     });
  }




}
