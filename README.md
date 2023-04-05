# Home Care Plus con MongoDB
API REST con Express y MongoDB.

## Configuración inicial del proyecto

Para probar el proyecto local debes instalar Node.js y MongoDB. A continuación, debes seguir los siguientes pasos:

1. Clona el repositorio.
2. Accede a la carpeta **config** y crea un archivo llamado `config.env`. Edita el archivo y coloca lo siguiente:
```
PORT = 3000
MONGO_URI = mongodb://127.0.0.1:27017/homecare
STRIPE_SK = <SECRET_KEY>
STRIPE_PK = <PUBLISHABLE_KEY>
```
3. Guarda el archivo.
4. Situate en la carpeta raíz del proyecto y abre la terminal. Ejecuta el comando `npm i`.
5. Finalmente, para iniciar el servidor web ejecuta el comando `npm run start`.

## Lista de URLs para consumir

URL local: http://localhost:3000</br>
URL Vercel: https://homecareplus.vercel.app

### Usuarios

- `/api/registrar-usuario` (POST): Registrar un usuario. Funciona tanto para clientes como para prestadores de servicios. Por **body** recibe los campos:
    - `nombre`
    - `telefono`
    - `sexo`: Femenino: 1, Masculino: 2
    - `tipoUsuario`: Cliente: 1, Prestador: 2
    - `imagen` (en base64)
    - `calle`
    - `numero`
    - `cp`
    - `colonia`
    - `municipio`
    - `estado`

Y en caso de ser prestador de servicios, el campo `profesion`.
- `/api/login` (POST): Iniciar sesión. Funciona tanto para clientes como para prestadores de servicios.
- `/api/usuarios` (GET): Listar todos los usuarios (prestadores y clientes).
- `/api/usuario/:idUsuario` (GET): Obtener un usuario por su ID (sustituir **:idUsuario** por el ID correspondiente).
- `/api/usuario/:idUsuario/editar` (PATCH): Editar un usuario por su ID (sustituir **:idUsuario** por el ID correspondiente). Recibe los campos:
    - `nombre`
    - `telefono`
    - `sexo`: Femenino: 1, Masculino: 2
    - `imagen` (en base64)
    - `calle`
    - `numero`
    - `cp`
    - `colonia`
    - `municipio`
    - `estado`

Y en caso de ser prestador de servicios, el campo `profesion`. **NOTA: No actualiza email ni contraseña.**
- `/api/usuario/:idUsuario/eliminar` (DELETE): Eliminar un suario por su ID (sustituir **:idUsuario** por el ID correspondiente).

### Servicios

- `/api/prestador/:idPrestador/registrar-servicio` (POST): Registrar un servicio usando el ID de un prestador de servicios (sustituir **:idPrestador** por el ID correspondiente). Recibe los campos:
    - `titulo`
    - `descripcion`
    - `categoria`: Recibe en string alguno de los siguientes valores:
        - `Niños`: Servicios para niños.
        - `Adultos`: Servicios para adultos mayores.
        - `General`: Servicios para el público en general.
    - `imagen` (en base64)
    - `precio`
- `/api/prestador/:idPrestador/servicios` (GET): Listar los servicios publicados por un determinado prestador de servicios, dado por su ID (sustituir **:idPrestador** por el ID correspondiente).
- `/api/servicios` (GET): Listar todos los servicios.
- `/api/servicio/:id` (GET): Consultar un servicio dado por su ID (sustituir **:id** por el ID correspondiente). Obtiene la información del servicio y del prestador de servicio que lo proporciona.
- `/api/servicio/:idServicio/editar` (PATCH): Editar un servicio dado por su ID (sustituir **:idServicio** por el ID correspondiente). Recibe los campos: 
    - `titulo`
    - `descripcion`
    - `categoria`Recibe en string alguno de los siguientes valores:
        - `Niños`: Servicios para niños.
        - `Adultos`: Servicios para adultos mayores.
        - `General`: Servicios para el público en general.
    - `imagen` (en base64)
    - `precio`
- `/api/prestador/:idPrestador/servicio/:idServicio/eliminar` (DELETE): Elimina un servicio dado por su ID (sustituir **:idPrestador** y **:idServicio** por el ID correspondiente al servicio y el prestador del mismo).

### Pedidos (servicios contratados/prestados)

- `/api/cliente/:idCliente/pagar/:idServicio` (POST): Pagar un servicio. Recibe por la URL el ID del cliente (:idCliente) que contratará el servicio y el ID de este (:idServicio). **No recibe parámetros por body**.
- `/api/cliente/:idCliente/solicitar/:idServicio` (POST): Solicitar un servicio. Recibe por la URL el ID del cliente (:idCliente) y el ID del servicio a contratar (:idServicio). Por **body** recibe solo la fecha y hora (string) en que se realizará el servicio, con formato `YYYY/MM/DD HH:MM:SS`. El nombre de dicho parámetro es `fechaServicio`.
- `/api/pedido/:idPedido` (GET): Muestra la información completa de un pedido. Funciona tanto para clientes como para prestadores de servicios. **_La información estará en una Activity_**.
- `/api/cliente/:idCliente/pedidos` (GET): Lista todos los servicios contratados de un cliente dado por su ID (**:idCliente**). **_Esta información se mostrará en un Recycler View_**.
- `/api/prestador/:idPrestador/pedidos` (GET): Lista todos los servicios prestador de un prestador de servicios dado por su ID (**:idPrestador**). **_Esta información se mostrará en un Recycler View_**.
- `/api/pedido/:idPedido/editar` (PATCH): Actualiza el ****_estado_**** de un servicio. Recibe por **body** el parámetro `estado`, con alguno de los siguientes valores (en string):
    - `cancelado`
    - `rechazado`
    - `en_proceso`
    - `finalizado`
- `/api/pedido/:idPedido/editar/fecha` (PATCH): Actualiza la fecha en que se proporcionará un servicio, dado por su ID (**:idPedido**). Por **body** recibe el parámetro `fechaServicio`, con la fecha y hora (string) en que se realizará el servicio, con formato `YYYY/MM/DD HH:MM:SS`.
- `/api/pedidos` (GET): Obtiene todos los pedidos. **_Solo para proceso de desarrollo_**.

#### Información sobre los estados de los pedidos
- Solicitado: El cliente ha solicitado el servicio (default).
- Cancelado: Servicio cancelado por el cliente.
- Rechazado: Rechazado por el prestador de servicios.
- En proceso: El servicio esta siendo proporcionado en este momento.
- Finalizado: El servicio ha sido completado.

### Asignar calificación del prestador

- `/api/cliente/:idCliente/calificar/:idPrestador` (PATCH): A través de la URL recibe el ID del cliente (**:idCliente**) y el ID del prestador a calificar (**:idPrestador**). Recibe a través del **body** los parámetros:
    - `calificacion`: Un número entero del 1 al 5.
    - `comentario` (opcional): Una cadena de texto con el comentario dirigido al prestador.

- `/api/prestador/:idPrestador` (GET): Ver las reviews de un prestador de servicios, así como su información más general.

### Buscar servicios
- `/api/buscar` (GET): Buscar servicios dados por su categoría. Se le envía el parámetro `cat`, con alguno de los siguientes valores (string):
    - `Niños`
    - `Adultos`
    - `General`

### Validar prestadores de servicios

- `/api/prestador/:idPrestador/validar` (PATCH): Cambia el campo 'validado' de false (valor por defecto al registrar un usuario prestador) a true. No recibe ningún parámetro.