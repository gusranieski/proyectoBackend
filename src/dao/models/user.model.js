import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  rol: { 
    type: String,
    required: true,
    enum: ["usuario", "admin"], 
    default: "usuario" 
  },
});

const userModel = mongoose.model("users", userSchema);

export default userModel;
