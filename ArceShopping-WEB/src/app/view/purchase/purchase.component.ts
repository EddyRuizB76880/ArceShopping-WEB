import { Component, OnInit } from '@angular/core';
import { Purchase } from 'src/app/model/purchase.model';
import { ShoppingCartRow } from 'src/app/model/shoppingCartRow.model';
import { ProductService } from 'src/app/services/product.service';
import { Product } from 'src/app/model/product.model'
@Component({
  selector: 'app-purchase',
  templateUrl: './purchase.component.html',
  styleUrls: ['./purchase.component.css']
})
export class PurchaseComponent implements OnInit {
  selectedPurchase: Purchase;
  purchaseShoppingCart: ShoppingCartRow[];
  productList: Product[];
  constructor(private productService: ProductService) { }

  ngOnInit(): void {
    const purchaseString = localStorage.getItem('selectedPurchase') as string;
    this.purchaseShoppingCart = [];

    if(purchaseString !== null){
      this.selectedPurchase = JSON.parse(purchaseString) as Purchase;
      this.purchaseShoppingCart = JSON.parse(this.selectedPurchase.purchaseShoppingCart) as ShoppingCartRow[];
    }

    this.getProducts();
  }

  async getProducts() {
    if(!this.productService.isReady()){ await this.productService.start()}
    this.productList = this.productService.getProductsArray();
    console.log(this.productList)
  }
}
