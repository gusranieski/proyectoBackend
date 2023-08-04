import productModel from '../dao/models/product.model.js';
import { connectDB } from '../config/dbConnection.js';

connectDB();

const updateProducts = async () => {
  try {
    const adminUserId = '64b07528f72f7213a64fddec';
    
    // Verificar si el campo "owner" ya está presente en los documentos
    const hasOwnerField = await productModel.exists({ owner: { $exists: true } });
    
    if (hasOwnerField) {
      const productsCount = await productModel.countDocuments({ owner: { $exists: true } });
      console.log(`El campo "owner" ya está presente en ${productsCount} documentos. No se realizaron modificaciones.`);
    } else {
      const { nModified } = await productModel.updateMany({}, { $set: { owner: adminUserId } });
      console.log(`Total de productos modificados: ${nModified}`);
    }
  } catch (error) {
    console.log(error);
  }
};

updateProducts();
