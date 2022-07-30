import { Component, OnDestroy} from '@angular/core';
import { ActivatedRoute, ActivationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';

@Component({
  selector: 'app-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styles: [
  ]
})
export class BreadcrumbsComponent  implements OnDestroy  {

  public titulo: string; // Declaro la variable que voy a utlizar el titulo
  public tituloSubs$: Subscription ; // Esto para utlizrlo para destruír el subscribe cuando salga dela sesion 

  constructor( private router: Router, private route: ActivatedRoute) { 
    
                      this.tituloSubs$ = this.getArgumentosRuta()
                      .subscribe( ({titulo}) =>  { // ya no tyendríamos un evento si no la data    // acá desestruramos la data y desestraemos  la propiedad del titulo  ({{titulo}})
                         this.titulo = titulo;  //Acá asignamos la data obtenida a la variable del titulo
                         document.title = `AdminPro - ${titulo}`;
   });



// llamamos el metodo 
  }

  ngOnDestroy(): void {  // si salimos de la sesion destruímos el subscribe 
    this.tituloSubs$.unsubscribe();
  }




  getArgumentosRuta() { // Metodo acá lo vamos a mover a otro lugar 
    
   return  this.router.events
    .pipe(
      filter( event => event instanceof ActivationEnd), // este filter es para sacar solo el ActivationEnd de toda la data 
      filter( (event: ActivationEnd) => event.snapshot.firstChild === null), // acá realizamos otro filtro para sacar el ActivationEnd que tiene la data 
      map ( (event: ActivationEnd) => event.snapshot.data), // aca sacamos solo la data 
    )

  }



}
