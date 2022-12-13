export class User {
    public id: string;
    public name: number;
    public age: string;
    public location: string;
    public email: string;
    public picture: string;  
  
    constructor(){}

    //For some reason, this function is not recognized when I try to use it from firebase service
    public stringify():string {
      return `{
                "id": ${this.id}, "name":${this.name}, "age":${this.age},
                "location": ${this.location}, "email":${this.email},
                "picture": ${this.picture}
              }`
    }
  }