import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
  rol: { type: String, default: "usuario" },
});

const userModel = mongoose.model("users", userSchema);

export default userModel;
