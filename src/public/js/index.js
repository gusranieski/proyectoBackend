const socket = io();

socket.emit("message", "Message from Frontend!");

socket.on("message", (data) => {
    console.log(data);
  });


socket.on("new-product", (data) => {
  const div = document.createElement("div");
  div.innerHTML += `<ul>
                      <li>Title: ${data.title}</li>
                      <li>Description: ${data.description}</li>
                      <li>Code: ${data.code}</li>
                      <li>Price: ${data.price}</li>
                      <li>Stock: ${data.stock}</li>
                      <li>Category: ${data.category}</li>
                      <li>ID: ${data.id}</li>
                    </ul>`;
  document.getElementById("product-list").appendChild(div);
});

socket.on("delete-product", (data) => {
  const productList = document.getElementById("product-list");
  // Limpia la lista antes de actualizarla
  productList.innerHTML = ""; 

  data.forEach((product) => {
    if (product.id !== data) {
      // Si el producto actual no es el que fue eliminado, agrega un nuevo elemento a la lista
      const div = document.createElement("div");
      div.innerHTML += `<ul>
                        <li>Title: ${product.title}</li>
                        <li>Description: ${product.description}</li>
                        <li>Code: ${product.code}</li>
                        <li>Price: ${product.price}</li>
                        <li>Stock: ${product.stock}</li>
                        <li>Category: ${product.category}</li>
                        <li>ID: ${product.id}</li>
                      </ul>`;
      productList.appendChild(div);
    }
  });
});

