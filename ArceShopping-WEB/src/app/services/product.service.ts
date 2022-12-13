import { Injectable } from '@angular/core';
import { Products } from '../model/products.model';
import { Product } from '../model/product.model'
@Injectable({
  providedIn: 'root'
})
export class ProductService {
  products:Products;
  initialized:Boolean;
  constructor() { 
    this.initialized = false;
  }

  async start(){
    await fetch('https://dummyjson.com/products',{method:'GET'})
    .then(res => res.json())
    .then(data=> this.products = data as Products);
    this.initialized = true;
   // this.products.products.forEach((element)=>{console.log(element)});
  }

  public isReady(){
    return this.initialized;
  }

  public getProducts(){
    return this.products.products;
  }

  public getProduct(id:Number){
    let productToFind;
    for(let i = 0; i < this.products.products.length; i++){
      if(this.products.products[i].id === id){
        productToFind = this.products.products[i];
        break;
      }
    }
    return productToFind;
  }
}
