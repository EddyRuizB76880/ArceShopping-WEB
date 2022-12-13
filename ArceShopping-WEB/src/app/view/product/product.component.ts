import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Product } from 'src/app/model/product.model';
import { FirebaseServiceService } from 'src/app/services/firebase-service.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})

export class ProductComponent implements OnInit {
  product:Product;
  productExists:Boolean;
  addButton:HTMLButtonElement;
  firebaseSubscription:any
  sub:any;
  productId:string;
  constructor(private productsService: ProductService,
              private firebaseService: FirebaseServiceService,
              private route: ActivatedRoute,
              private router: Router,
              private toast: ToastrService) {}

  ngOnInit(): void {

    this.sub = this.route.params.subscribe((params:any) => {
      this.productId = params['id'];
      this.getProduct();
    });

    this.firebaseSubscription = this.firebaseService.emitter.subscribe((message)=>{
      this.handleResult(message);
    });

    this.addButton = document.getElementById('add-button') as HTMLButtonElement;
    this.addButton.addEventListener('click',()=>{
      this.addProductToShoppingCart();
    });

  }

  ngOnDestroy():void{
    this.sub.unsubscribe();
    this.firebaseSubscription.unsubscribe();
  }

  //ToDo: Find a way to share code between components without creating another service.
  handleResult(message:string){
    const code = message.split(':',2);
    switch(code[0]){
      case '0':
        this.toast.success(code[1], 'Exito!');
        this.router.navigateByUrl('home',{replaceUrl:true});
        break;
      case '1':
        this.toast.error(code[1], 'Error');
        break;
    }
  }

  async getProduct(){
    await this.checkService();
    this.product= this.productsService.getProduct(parseInt(this.productId)) as Product;
      if(this.product != undefined){     
        this.productExists = true;
      }
  }

  async checkService(){
    if(!this.productsService.isReady()){
     await this.productsService.start();
    }
  }

  addProductToShoppingCart(){
    const requestedQuantity = document.getElementById('quantity') as HTMLInputElement;
    this.firebaseService.insertToShoppingCart(this.product, parseInt(requestedQuantity.value));
  }
}
