import mongoose from "mongoose";
import { cartCollection } from "./cart.model.js";

const userCollection = "users";

const userSchema = new mongoose.Schema({
  first_name: {
    type: String,
    required: true,
  },
  last_name: {
    type: String,
    required: true,
  },
  full_name: {
    type: String,
    default: '',
  },
  age: Number,
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  cart: {
    type: mongoose.Schema.Types.ObjectId,
    ref: cartCollection,
  },
  role: {
    type: String,
    required: true,
    enum: ["usuario", "admin"],
    default: "usuario",
  },
});

// middleware
userSchema.pre(["findOne", "find"], function () {
  this.populate("cart");
});

const userModel = mongoose.model(userCollection, userSchema);

export default userModel;
