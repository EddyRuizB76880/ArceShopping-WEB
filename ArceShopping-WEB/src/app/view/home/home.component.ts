import { Component, OnInit } from '@angular/core';
import { ProductService } from 'src/app/services/product.service';
import { Product } from '../../model/product.model'
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  catalogue:Product[];
  catalogueLoaded:Boolean;
  constructor(private productsService:ProductService) { }

  ngOnInit(): void {
    //When returning to this page, displayProducts() needs to be executed again
    //or else, the page will be blank(probably because of the ngIf on the HTML).
    if(!this.productsService.isReady()){
      this.bootProductsService();
    }else{
      this.displayProducts()
    }
  }

  async bootProductsService(){
    await this.productsService.start();
    this.displayProducts();
  }

  displayProducts(){
    this.catalogue = this.productsService.getProducts();
    this.catalogueLoaded = true;
  }
}
