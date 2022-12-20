import { Injectable, EventEmitter } from '@angular/core';
//import { Geolocation, GeolocationPosition } from '@capacitor/geolocation';
import { GoogleMap } from '@capacitor/google-maps';
import { ActionSheet, ActionSheetButtonStyle } from '@capacitor/action-sheet';
import { Camera, CameraResultType } from '@capacitor/camera';

@Injectable({
  providedIn: 'root'
})

export class CapacitorService {
  private googleApiKey: string = 'key';
  private googleMapHtmlRef: HTMLElement;
  private googleMap: GoogleMap;
 
  public emitter:EventEmitter<string>;
  constructor() {
    this.emitter = new EventEmitter<string>();
  }

  // Google Maps functions
  setGoogleMapReference(map:any){
    this.googleMapHtmlRef = map;
    this.generateGoogleMap();
  }

  //code adapted from capacitor's official docs:
  //https://capacitorjs.com/docs/apis/google-maps
  async generateGoogleMap(){
    this.googleMap = await GoogleMap.create({
      id: 'arceshoppingweb', // Unique identifier for this map instance
      element: this.googleMapHtmlRef, // reference to the capacitor-google-map element
      apiKey: this.googleApiKey, // Your Google Maps API Key
      config: {
        center: {
          // The initial position to be rendered by the map
          lat: 33.6,
          lng: -117.9,
        },
        zoom: 20, // The initial zoom level to be rendered by the map
      },
    });

    this.adjustMap();
  }

  adjustMap(){
    //Follow this format to reposition map
    const coordinates:any = {coordinate: {lat:9.9076439, lng: -84.088048}};
    this.googleMap.setCamera(coordinates);
    this.googleMap.addMarker(coordinates);
  }
  
  // Camera functions
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
    let result:string = '3; No se eligió foto';
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: true,
      resultType: CameraResultType.Uri
    });

    if(image !== undefined){
      result = `2;${image.webPath}`;
    }

    this.emitter.emit(result);
  }

  async pickImageFromGallery(){
    let result:string = '3; No se eligió foto';
    const photo = await Camera.pickImages({limit: 1})
    if(photo != undefined){
      result = `2;${photo.photos[0].webPath}`
    }
    this.emitter.emit(result);
  }
  
}
