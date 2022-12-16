import { Component, OnInit } from '@angular/core';
import { CONNREFUSED } from 'dns';
import { ToastrService } from 'ngx-toastr';
import { Product } from 'src/app/model/product.model';
import { Products } from 'src/app/model/products.model';
import { ShoppingCartRow } from 'src/app/model/shoppingCartRow.model';
import { FirebaseServiceService } from 'src/app/services/firebase-service.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  cartStatus: number;
  private firebaseSubscription: any;
  shoppingCart: ShoppingCartRow[];
  products: Product[];

  constructor(private firebaseService:FirebaseServiceService, 
              private productService:ProductService,
              private toast: ToastrService) 
  { 
    this.firebaseSubscription= this.firebaseService.emitter.subscribe((message)=>{
      this.handleResult(message);
    });
    this.getProducts();
  }

  ngOnInit(): void {
    this.firebaseService.getUserShoppingCart();
    this.cartStatus = 0;
  }

  ngOnDestroy(){
    this.firebaseSubscription.unsubscribe();
  }

  async getProducts(){
    if(!this.productService.isReady()){ await this.productService.start() }
    this.products = this.productService.getProducts();
    console.log(this.products);
  }

  handleResult(message: string) {
    const code = message.split(';', 3);
    switch(code[0]){
      case '0':
        this.shoppingCart = JSON.parse(code[1]) as ShoppingCartRow[];
        console.log(this.shoppingCart);
        break;
    }
  }

}
