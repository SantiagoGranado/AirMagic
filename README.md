# Proyecto de Gestión de Sistemas de Climatización

Este es un proyecto web de **gestión de sistemas de climatización en naves industriales**, creado con **React**, **Tailwind CSS**, **Supabase**, y otras tecnologías. El objetivo del proyecto es permitir a los usuarios gestionar y monitorear diferentes máquinas de climatización en tiempo real, con acceso personalizado según el rol de usuario (administrador o usuario común).

---

## Características

* **Autenticación y roles**:  
  - Los usuarios pueden registrarse e iniciar sesión con correo y contraseña.  
  - Se distinguen dos roles principales:  
    - **Administrador (admin)**: acceso completo para gestionar usuarios y máquinas.  
    - **Usuario común**: sólo puede ver y consultar sus máquinas asignadas.  
* **Gestión de máquinas**:  
  - Los administradores pueden crear, editar y eliminar máquinas (Eco/Ext).  
  - Los usuarios pueden ver el estado en tiempo real de las máquinas que les han sido asignadas.  
* **Interfaz responsive**:  
  - La interfaz está optimizada para dispositivos de escritorio y móviles mediante Tailwind CSS.  
  - Diseño “mobile-first” con componentes adaptativos y menús colapsables en pantallas pequeñas.  
* **Base de datos en tiempo real**:  
  - Utiliza **Supabase** para autenticación y base de datos PostgreSQL con **Row-Level Security (RLS)**.  
  - Las modificaciones de datos se reflejan automáticamente en la UI sin necesidad de recargar la página.  
* **Seguridad y buenas prácticas**:  
  - Sesiones con JWT emitidos por Supabase Auth.  
  - Políticas RLS que garantizan que cada usuario sólo accede a sus propios registros (o, en su caso, los administradores ven todo).  
  - Configuración de **CORS** para restringir orígenes permitidos y **Content Security Policy (CSP)** en producción.  
  - Prevención de XSS (React escapa por defecto y se utiliza `DOMPurify` para sanitizar HTML) y CSRF (token en header).  
* **Despliegue y CI/CD**:  
  - El frontend se despliega en Vercel (u otro proveedor similar) con variables de entorno configuradas en el panel de Vercel/Netlify.  
  - Se ha configurado un workflow de **GitHub Actions** que, al hacer push a `main`, ejecuta lint, tests (si existen) y build, y despliega automáticamente en producción.  
* **Plan de pruebas (básico)**:  
  - Se utilizan **Jest** y **React Testing Library** para pruebas unitarias de componentes clave y hooks personalizados.  
  - Se ha preparado un script de **Cypress** (o similar) para pruebas E2E mínimas: flujo de login, ver máquinas y simular alarma.  
* **Mejoras futuras** (dependientes de feedback en producción):  
  - Perfeccionar la conexión con las máquinas (gestión de reconexión, latencia, validación de datos).  
  - Optimizar la base de datos: índices compuestos, particionado de tablas de historial, ajustes de pool.  
  - Ampliar funcionalidades del Admin Panel (roles intermedios, acciones en lote, reportes básicos).  
  - Añadir notificaciones (email/SMS) automáticas ante alarmas críticas.  

---

## Tecnologías utilizadas

* **Frontend**  
  - [React](https://reactjs.org/)  
  - [Tailwind CSS](https://tailwindcss.com/)  
  - [React Router](https://reactrouter.com/)  
  - [React Query](https://tanstack.com/query/latest) (para data fetching y cache)  
  - [DOMPurify](https://github.com/cure53/DOMPurify) (sanitización de HTML)  
* **Backend y base de datos**  
  - [Supabase](https://supabase.com/) (Auth, PostgreSQL, Realtime)  
  - PostgreSQL con **Row-Level Security (RLS)**  
  - [bcryptjs](https://github.com/dcodeIO/bcrypt.js) (cifrado de contraseñas en entornos serverless)  
* **Despliegue y CI/CD**  
  - Vercel (o Netlify) para hosting de frontend  
  - GitHub Actions para automatizar lint, tests, build y despliegue  
* **Otras herramientas**  
  - ESLint + Prettier (formato y calidad de código)  
  - Cypress (pruebas end-to-end)  
  - Jest + React Testing Library (pruebas unitarias)  

---

## Instalación

### Prerrequisitos

1. **Node.js** y **npm**:  
   Verifica que estén instalados con:
   ```bash
   node -v
   npm -v
   ```
   Se recomienda usar Node.js ≥ 16.x y npm ≥ 8.x.

2. **Cuenta y proyecto en Supabase**:  
   - Crea un proyecto en Supabase.  
   - Obtén la **URL** del proyecto y la **API Key** (anon/public).  
   - Activa **Row-Level Security (RLS)** en las tablas principales y define las políticas necesarias (ver sección “Seguridad” abajo).  

---

### Pasos para instalar y ejecutar en desarrollo

1. **Clonar el repositorio**  
   ```bash
   git clone https://github.com/tu-usuario/tu-repositorio.git
   cd tu-repositorio
   ```

2. **Instalar dependencias**  
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**  
   - Renombra (o copia) el archivo de ejemplo `.env.example` a `.env.local`.  
   - Define las credenciales de Supabase y otros valores:
     ```
     REACT_APP_SUPABASE_URL=https://xyzabc.supabase.co
     REACT_APP_SUPABASE_ANON_KEY=pk.eyJ1IjoiZX…ejT
     ```
   - Asegúrate de que `.env.local` está en `.gitignore` y **no** se sube al repositorio.

4. **Iniciar en modo desarrollo**  
   ```bash
   npm start
   ```
   - Esto levantará la app en `http://localhost:3000`.  
   - Cualquier cambio en el código recargará automáticamente el navegador.

---

## Despliegue en Producción

1. **Configurar hosting (Vercel/Netlify)**  
   - Conecta tu repositorio (GitHub/GitLab).  
   - En la sección de **Variables de Entorno** de Vercel/Netlify, añade:  
     ```
     REACT_APP_SUPABASE_URL    = https://xyzabc.supabase.co
     REACT_APP_SUPABASE_ANON_KEY = pk.eyJ1IjoiZX…ejT
     ```
   - Establece la rama principal (`main`) como rama de despliegue.  
   - Configura el comando de build:  
     ```
     npm run build
     ```
   - Configura el directorio de salida:  
     ```
     build
     ```
   - Por defecto, Vercel/Netlify aplicará HTTPS y asignará un dominio generado (puedes personalizarlo a `app.airmagic.com` en la configuración de dominio).

2. **Workflow de GitHub Actions**  
   Si utilizas GitHub, coloca un archivo `.github/workflows/ci-cd.yml` con el siguiente contenido:
   ```yaml
   name: CI/CD

   on:
     push:
       branches: [ main ]
     pull_request:
       branches: [ main ]

   jobs:
     build-and-deploy:
       runs-on: ubuntu-latest

       steps:
         - name: Checkout code
           uses: actions/checkout@v3

         - name: Setup Node.js
           uses: actions/setup-node@v3
           with:
             node-version: '16'

         - name: Install dependencies
           run: npm install

         - name: Lint code
           run: npm run lint

         - name: Run tests
           run: npm run test   # (opcional, si existen tests)

         - name: Build production bundle
           run: npm run build

         - name: Deploy to Vercel
           uses: amondnet/vercel-action@v20
           with:
             vercel-token: ${{ secrets.VERCEL_TOKEN }}
             vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
             vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
             working-directory: ./
             alias-domains: app.airmagic.com
   ```
   - Asegúrate de configurar los secretos `VERCEL_TOKEN`, `VERCEL_ORG_ID` y `VERCEL_PROJECT_ID` en tu repositorio de GitHub.

---

## Funcionalidades

### Para usuarios comunes

* **Iniciar sesión / Registrarse**:  
  - Autenticación mediante Supabase Auth (correo + contraseña).  
  - Se validan credenciales y se almacena el JWT en el cliente (React Context).  
* **Ver máquinas**:  
  - El usuario ve el listado de máquinas (Eco/Ext) que le han sido asignadas.  
  - Cada máquina muestra datos en tiempo real (temperatura, humedad, estado).  
* **Ver perfil**:  
  - Sección donde el usuario puede actualizar su información personal (nombre, contraseña).  
* **Alertas en tiempo real**:  
  - Si la máquina genera una alarma (umbral de temperatura/humedad superado), se muestra en el Dashboard sin recargar.  

### Para administradores

* **Gestión de máquinas**:  
  - Crear, editar y eliminar máquinas desde el Admin Panel o la App Escritorio (según políticas de empresa).  
  - Asignar máquinas a usuarios específicos o a zonas de la instalación.  
* **Gestión de usuarios**:  
  - Consultar todos los usuarios registrados.  
  - Crear, editar y revocar permisos/roles (admin o usuario).  
  - Asignar usuarios a zonas concretas.  
* **Reportes básicos**:  
  - Gráfica de alarmas por día o por zona.  
  - Exportar listados de máquinas o usuarios en CSV.  
* **Configuración de zona y umbrales**:  
  - Definir umbrales personalizados de temperatura/humedad para cada zona (se guarda en la base de datos y se utiliza para generar alertas).  

---

## Estructura del proyecto

```bash
/src
  /components
    ├─ Navbar.jsx
    ├─ MachineCard.jsx
    ├─ ModalMachine.jsx
    ├─ LoadingSpinner.jsx
    └─ ... (otros componentes compartidos)
  /hooks
    ├─ useAuth.jsx
    ├─ useMachines.jsx
    ├─ useUsers.jsx
    └─ ... (hooks personalizados)
  /pages
    ├─ Dashboard.jsx
    ├─ AdminPanel.jsx
    ├─ Login.jsx
    ├─ Register.jsx
    └─ ErrorPage.jsx
  /services
    ├─ authService.js
    ├─ machineService.js
    ├─ userService.js
    └─ ... (servicios de datos)
  /supabase
    └─ supabase.js           # Inicializa cliente de Supabase
  App.jsx
  index.js
tailwind.config.js
package.json
.env.example
```

---

## Seguridad (resumen)

1. **Autenticación y tokens**  
   - Supabase Auth emite un **JWT** (`access_token`) y un **refresh_token**.  
   - El cliente React utiliza `supabase.auth.onAuthStateChange()` para gestionar cambios de sesión.  
   - Ante errores 401/403, se fuerza `signOut()` y redirección a login.

2. **Row-Level Security (RLS)**  
   - Todas las tablas críticas (Usuarios, Zonas, MaquinasEco, MaquinasExt, HistorialAlarmas, HistorialAvisos) tienen RLS habilitado.  
   - Se define una política `SELECT`, `INSERT`, `UPDATE`, `DELETE` para cada tabla, usando `auth.uid()` para comparar con `usuario_id`.  
   - Ejemplos:  
     ```sql
     -- Solo el usuario dueño (o admin) puede ver sus máquinas
     CREATE POLICY select_eco
       ON public.MaquinasEco
       FOR SELECT 
       TO authenticated
       USING (usuario_id = auth.uid() OR
              EXISTS(SELECT 1 FROM Usuarios WHERE id = auth.uid() AND es_admin = true));
     ```

3. **CORS y Content Security Policy (CSP)**  
   - En Supabase → Settings → API → **Allowed Origins**:  
     ```
     https://app.airmagic.com
     http://localhost:3000
     ```  
   - En producción (Vercel), se añade cabecera CSP (ejemplo):  
     ```
     Content-Security-Policy:
       default-src 'self';
       script-src 'self' https://cdn.jsdelivr.net;
       style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
       font-src https://fonts.gstatic.com;
       img-src 'self' data: https://xyzabc.supabase.co;
       connect-src 'self' https://xyzabc.supabase.co;
     ```

4. **Prevención de ataques comunes**  
   - **SQL Injection**: todas las consultas se realizan vía `supabase.from(...).select(...).eq(...)`, evitando concatenaciones manuales de strings.  
   - **XSS**: React escapa contenido por defecto y, para HTML dinámico, se usa `DOMPurify.sanitize(...)` antes de renderizar con `dangerouslySetInnerHTML`.  
   - **CSRF**: el JWT se envía en el header `Authorization: Bearer <token>`, sin usar cookies de sesión.  
   - **HTTPS obligatorio**: todo el tráfico (cliente ↔ Supabase) va sobre HTTPS.

---

## Pruebas

1. **Pruebas unitarias**  
   - **Jest** + **React Testing Library** para componentes y hooks críticos (por ejemplo, `useAuth`, `machineService.fetchByZone`).  
   - Comando para ejecutar tests:  
     ```bash
     npm run test
     ```

2. **Pruebas end-to-end (E2E)**  
   - **Cypress** (o herramienta equivalente) configurada para simular:  
     1. Registro de usuario → login → visualización de máquinas.  
     2. Login de administrador → gestión de usuarios → creación de máquina.  
   - Comando para ejecutar E2E (si está configurado):  
     ```bash
     npm run cy:open
     ```

---

## Despliegue (resumen)

1. **Hosting Frontend**  
   - Vercel (o Netlify): conecta el repositorio y establece la rama `main` para despliegue.  
   - Variables de entorno (en Vercel):  
     ```
     REACT_APP_SUPABASE_URL    = https://xyzabc.supabase.co
     REACT_APP_SUPABASE_ANON_KEY = pk.eyJ1IjoiZX…ejT
     ```
   - Comando de build:  
     ```bash
     npm run build
     ```
   - Directorio de salida:  
     ```bash
     build
     ```

2. **CI/CD con GitHub Actions**  
   - Archivo: `.github/workflows/ci-cd.yml` (se ejecuta lint, tests, build y despliega en Vercel).  
   - Secretos necesarios en GitHub:  
     - `VERCEL_TOKEN`  
     - `VERCEL_ORG_ID`  
     - `VERCEL_PROJECT_ID`

---

## Mejoras a futuro

> **Nota**: Al estar limitados por los requisitos y la infraestructura de AirMagic, la mayoría de las mejoras se implementarán tras el feedback en producción y las solicitudes directas de los clientes.

1. **Conexión con las máquinas**  
   - Implementar reconexión automática en la App de escritorio cuando una máquina pierda enlace (reintentos exponenciales).  
   - Añadir indicadores de “estado de enlace” (online/offline) en el Dashboard para avisar inmediatamente si alguna máquina deje de enviar datos.  
   - Validar en la App de escritorio que los datos recibidos (timestamp, valores de temperatura/humedad) cumplen rangos plausibles antes de insertar en la base de datos.

2. **Optimización de la base de datos**  
   - Revisión de índices: crear índices compuestos (`maquina_id`, `timestamp`) para acelerar consultas de datos recientes.  
   - Particionar tablas de alto crecimiento (por ejemplo, historial de alarmas/avisos) por rango de fecha para mantener tiempos de respuesta bajos.  
   - Ajuste de parámetros de conexión en Supabase/PostgreSQL (pool size, max_connections) según el número de máquinas y usuarios activos en tiempo real.  
   - Medición periódica en producción de latencias de consultas y ajustes iterativos basados en métricas reales.

3. **Nuevas funcionalidades del Admin Panel**  
   - **Roles intermedios**: crear y asignar roles como “técnico” o “supervisor” con permisos limitados a zonas específicas.  
   - **Acciones en lote (bulk actions)**: permitir activar/desactivar múltiples máquinas o reasignarlas por zona en una sola operación।  

   - **Reportes básicos**:  
     - Gráfica de alarmas diarias/semanales por zona।  
     - Exportación de listados (máquinas, usuarios) en CSV/Excel।  
   - **Configuración de umbrales**: formulario para definir umbrales de temperatura/humedad por zona, que se almacenen en la tabla `ConfiguracionUmbrales`.

---

## Licencia

Este proyecto es de **código privado** y **no acepta contribuciones externas**। La **licencia es propiedad exclusiva del autor** y se distribuye bajo los términos que se especifican en el archivo de licencia del proyecto।  
