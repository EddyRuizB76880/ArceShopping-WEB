import { Injectable } from '@angular/core';
import { Products } from '../model/products.model';
import { Product } from '../model/product.model'
@Injectable({
  providedIn: 'root'
})
export class ProductService {
  productsMap:Map<number, Product>;
  productsArray: Product[];
  initialized:Boolean;
  constructor() { 
    this.initialized = false;
    this.productsMap = new Map<number, Product>();
    this.productsArray = [];
  }

  async start(){
    await fetch('https://dummyjson.com/products',{method:'GET'})
    .then(res => res.json())
    .then((data) => {
      const productsList = data as Products;
      productsList.products.forEach((product)=>{
        this.productsMap.set(product.id, product);
      });

      this.productsArray = productsList.products;
    })
    this.initialized = true;
    
   // this.products.products.forEach((element)=>{console.log(element)});
  }

  public isReady(){
    return this.initialized;
  }

  public getProductsMap(){
    return this.productsMap;
  }

  public getProductsArray(){
    return this.productsArray;
  }

  public getProduct(id: number){
    return this.productsMap.get(id);;
  }
}
