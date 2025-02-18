import { Deserializable } from "../interfaces/deserializable";

export class Register implements Deserializable {
  public firstname?: string;
  public lastname?: string;
  public username?: string;
  public password?: string;
  public passwordConfirmation?: string;

  deserialize(object: any) {
    Object.assign(this, object);
    this.passwordConfirmation = object.confirmPassword ?? object.passwordConfirmation;
    return this;
  }

}
