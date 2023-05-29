// import userModel from "../models/user.model.js";

// export class UserManagerMongo {
//   constructor() {}

//   async getAllUsers() {
//     try {
//       const users = await userModel.find();
//       return users;
//     } catch (error) {
//       throw new Error(`Error al obtener los usuarios: ${error}`);
//     }
//   }

//   async createUser(userData) {
//     try {
//       const newUser = await userModel.create(userData);
//       return newUser;
//     } catch (error) {
//       throw new Error(`Error al crear el usuario: ${error}`);
//     }
//   }

//   async updateUser(userId, userData) {
//     try {
//       const updatedUser = await userModel.findByIdAndUpdate(userId, userData, {
//         new: true,
//       });
//       return updatedUser;
//     } catch (error) {
//       throw new Error(`Error al actualizar el usuario: ${error}`);
//     }
//   }

//   async deleteUser(userId) {
//     try {
//       const deletedUser = await userModel.findByIdAndDelete(userId);
//       return deletedUser;
//     } catch (error) {
//       throw new Error(`Error al eliminar el usuario: ${error}`);
//     }
//   }
// }
