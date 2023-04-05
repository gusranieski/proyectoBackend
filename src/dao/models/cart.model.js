import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const cartSchema = new mongoose.Schema({
  products: {
    type: [
      {
        idProduct: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "products",
        },
        quantity: {
          type: Number,
        },
      },
    ],
    default: [],
    required: true,
  },
});
// middleware
cartSchema.pre(["findOne", "find"], function() {
  this.populate("products.idProduct");
});

cartSchema.plugin(mongoosePaginate);

const cartModel = mongoose.model("carts", cartSchema);

export default cartModel;
