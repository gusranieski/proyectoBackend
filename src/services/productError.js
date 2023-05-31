export const generateProductErrorInfo = (product) => {
  return `
        Uno o más campos están incompletos o no son válidos!
        Lista de campos requeridos:
        title: debe ser un campo de tipo String, pero se recibió ${product.title},
        description: debe ser un campo de tipo String, pero se recibió ${product.description},
        code: debe ser un campo de tipo Number, pero se recibió ${product.code},
        price: debe ser un campo de tipo Number, pero se recibió ${product.price},
        stock: debe ser un campo de tipo Number, pero se recibió ${product.stock},
    `;
};

export const updateProductErrorInfo = (product) => {
  return `
        Uno o más campos están incompletos o no son válidos!
        Lista de campos requeridos:
        title: debe ser un campo de tipo String, pero se recibió ${product.title},
        description: debe ser un campo de tipo String, pero se recibió ${product.description},
        code: debe ser un campo de tipo Number, pero se recibió ${product.code},
        price: debe ser un campo de tipo Number, pero se recibió ${product.price},
        stock: debe ser un campo de tipo Number, pero se recibió ${product.stock},
    `;
};

export const generateProductErrorParam = (id) => {
  return `
        el id del producto es incorrecto, debe ser un valor alfanumérico, pero se recibió ${id}
    `;
};
