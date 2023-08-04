import {
  CreateUserDto,
  GetUserDto,
} from "../dao/dto/user.dto.js";
import userModel from "../dao/models/user.model.js";

export class UserRepository {
  constructor() {}

  async getUsers() {
    try {
      const allUsers = await userModel.find();
      return allUsers;
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
      const updatedUser = await userModel.findByIdAndUpdate(userId, user, {
        new: true,
      });
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

  async deleteUser(userId) {
    try {
      const deletedUser = await userModel.findByIdAndDelete(userId);
      if (!deletedUser) {
        throw new Error("Usuario no encontrado");
      }
      return deletedUser;
    } catch (error) {
      throw new Error(`Error al eliminar el usuario: ${error}`);
    }
  }
}
