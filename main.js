class ProductManager {

  constructor() {
    this.products = [];
  }

  static id = 0;

addProduct(title, description, price, thumbail, code, stock) {
    
    if (!title || !description || !price || !thumbail || !code || !stock) {
        console.log('Error: Todos los campos son obligatorios');
        return;
      }

    const existingProduct = this.products.find(product => product.code === code);

    if (existingProduct) {
      console.log(`Error: Ya existe un producto con el código ${code}`);
      return;
    }

    ProductManager.id++
    this.products.push({ title, description, price, thumbail, code, stock, id:ProductManager.id })
  }

  getProducts() {
    return this.products;
  }

  getProductById(id) {

    const search = this.products.find(product => product.id === id)

    if(search == undefined) {
        console.log("Not Found");
    } else {
        console.log(search);
    }
  }
}

const manager = new ProductManager;
// primer llamada a getProducts con el array vacío
console.log(manager.getProducts());
// se llama al método addProdruct
manager.addProduct("Mouse Logitech", "Inalámbrico M280 Rojo", 6900, "ruta de imágen", 001, 50);
manager.addProduct("Auriculares Motorola", "Pulse 120 Blanco", 4200, "ruta de imágen2", 002, 50);
manager.addProduct("Teclado Logitech", "K120", 5400, "ruta de imágen2", 003, 50);
// segunda llamada a getProducts ya con los productos en el array
console.log(manager.getProducts());
// se vuelve a llamar a addProduct con un producto repetido, debe arrojar error
manager.addProduct("Teclado Logitech", "K120", 5400, "ruta de imágen2", 003, 50);
// se llama a getProductById por un id inexistente, debe arrojar Not Found
manager.getProductById(4);