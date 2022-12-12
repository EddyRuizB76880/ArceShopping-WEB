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
    if(!this.productsService.isReady()){
      this.bootProductsService();
    }
  }

  async bootProductsService(){
    await this.productsService.start();
    this.catalogue = this.productsService.getProducts();
    this.catalogueLoaded = true;
  }
}
