import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product } from 'src/app/model/product.model';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})

export class ProductComponent implements OnInit {
  product:Product;
  productExists:Boolean;
  sub:any;
  productId:string;
  constructor(private productsService: ProductService,
              private route: ActivatedRoute) {}

  ngOnInit(): void {

    this.sub = this.route.params.subscribe((params:any) => {
      console.log("voy")
      this.productId = params['id'];
      console.log(this.productId);
      this.getProduct();
    });
  }

  getProduct(){
    this.product= this.productsService.getProduct(parseInt(this.productId)) as Product;
      if(this.product != undefined){
        
        this.productExists = true;
      }
  }

  async checkService(){
    if(!this.productsService.isReady){
     await this.productsService.start();
    }
  }
}
