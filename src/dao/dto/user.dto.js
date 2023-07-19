export class CreateUserDto {
  constructor(user) {
    this.first_name = user.first_name;
    this.last_name = user.last_name;
    this.age = user.age;
    this.email = user.email;
    this.password = user.password;
    this.full_name = `${user.first_name} ${user.last_name}`;
    this.role = user.role;
    this.cart = user.cart;
  }
}

export class GetUserDto {
  constructor(userDB) {
    this.id = userDB._id.toString();
    this.full_name = `${userDB.first_name} ${userDB.last_name}`;
    this.age = userDB.age;
    this.email = userDB.email;
    this.role = userDB.role;
    this.cart = userDB.cart;
    this.documents = userDB.documents;
  }
}
