import { Deserializable } from "../interfaces/deserializable";


export class Expense implements Deserializable{
  public id: number = 0;
  public location:string = '';
  public description:string = '';
  public item: string = '';
  public amount: number = 0;
  public date: Date = new Date();
  public paymentType: string = '';
  public category:string = '';

  constructor(init?: Partial<Expense>) {
    if (init) {
      Object.assign(this, init);
    }
  }

  deserialize(object: any): this {
    Object.assign(this, object);
    this.date = new Date(object.date);
    return this;
  }
}
