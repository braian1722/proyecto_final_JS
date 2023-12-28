const rutaArchivoJSON = './assets/json/productos.json';
const listaCarrito = document.getElementById('lista-carrito');
const totalCarrito = document.getElementById('total');
const cardsContainer = document.getElementById('contenedor-productos');
let carrito = obtenerCarritoDesdeLocalStorage();
let productos = [];  

document.addEventListener('DOMContentLoaded', () => {
    cargarProductosDesdeJSON();// para que se ejecute la carga del json sin la nesesidad de esperar la carga del index
});


async function cargarProductosDesdeJSON() {
    try {
        const response = await fetch(rutaArchivoJSON);
        if (!response.ok) {
            throw new Error(`No se pudo cargar el archivo JSON. Código de estado: ${response.status}`);
        }
        const data = await response.json();
        productos = data;
        mostrarProductosEnPagina(productos);
    } catch (error) {
        console.error('Error al cargar el archivo JSON:', error);
    }
}


function mostrarProductosEnPagina(productos) {
    const cards = productos.map(producto => {
        const card = document.createElement('div');
        card.className = "producto";
        card.innerHTML = `
            <h3>${producto.nombre}</h3>
            <img src="${producto.imagen}" alt="${producto.nombre}">
            <p>Precio: $${producto.precio}</p>
            <button class="btn btn-primary" onclick="agregarAlCarrito('${producto.nombre}', ${producto.precio})">Agregar al Carrito</button>
        `;
        return card;
    });
    cards.forEach(card => {
        cardsContainer.appendChild(card);
    });
}


function agregarAlCarrito(nombre, precio) {
	carrito.push({ nombre, precio});
	actualizarListaCarrito();
    mostrarModal();
    guardarCarritoLocalStorage();
}

function guardarCarritoLocalStorage() {
    try {
        localStorage.setItem("carrito", JSON.stringify(carrito));
        console.log("Carrito guardado en localStorage:", carrito);
    } catch (error) {
        console.error("Error al guardar en localStorage:", error);
    }
}

function obtenerCarritoDesdeLocalStorage() {
    try {
        const carritoStorage = localStorage.getItem("carrito");
        return carritoStorage ? JSON.parse(carritoStorage) : [];
    } catch (error) {
        console.error("Error al obtener el carrito desde localStorage:", error.message || error);
        return [];
    }
}

function limpiarCarrito() {
    carrito.length = 0;
    actualizarListaCarrito();
    calcularTotal();
    guardarCarritoLocalStorage();
    localStorage.clear();
}

function mostrarModal() {
    const modalElement = document.getElementById('carritoModal');
    const modal = new bootstrap.Modal(modalElement);
    modal.show();

}

function actualizarListaCarrito() {
    const listaCarrito = document.getElementById('listaCarrito');
    listaCarrito.innerHTML = ''; 
    carrito.map((producto, index) => {
        const item = document.createElement('li');
        item.classList.add('list-group-item');
        item.innerHTML = `
        ${producto.nombre} - Valor: ${producto.precio}
        <span class="fas fa-trash-alt float-right" style="cursor: pointer;" onclick="eliminarDelCarrito(${index})"></span>
        `;
        listaCarrito.appendChild(item);
});
    calcularTotal();

}

function eliminarDelCarrito(index) {
    carrito.splice(index, 1); 
    actualizarListaCarrito(); 
    guardarCarritoLocalStorage();
}
function calcularTotal() {
    const total = carrito.reduce((acc, producto) => acc + producto.precio, 0);
    totalCarrito.textContent = `Total: $ ${total}`;
}



document.getElementById("Finalizar").addEventListener("click", function () {
    limpiarCarrito();
    setTimeout(()=>{
        if (limpiarCarrito){
            Swal.fire({
                position: "top",
                icon: "success",
                title: "Compra finalizada con exito",
                showConfirmButton: false,
                timer: 1500
            });
        }else{
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Lo sentimos algo salio mal!",
                
            });
        }
    },1000);
});




function filtrarProductos() {
    return new Promise((resolve, reject) => {
        try {
            const textoBusqueda = document.getElementById("buscador").value.toLowerCase();
            const productosFiltrados = productos.filter(producto => producto.nombre.toLowerCase().includes(textoBusqueda));
            setTimeout(() => {
                if (productosFiltrados.length > 0) {
                    resolve(productosFiltrados);
                } else {
                    reject("No se encontraron productos");
                }
            },500);
        } catch (error) {
            reject(error);
        }
    });
} 


function mostrarProductosFiltrados(productosFiltrados) {
    
    cardsContainer.innerHTML = "";
    productosFiltrados.forEach(producto => {
        const divProducto = document.createElement("div");
        divProducto.innerHTML = `
            <div class="producto">
                <h4>${producto.nombre}</h4>
                <img src="${producto.imagen}" alt="Imagen de ${producto.nombre}">
                <p>Precio: ${producto.precio}</p>
                <button class="btn btn-primary" onclick="agregarAlCarrito('${producto.nombre}', ${producto.precio})">Agregar al Carrito</button>
            </div>
        `;
        cardsContainer.appendChild(divProducto);
    });
}



document.getElementById("buscador").addEventListener("input", function () {
    filtrarProductos()
        .then(productosFiltrados => {
            mostrarProductosFiltrados(productosFiltrados);
        })
        .catch(error => {
            console.error("Error en la búsqueda:", error);
        })
        .finally(() => {
            console.log("Búsqueda finalizada");
        })
});



    
/// VALIDACION DE FORMULARIO

const e = (event) => {
    event.preventDefault(); // Evitar el envío del formulario para probar la validación
    validarFormulario();
}

const validarFormulario= () =>{
    const password = document.getElementById("password").value;
    const nombre = document.getElementById("nombre").value;
    const nombreValido = validaNombre(nombre);
    const passwordValido = validarPassword(password);

    const mensaje = (nombreValido && passwordValido) ? "el formulario ha sido enviado" : "el formulario no fue enviado";
    console.log(mensaje);
}

const validaNombre = (nombre) =>{
    const caracteresEspeciales = /[!@#$%^&*(),.?":{}|<>]/.test(nombre);//test compara el las cadenas y si no hay una coincidencia nos devuelve falce en caso de haberla nos devuelve true
    if(caracteresEspeciales == true){
        console.log("El nombre no puede contener caracteres especiales");
        return false;
    }else{
        if (nombre != "" ) {
            console.log("nombre ingresado corectamente");
            return true;
        }
        else{
            console.log("error en ingreso")
            return false;
    }
}
}
const validarPassword = password => {
    
    // Validación del password: al menos una letra mayúscula y un número el cual si no igreso una mayuscula y un numero las dos constantes son falsa
    const contieneMayuscula = /[A-Z]/.test(password);
    const contieneNumero = /\d/.test(password);
    if (contieneMayuscula == true && contieneNumero == true ) {
        console.log("password ingresado corectamente");
        return true;
        
    }else{
        console.log("password ingresado incorectamente");
        return false;
        
    }
}
document.getElementById('formulario').addEventListener('submit',e );
