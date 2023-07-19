import mongoose from "mongoose";
import { cartCollection } from "./cart.model.js";

export const userCollection = "users";

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
    default: "",
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
    enum: ["usuario", "admin", "premium"],
    default: "usuario",
  },
  documents: {
    type: [
      {
        name: {
          type: String,
          required: true,
        },
        reference: {
          type: String,
          required: true,
        },
      },
    ],
    default: [],
  },
  last_connection: {
    type: String,
    default: null,
  },
  status: {
    type: String,
    required: true,
    enums: ["completo", "incompleto", "pendiente"],
    default: "pendiente",
  },
  avatar: {
    type: String,
    default: "",
  },
});

// middleware
userSchema.pre(["findOne", "find"], function () {
  this.populate("cart");
});

const userModel = mongoose.model(userCollection, userSchema);

export default userModel;
