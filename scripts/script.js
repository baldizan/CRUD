const app = "https://672bdd501600dda5a9f69a41.mockapi.io/";
const usuarios = "https://672bdd501600dda5a9f69a41.mockapi.io/users";

document.querySelector("#btnGet1").addEventListener("click", obtenerRegistros);
document.querySelector("#btnPost").addEventListener("click", agregarRegistro);
document.querySelector("#btnPut").addEventListener("click", manejarPut);
document.querySelector("#btnSendChanges").addEventListener("click", modificarRegistro);
document.querySelector("#btnDelete").addEventListener("click", eliminarRegistro);

document.querySelector("#inputPostNombre").addEventListener("input", alternarEstadoBoton);
document.querySelector("#inputPostApellido").addEventListener("input", alternarEstadoBoton);
document.querySelector("#inputPutNombre").addEventListener("input", alternarEstadoBoton);
document.querySelector("#inputPutApellido").addEventListener("input", alternarEstadoBoton);
document.querySelector("#inputPutId").addEventListener("input", alternarEstadoBoton);
document.querySelector("#inputDelete").addEventListener("input", alternarEstadoBoton);

// Alternar habiltiación/desabiltiación de los botones
function alternarEstadoBoton() {
    alternarBotonPost();
    alternarBotonPut();
    alternatBotonDelete();
}

function alternarBotonPost() {
    const nombre = document.querySelector("#inputPostNombre").value;
    const apellido = document.querySelector("#inputPostApellido").value;
    const btnPost = document.querySelector("#btnPost");
    btnPost.disabled = !(nombre && apellido);
}

function alternarBotonPut() {
    const idPut = document.querySelector("#inputPutId").value;
    const btnPut = document.querySelector("#btnPut");
    btnPut.disabled = !idPut;
}

function alternatBotonDelete() {
    const idDelete = document.querySelector("#inputDelete").value;
    const btnDelete = document.querySelector("#btnDelete");
    btnDelete.disabled = !idDelete;
}

// Obtener usuarios o un usuario por ID
function obtenerRegistros() {
    let input = document.querySelector("#inputGet1Id").value;
    let url = input ? `${usuarios}/${input}` : usuarios;

    fetch(url)
        .then(response => {
            if (response.ok) return response.json();
            alert("Error al obtener los datos");
        })
        .then(data => {
            let ul = document.querySelector("#results");
            ul.innerHTML = "";
            let cadena = "";

            if (input) {
                cadena = `<li>ID : ${data.id} <br> Name: ${data.name} <br> LastName: ${data.lastname}</li><br>`;
            } else {
                data.forEach(usuario => {
                    cadena += `<li>ID : ${usuario.id} <br> Name: ${usuario.name} <br> LastName: ${usuario.lastname}</li><br>`;
                });
            }
            ul.innerHTML = cadena;
        })
        .catch(error => {
            alert("Ocurrió un error", error);
        });
}

// Agregar un nuevo usuario
function agregarRegistro() {
    let nombre = document.querySelector("#inputPostNombre").value;
    let apellido = document.querySelector("#inputPostApellido").value;

    let usuario = {
        name: nombre,
        lastname: apellido
    };

    fetch(usuarios, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(usuario)
    })
        .then(response => response.json())
        .then(data => console.log('Usuario agregado:', data))
        .catch(error => console.error('Error:', error));
}

// Manejar la acción de modificación (PUT)
let currentId;
function manejarPut() {
    let id = document.querySelector("#inputPutId").value;
    if (id) {
        currentId = id;
        mostrarModal(id);
    } else {
        alert("Por favor, ingresa un ID válido para modificar.");
    }
}

// Mostrar el modal con la información del usuario a modificar
function mostrarModal(id) {
    let url = `${usuarios}/${id}`;
    fetch(url)
        .then(response => {
            if (response.ok) return response.json() ;
            else throw new Error("Usuario no encontrado o ID inválido.");
        })
        .then(data => {
            document.querySelector("#inputPutNombre").value = data.name;
            document.querySelector("#inputPutApellido").value = data.lastname;
            document.querySelector("#btnSendChanges").disabled = false;


            let dataModal = new bootstrap.Modal(document.getElementById("dataModal"));
            dataModal.show();

        })
        .catch(error => {
            alert(error.message || "Ocurrió un error al obtener los datos del usuario.");
        });
}

// Enviar los cambios del usuario modificado
function modificarRegistro() {
    let url = `${usuarios}/${currentId}`;
    let datosAModificar = {
        name: document.querySelector("#inputPutNombre").value,
        lastname: document.querySelector("#inputPutApellido").value
    };

    fetch(url, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datosAModificar)
    })
        .then(response => {
            if (response.ok) return response.json();
            alert("Error al actualizar el usuario");
        })
        .then(() => {
            let dataModal = bootstrap.Modal.getInstance(document.getElementById("dataModal"));
            alert("Usuario modificado");

            dataModal.hide();
        })
        .catch(error => {
            alert("Ocurrió un error", error);
        });
}

// Eliminar un registro de usuario
function eliminarRegistro() {
    let id = document.querySelector("#inputDelete").value;
    if (!id) {
        alert("Por favor, ingresa un ID válido para eliminar.");
        return;
    }

    const url = `${usuarios}/${id}`;
    fetch(url, {
        method: "DELETE",
    })
    .then(response => {
        if (response.ok) return response.json();
        throw new Error("Por favor, ingresa un ID válido para eliminar.");
    })
    .then(() => alert("Usuario eliminado"))
    .catch(error => alert(`Ocurrió un error: ${error.message}`));
}
