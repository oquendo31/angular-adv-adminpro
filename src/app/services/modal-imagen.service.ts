import { EventEmitter, Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class ModalImagenService {

  private _ocultarModal: boolean = true;

   public tipo : 'usuarios'|'medicos'|'hospitales'
   public id   : string
   public img  : string

   public nuevaImagen: EventEmitter<string> = new EventEmitter<string>();
   
    


  get ocultarModal() {
    return this._ocultarModal;
  }

  abrirModal( tipo: 'usuarios'|'medicos'|'hospitales', id: string , img: string ='no-img' ) {
    this._ocultarModal = false;
    this.tipo = tipo;
    this.id = id;
    // this.img = img;
  if ( img.includes ( 'https' )) {
      this.img = img;
  } else {
    this.img = `${base_url}/upload/${ tipo }/${ img }`
  }

    // localhost:3000/api/upload/usuarios/0433b4a5-ae75-4ea4-8b6b-53c6a0bacf34.jpg

  }

  cerrarModal() {
    this._ocultarModal = true;
  }

  constructor() { }
}
