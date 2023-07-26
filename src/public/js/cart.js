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
