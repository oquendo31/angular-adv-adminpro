import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';


const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {

  constructor() { }

 async actualizarFoto ( archivo: File,tipo: 'usuarios' | 'medicos' | 'hospitales',id: string ) { //Lo colocamos asincrono 
  

  try {
    // Ya tenemos la url
    const url = `${base_url}/upload/${tipo}/${id}`
    // Necesitamos preparar la data
    const formData = new FormData(); // No hay que importat nada esto es propio de javaScript
    formData.append('imagen',archivo);
    //Vamos ha hacer la petición, almacenamos en una variable llamada respuesta 
    const resp = await fetch ( url,{
      method: 'PUT',
      headers: {
        'x-token': localStorage.getItem ('token') || ''
      },
      body: formData
    });

    const data = await resp.json();

    if ( data.ok )  {
      return data.nombreArchivo;
    } else {
      console.log( data.msg );
      return false;
    }

    
  } catch (error) {
    console.log(error);
    return false;
    
  }

}

}
