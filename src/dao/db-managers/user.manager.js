import userModel from "../models/user.model.js";

export class UserManagerMongo {
  constructor() {}

  async getAllUsers() {
    try {
      const users = await userModel.find();
      return users;
    } catch (error) {
      throw error;
    }
  }

  async createUser(userData) {
    try {
      const newUser = await userModel.create(userData);
      return newUser;
    } catch (error) {
      throw error;
    }
  }

  async updateUser(userId, userData) {
    try {
      const updatedUser = await userModel.findByIdAndUpdate(userId, userData, {
        new: true,
      });
      return updatedUser;
    } catch (error) {
      throw error;
    }
  }

  async deleteUser(userId) {
    try {
      const deletedUser = await userModel.findByIdAndDelete(userId);
      return deletedUser;
    } catch (error) {
      throw error;
    }
  }
}
