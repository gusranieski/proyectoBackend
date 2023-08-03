import mongoose from "mongoose";

const ticketsCollection = "tickets";

const ticketsSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
  },
  purchase_datetime: Date,
  amount: Number,
  purchaser: {
    type: String,
    required: true,
  },
  cartId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "carts", 
  },
});

const ticketsModel = mongoose.model(ticketsCollection, ticketsSchema);

export default ticketsModel;
