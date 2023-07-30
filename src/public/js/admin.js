async function changeUserRole(userId) {
  try {
    const response = await fetch(`/api/admin/premium/${userId}`, {
      method: "PUT",
    });

    if (response.ok) {
      const messageElement = document.getElementById(`message-${userId}`);
      messageElement.textContent = "Cambiando de rol...";

      location.reload();
    } else {
      console.error("Error al cambiar el rol del usuario");
    }
  } catch (error) {
    console.error("Hubo un error al cambiar el rol del usuario", error);
  }
}

function deleteUser(userId) {
  fetch(`/api/admin/users/${userId}`, {
    method: "DELETE",
  })
    .then((response) => {
      if (response.ok) {
        console.log("Usuario eliminado exitosamente");
        location.reload();
      } else {
        console.error("Error al eliminar el usuario");
      }
    })
    .catch((error) => {
      console.error("Error al enviar la solicitud DELETE", error);
    });
}
