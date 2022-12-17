export class ShoppingCartRow{
    ownerEmail:string;
    quantity:number;
    unitPrice:number;
    productId:number;
    firebaseDocId:string;

    constructor() {}
    public setDocId(id: string){
        this.firebaseDocId = id;
    }
}