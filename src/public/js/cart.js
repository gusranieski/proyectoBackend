function removeProduct(cartId, productId) {
  fetch(`/api/carts/${cartId}/products/${productId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (response.ok) {
        location.reload();
      } else {
        console.error("Error al eliminar el producto del carrito.");
      }
    })
    .catch((error) => {
      console.error("Error al eliminar el producto del carrito:", error);
    });
}

function emptyCart(cartId) {
  fetch(`/api/carts/${cartId}/emptycart`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ products: [] }),
  })
    .then((response) => {
      if (response.ok) {
        location.reload();
      } else {
        console.error("Error al vaciar el carrito.");
      }
    })
    .catch((error) => {
      console.error("Error al vaciar el carrito:", error);
    });
}

async function updateCartItemQuantity(cartId, productId, newQuantity) {
  try {
    const response = await fetch(`/api/carts/${cartId}/products/${productId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ quantity: parseInt(newQuantity) }),
    });

    if (response.ok) {
      console.log("Cantidad del producto actualizada exitosamente");
      const successMessageElement = document.getElementById("success-message");
      successMessageElement.textContent = "¡Cantidad del producto actualizada exitosamente!";
            
      location.reload();
    } else {
      const errorMessage = await response.text(); // Obtener el mensaje de error desde la respuesta
      console.error("Error al realizar la compra", errorMessage);

      // Agregar código para mostrar el mensaje de error en la página carts.hbs
      const errorMessageElement = document.getElementById("error-message");
      errorMessageElement.textContent = errorMessage;
    }
  } catch (error) {
    console.error("Hubo un error al actualizar la cantidad del producto", error);
  }
}
