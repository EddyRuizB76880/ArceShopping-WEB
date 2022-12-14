import { Injectable, EventEmitter } from '@angular/core';
import { Geolocation, GeolocationPosition } from '@capacitor/geolocation';
import { ActionSheet, ActionSheetButtonStyle, ShowActionsOptions, ShowActionsResult } from '@capacitor/action-sheet';
import { Camera, CameraResultType } from '@capacitor/camera';

@Injectable({
  providedIn: 'root'
})

export class CapacitorService {

  public emitter:EventEmitter<string>;
  constructor() {
    this.emitter = new EventEmitter<string>();
  }

  async displayPictureOptions(){
    //Code adapted from capacitor's official website.
    //https://capacitorjs.com/docs/apis/action-sheet
    console.log('llaman')
    
    const result = await ActionSheet.showActions({
      title: 'Elegir mi imagen de perfil',
      message: '¿Cómo deseas establecer tu imagen de perfil?',
      options: [
        {
          title: 'Galería',
          style:ActionSheetButtonStyle.Default
        },
        {
          title: 'Cámara del dispositivo',
          style:ActionSheetButtonStyle.Default
        },
        {
          title: 'Cancelar',
          style: ActionSheetButtonStyle.Cancel,
        },
      ],
    });
  
    this.decideAction(result.index);
  }

  decideAction(result:number){
      switch(result){
        case 0:
          this.pickImageFromGallery();
          break;
        
        case 1:
          this.takePicture();
      }
  }

  //Code adapted from capacitor's official documentation
  //https://capacitorjs.com/docs/apis/camera
  async takePicture(){
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: true,
      resultType: CameraResultType.Uri
    });
    
    this.emitter.emit(`2;${image.webPath}`);
  }

  async pickImageFromGallery(){
    const photo = await Camera.pickImages({limit: 1})
    let result = '3; No se eligió foto';
    if(photo != undefined){
      result = `2;${photo.photos[0].webPath}`
    }
    this.emitter.emit(result);
  }
  
}
