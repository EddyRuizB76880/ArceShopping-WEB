import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Product } from 'src/app/model/product.model';
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
  shoppingCart: Map<number , ShoppingCartRow>;
  products: Product[];

  constructor(private firebaseService:FirebaseServiceService, 
              private productService:ProductService,
              private toast: ToastrService) 
  { 
    this.firebaseSubscription= this.firebaseService.emitter.subscribe((message)=>{
      this.handleResult(message);
    });
    this.shoppingCart = new Map<number, ShoppingCartRow>();
    this.getProducts();
  }

  ngOnInit(): void {
    this.firebaseService.getUserShoppingCart();
    this.cartStatus = 0;
    const confirmButton = document.getElementById('confirmPurchaseButton') as HTMLButtonElement;
    const emptyButton = document.getElementById('emptyCartButton') as HTMLButtonElement;
    confirmButton.addEventListener('click', ()=>{ this.confirmPurchase(); })
    emptyButton.addEventListener('click', ()=>{ this.emptyCart(); })
  }

  ngOnDestroy(){
    this.firebaseSubscription.unsubscribe();
  }

  confirmPurchase(){
    let purchaseTotal: number = 0;
    const shoppingCartArray: ShoppingCartRow[] = [];
    for(let [key, row] of this.shoppingCart){
      shoppingCartArray.push(row);
      purchaseTotal += row.unitPrice*row.quantity;
    }

    this.firebaseService.confirmPurchase(shoppingCartArray, purchaseTotal);
  }

  emptyCart(){
    for(let [id, row] of this.shoppingCart){
      this.firebaseService.deleteFromShoppingCart(row.firebaseDocId);
    }
    this.shoppingCart.clear();
  }

  async getProducts(){
    if(!this.productService.isReady()){ await this.productService.start(); }
    this.products = this.productService.getProductsArray();
    console.log(this.products);
  }

  removeItem(productId: number){
   // this.shoppingCart
   this.firebaseService.deleteFromShoppingCart(this.shoppingCart.get(productId)?.firebaseDocId as string);
   this.shoppingCart.delete(productId);
  }

  handleResult(message: string) {
    const code = message.split(';', 3);
    switch(code[0]){
      case '0':
        const shoppingCartList = JSON.parse(code[1]) as ShoppingCartRow[];
        shoppingCartList.forEach((shoppingCartRow)=>{
          this.shoppingCart.set(shoppingCartRow.productId, shoppingCartRow);
        });
        console.log(this.shoppingCart);
        break;
      case '1':
        this.toast.warning(code[1], 'Aviso');
        break;
      
      case '2':
        this.emptyCart()
        //TODO: send a confirmation email to user
        this.toast.success(code[1], 'Éxito!');
    }
  }
}
