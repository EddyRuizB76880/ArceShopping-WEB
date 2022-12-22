import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Product } from 'src/app/model/product.model';
import { ShoppingCartRow } from 'src/app/model/shoppingCartRow.model';
import { FirebaseServiceService } from 'src/app/services/firebase-service.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})

export class ProductComponent implements OnInit {
  product:Product;
  //this attribute allows us to do the necessary validations on 
  //the component before saving a new shopping cart row in firebase 
  shoppingCartRow: ShoppingCartRow;
  shoppingCartRowId: string;
  productCurrentQuantity:number = 0;
  productExists:Boolean;
  requestedQuantity: number = 1;
  firebaseSubscription:any
  sub:any;
  productId:string;
  constructor(private productsService: ProductService,
              private firebaseService: FirebaseServiceService,
              private route: ActivatedRoute,
              private router: Router,
              private toast: ToastrService,
              private spinner: NgxSpinnerService) {}

  ngOnInit(): void {
    this.spinner.show();
    this.sub = this.route.params.subscribe((params:any) => {
      this.productId = params['id'];
      this.getProduct();
    });

    this.firebaseSubscription = this.firebaseService.emitter.subscribe((message)=>{
      this.handleResult(message);
    });

    this.firebaseService.getShoppingCartItem(this.productId);
  }

  ngOnDestroy():void{
    this.sub.unsubscribe();
    this.firebaseSubscription.unsubscribe();
  }

  //ToDo: Find a way to share code between components without creating another service.
  handleResult(message:string){
    const code = message.split(';',3);
    this.enableInput()
    switch(code[0]){
      case '0':
        this.toast.success(code[1], 'Exito!');
        this.router.navigateByUrl('home',{replaceUrl:true});
        break;
      case '1':
        this.toast.error(code[1], 'Error');
        break;
      
      case '2':
        //if product is being included in the sc for the first time, this string will be empty 
        if(code[1].length > 0){ 
          this.shoppingCartRow = JSON.parse(code[1]) as ShoppingCartRow;
          this.shoppingCartRowId = code[2];
          this.productCurrentQuantity = this.shoppingCartRow.quantity;
        }
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

  disableInput(){
    this.spinner.show();
  }

  enableInput(){
    this.spinner.hide();
  }

  addProductToShoppingCart(){
    this.disableInput();
    const newQuantity: number = this.requestedQuantity + this.productCurrentQuantity;
    
    if(newQuantity <= this.product.stock){
      if(this.shoppingCartRow === undefined){
        this.firebaseService.insertToShoppingCart(this.product, 
                                                  this.requestedQuantity);
      }else{
        if(newQuantity <= 10){
          this.firebaseService.updateShoppingCartRowQuantity(newQuantity, this.shoppingCartRowId);
        }else{
          this.toast.warning(`Ya hay ${this.shoppingCartRow.quantity} unidades de este producto en el carrito. Sólo se puede llevar hasta 10 unidades`,'Aviso');
          this.enableInput();
        }
      }
    }else{
      this.toast.warning('La cantidad solicitada excede el stock disponible','Aviso');
      this.enableInput();
    }
  }
}
