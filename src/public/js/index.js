const socket = io();

socket.emit("message", "Message from Frontend!");

socket.on("message", (data) => {
  console.log(data);
});

socket.on("new-product", (data) => {
  const div = document.createElement("div");
  div.innerHTML += `<ul>
                      <li>${data.title}</li>
                      <li>${data.description}</li>
                      <li>${data.code}</li>
                      <li>${data.price}</li>
                      <li>${data.stock}</li>
                      <li>${data.category}</li>
                      <li>${data.thumbnail}</li>
                      <li>${data.status}</li>
                      <li>${data.id}</li>
                    </ul>`;
  document.getElementById("product-list").appendChild(div);
});

socket.on("delete-product", (data) => {
  const div = document.createElement("div");
  div.innerHTML += `<ul>
                      <li>${data.title}</li>
                      <li>${data.description}</li>
                      <li>${data.code}</li>
                      <li>${data.price}</li>
                      <li>${data.stock}</li>
                      <li>${data.category}</li>
                      <li>${data.thumbnail}</li>
                      <li>${data.status}</li>
                      <li>${data.id}</li>
                    </ul>`;
  document.getElementById("product-list").appendChild(div);
});
