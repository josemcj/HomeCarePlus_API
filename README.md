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
- <b>/api/usuario/:idUsuario/editar</b> (PATCH): Editar un usuario por su ID (sustituir <em>:idUsuario</em> por el ID correspondiente). Recibe los campos: nombre, telefono, calle, numero, cp, colonia, municipio, estado. <b>NOTA: No actualiza email, contraseña ni la profesión en caso de ser prestador de servicios.</b>

<h3>Servicios</h3>

- <b>/api/prestador/:idPrestador/registrar-servicio</b> (POST): Registrar un servicio usando el ID de un prestador de servicios (sustituir <em>:idPrestador</em> por el ID correspondiente). Recibe los campos: titulo, descripcion, precio.
- <b>/api/prestador/:idPrestador/servicios</b> (GET): Listar los servicios publicados por un determinado prestador de servicios, dado por su ID (sustituir <em>:idPrestador</em> por el ID correspondiente).
- <b>/api/servicios</b> (GET): Listar todos los servicios.
- <b>/api/servicio/:id</b> (GET): Consultar un servicio dado por su ID (sustituir <em>:id</em> por el ID correspondiente). Obtiene la información del servicio y del prestador de servicio que lo proporciona.
