export class User {
    public id: string;
    public name: number;
    public age: string;
    public location: string;
    public email: string;
    public picture: string;  
  
    constructor( id: string, name: number,
                 age: string, location: string,
                 email: string, picture: string  ){
        this.id = id;
        this.name = name;
        this.age = age;
        this.location = location;
        this.email = email;
        this.picture = picture;
    } 
  }