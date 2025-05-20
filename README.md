# Proyecto de Gestión de Sistemas de Climatización

Este es un proyecto web de **gestión de sistemas de climatización en naves industriales**, creado con **React**, **Tailwind CSS**, **Supabase**, y otras tecnologías. El objetivo del proyecto es permitir a los usuarios gestionar y monitorear diferentes máquinas de climatización en tiempo real, con acceso personalizado según el rol de usuario (administrador o usuario común).

## Características

* **Autenticación y roles**: Los usuarios pueden iniciar sesión, registrarse, y gestionar sus máquinas dependiendo de su rol (admin o usuario).
* **Gestión de máquinas**: Los administradores pueden registrar y gestionar máquinas, mientras que los usuarios pueden ver el estado y las características de las máquinas asignadas.
* **Interfaz responsive**: La interfaz está optimizada para dispositivos de escritorio y móviles.
* **Base de datos en tiempo real**: Utiliza **Supabase** para la base de datos, que se sincroniza en tiempo real con las acciones de los usuarios.

## Tecnologías utilizadas

* **Frontend**: React, Tailwind CSS
* **Backend**: Supabase (para autenticación y base de datos en tiempo real)
* **Otros**: bcryptjs (para cifrado de contraseñas)

## Instalación

### Prerrequisitos

1. Asegúrate de tener **Node.js** y **npm** instalados en tu máquina. Puedes verificar esto ejecutando los siguientes comandos:
node -v
npm -v

2. Necesitarás una cuenta de **Supabase** y un proyecto de base de datos configurado. Sigue esta guía de Supabase para configurar tu base de datos y obtener tu **URL de proyecto** y **API Key**.

### Pasos para instalar el proyecto

1. **Clonar el repositorio**:
git clone 
cd tu-repositorio

2. **Instalar dependencias**:
Una vez que hayas clonado el repositorio, instala las dependencias necesarias con:
npm install

3. **Configurar Supabase**:
Crea un archivo `.env` en la raíz de tu proyecto con tus credenciales de Supabase:

REACT_APP_SUPABASE_URL=tu-url-de-supabase
REACT_APP_SUPABASE_KEY=tu-api-key

4. **Iniciar el proyecto**:
Para ejecutar el proyecto en modo desarrollo, usa:

npm start

Esto abrirá la aplicación en http://localhost:3000.

## Funcionalidades

### Para usuarios:
* **Iniciar sesión**: Los usuarios pueden iniciar sesión con su correo y contraseña.
* **Ver máquinas**: Los usuarios pueden ver el estado de las máquinas en tiempo real.
* **Interacción básica**: Los usuarios pueden interactuar con las máquinas si tienen permisos.

### Para administradores:
* **Gestionar máquinas**: Los administradores pueden añadir, editar y eliminar máquinas.
* **Ver todos los usuarios**: Los administradores pueden ver todos los usuarios registrados y sus roles.
* **Acceso completo**: Los administradores tienen acceso completo a todas las funcionalidades de la aplicación.

## Estructura del proyecto

El proyecto está estructurado de la siguiente manera:

/src
/components
- Navbar.jsx
- MachineCard.jsx
- ModalMachine.jsx
/pages
- Dashboard.jsx
- AdminPanel.jsx
- Login.jsx
- Register.jsx
- ErrorPage.jsx
/supabase
- supabase.js
App.jsx
index.js
tailwind.config.js
package.json
.env

## Licencia

Este proyecto es de **código abierto**, pero **no acepta contribuciones externas**. La **licencia es propiedad exclusiva del autor**, y se distribuye bajo los términos que se especifican en el archivo de licencia del proyecto.