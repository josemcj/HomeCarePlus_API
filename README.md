# Home Care Plus con MongoDB
API REST con Express y MongoDB.

<h2>Lista de URLs para consumir</h2>

URL local: http://localhost:3000</br>
URL Vercel: https://homecareplus.vercel.app

<h3>Usuarios</h3>

- <b>/api/registrar-usuario</b> (POST): Registrar un usuario. Funciona tanto para clientes como para prestadores de servicios.
- <b>/api/login</b> (POST): Iniciar sesión. Funciona tanto para clientes como para prestadores de servicios.
- <b>/api/usuarios</b> (GET): Listar todos los usuarios (prestadores y clientes).
- <b>/api/usuario/:idUsuario</b> (GET): Obtener un usuario por su ID (sustituir <em>:idUsuario</em> por el ID correspondiente).
- <b>/api/usuario/:idUsuario/editar</b> (PATCH): Editar un usuario por su ID (sustituir <em>:idUsuario</em> por el ID correspondiente). Recibe los campos: nombre, telefono, sexo, imagen (en base64), calle, numero, cp, colonia, municipio, estado y en caso de ser prestador de servicios, el campo profesion. <b>NOTA: No actualiza email ni contraseña.</b>
- <b>/api/usuario/:idUsuario/eliminar</b> (DELETE): Eliminar un suario por su ID (sustituir <em>:idUsuario</em> por el ID correspondiente).

<h3>Servicios</h3>

- <b>/api/prestador/:idPrestador/registrar-servicio</b> (POST): Registrar un servicio usando el ID de un prestador de servicios (sustituir <em>:idPrestador</em> por el ID correspondiente). Recibe los campos: titulo, descripcion, imagen (en base64), precio.
- <b>/api/prestador/:idPrestador/servicios</b> (GET): Listar los servicios publicados por un determinado prestador de servicios, dado por su ID (sustituir <em>:idPrestador</em> por el ID correspondiente).
- <b>/api/servicios</b> (GET): Listar todos los servicios.
- <b>/api/servicio/:id</b> (GET): Consultar un servicio dado por su ID (sustituir <em>:id</em> por el ID correspondiente). Obtiene la información del servicio y del prestador de servicio que lo proporciona.
- <b>/api/servicio/:idServicio/editar</b> (PATCH): Editar un servicio dado por su ID (sustituir <em>:idServicio</em> por el ID correspondiente). Recibe los campos: titulo, descripcion, imagen (en base64), precio.
- <b>/api/prestador/:idPrestador/servicio/:idServicio/eliminar</b> (DELETE): Elimina un servicio dado por su ID (sustituir <em>:idPrestador</em> y <em>:idServicio</em> por el ID correspondiente al servicio y el prestador del mismo).

<h3>Pedidos (servicios contratados/prestados)</h3>

- <b>/api/cliente/:idCliente/solicitar/:idServicio</b> (POST): Solicitar un servicio. Recibe por la URL el ID del cliente (:idCliente) y el ID del servicio a contratar (:idServicio). Por <em>body</em> recibe solo la fecha y hora (string) en que se realizará el servicio, con formato **_YYYY/MM/DD HH:MM:SS_**. El nombre de dicho parámetro es **_fechaServicio_**.
- <b>/api/pedido/:idPedido</b> (GET): Muestra la información completa de un pedido. Funciona tanto para clientes como para prestadores de servicios. **_La información estará en una Activity_**.
- <b>/api/cliente/:idCliente/pedidos</b> (GET): Lista todos los servicios contratados de un cliente dado por su ID (:idCliente). **_Esta información se mostrará en un Recycler View_**.
- <b>/api/prestador/:idPrestador/pedidos</b> (GET): Lista todos los servicios prestador de un prestador de servicios dado por su ID (:idPrestador). **_Esta información se mostrará en un Recycler View_**.
- <b>/api/pedido/:idPedido/editar</b> (PATCH): Actualiza el <b>**_estado_**</b> de un servicio. Estados disponibles: 'cancelado', 'rechazado', 'en_proceso', 'finalizado'. Por <em>body</em> recibe el parámetro **_estado_**.
- <b>/api/pedido/:idPedido/editar/fecha</b> (PATCH): Actualiza la fecha en que se dará un servicio, dado por su ID (:idPedido). Por <em>body</em> recibe el parámetro **_fechaServicio_**, con la fecha y hora (string) en que se realizará el servicio, con formato **_YYYY/MM/DD HH:MM:SS_**.
- <b>/api/pedidos</b> (GET): Obtiene todos los pedidos.**_Solo para proceso de desarrollo_**.

#### Información sobre los estados de los pedidos
- Solicitado: El cliente ha solicitado el servicio (default).
- Cancelado: Servicio cancelado por el cliente.
- Rechazado: Rechazado por el prestador de servicios.
- En proceso: El servicio esta siendo proporcionado en este momento.
- Finalizado: El servicio ha sido completado.