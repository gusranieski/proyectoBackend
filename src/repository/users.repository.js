import { CreateUserDto, GetUserDto } from "../dao/dto/user.dto.js";
import userModel from "../dao/models/user.model.js";

export class UserRepository {
  constructor() {}

  async getUsers() {
    try {
      const users = await userModel.find();
      const usersDto = users.map(user => new GetUserDto(user));
      return usersDto;
    } catch (error) {
      throw new Error(`Error al obtener los usuarios: ${error}`);
    }
  }

  async createUser(user) {
    try {
      const userDto = new CreateUserDto(user);
      const newUser = await userModel.create(userDto);
      return newUser;
    } catch (error) {
      throw new Error(`Error al crear el usuario: ${error}`);
    }
  }

  async getUser(userId) {
    try {
      const user = await userModel.findById(userId);
      const userDto = new GetUserDto(user);
      return userDto;
    } catch (error) {
      throw new Error(`Error al obtener el usuario: ${error}`);
    }
  }

  async updateUser(userId, user) {
    try {
      const updatedUser = await userModel.findByIdAndUpdate(userId, user, { new: true });
      const userDto = new GetUserDto(updatedUser);
      return userDto;
    } catch (error) {
      throw new Error(`Error al actualizar el usuario: ${error}`);
    }
  }
  

  async getUserByEmail(email) {
  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return null;
    }
    const userDto = new GetUserDto(user);
    return userDto;
  } catch (error) {
    throw new Error(`Error al obtener el usuario: ${error}`);
  }
}

}


// import { CreateUserDto, GetUserDto } from "../dao/dto/user.dto.js";

// export class UserRepository {
//     constructor(dao) {
//         this.dao = dao;
//     };

//     async getUsers(){
//     const users = await this.dao.get();
//     return users;
//     };

//     async createUser(user){
//         const userDto = new CreateUserDto(user); 
//         const userCreated = await this.dao.post(userDto);
//         return userCreated;
//     };

//     async getUser(id){
//         const user = await this.dao.getById(id);
//         console.log(id);
//         const result = new GetUserDto(user);
//         console.log(result);
//         return result;
//     };
// }




// import { CreateUserDto, GetUserDto } from "../dao/dto/user.dto.js";

// export class UserRepository {
//   constructor(dao) {
//     this.dao = dao;
//   }

//   async getUsers() {
//     const users = await this.dao.getUsers();
//     console.log(users);
//     return users;
//   }

//   async createUser(user) {
//     const userDto = new CreateUserDto(user);
//     const userCreated = await this.dao.createUser(userDto);
//     console.log(userDto);
//     return userCreated;
//   }

//   async getUser(userId) {
//     try {
//       const user = await this.dao.getUser(userId);
//       const userDto = new GetUserDto(user);
//       return userDto;
//     } catch (error) {
//       throw new Error(`Error al obtener el usuario: ${error}`);
//     }
//   }
// }



