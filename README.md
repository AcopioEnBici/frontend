# Instalación

- Instalar dependencias

`$ npm install`

`$ bower install`

# Compilar

`$ grunt`

- Se compilará a la carpeta "app"

# Servir

`$ grunt serve`

# Desarrollo

- Para desarrollar solo ve al folder "assets" y aplica tus cambios ahí (fijate en la estructura para ver donde van los scripts, el proyecto está hecho en AngularJS y angular-material)

# Importar nuevas librerias

- Primero instalarla con bower

`$ bower install --save <nombre de la libreria>`

- Agregarla las dependencias al compilador de grunt 
- abrir Gruntfile.js y agregar las dependencias de estilos y js en las secciones concat.required.files y cssmin.required.files

# Registro de cuentas de staff

- para registrarse hay que poner la url directamente "/admin/registro" y meter correo y password, por ahora solo administradores del proyecto en firebase pueden activar dichas cuentas
