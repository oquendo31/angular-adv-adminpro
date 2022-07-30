import { Component, OnDestroy  } from '@angular/core';
import { Observable, interval, Subscribable, Subscription } from 'rxjs';
import { retry,take, map,filter } from "rxjs/operators";

@Component({
  selector: 'app-rxjs',
  templateUrl: './rxjs.component.html'
  
})
export class RxjsComponent implements OnDestroy {

//Almacenar el valor de la propiedad de la clase función 1 

public intervalSubs: Subscription; //Acá inicializamos como undefined -- // cuando necesito destruír el componente hay que limpiar el intervalo 
//para esto se implementa el OnDestroy

  constructor() {

   
   

    // this.retornaObservable().pipe(
    //   retry(1)
    // ).subscribe(
    //   valor => console.log('Subs:', valor),
    //   (error) => console.warn('Error:', error),
    //   () => console.info( 'Obs terminado')
    // );


    //LLamado de la funcion 1 observable 
    this.intervalSubs = this.retornaIntervalo().subscribe ( console.log ) //intervalSubs es igual al producto de toda la subscripción a lo que retorne el subscribe
    
  }

  //Lo llamamos cuando hay observables que siempre están emitiedo valores o son ruidosos, cuando sale del modulo se detiene 
  ngOnDestroy(): void {
   this.intervalSubs.unsubscribe();
  }

 

// Funcion 1 optima de observable 
  retornaIntervalo(): Observable <number> {

    return interval(100)
                         .pipe(  
                          // take(10),                        
                          map( valor => valor + 1 ),
                          filter( valor => ( valor % 2 === 0) ? true: false )
                         
                         );  

  }



// Funcion 2 de observable 
  retornaObservable(): Observable <number> {

    let i = -1;

    return   new Observable <number>( observer => {    
      

     const intervalo = setInterval ( () => {
           i++;
           observer.next(i)

          if (i === 4) {
            clearInterval( intervalo)
            observer.complete();
          }

          if (i === 2) {
                       
            observer.error('i llegó al valor de 2');
          }

      }, 1000)

    });

    
  }
  
}
