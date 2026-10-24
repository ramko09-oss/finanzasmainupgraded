# Instalación y ejecución local de SIDAA Finanzas

Esta guía permite ejecutar en el equipo la aplicación React y su API, usando la versión evaluada del proyecto. Los comandos se ejecutan desde la raíz del repositorio en PowerShell o una terminal equivalente.

## 1 Requisitos y versión evaluada

Se necesita Git, Node.js 22.12 o superior de la rama 22, o Node.js 24, con npm; conexión a Internet para instalar dependencias; y una base PostgreSQL de pruebas ya creada, accesible y con SSL. La base puede estar en la nube aunque la aplicación se ejecute localmente.

Repositorio: https://github.com/ramko09-oss/finanzasmainupgraded
Rama de origen: main

```text
Commit evaluado: f736e2eaf5acad9194d0135eb8b2261534ee3139
```

## 2 Descargar el proyecto

```text
git clone https://github.com/ramko09-oss/finanzasmainupgraded.git
cd finanzasmainupgraded
git checkout f736e2eaf5acad9194d0135eb8b2261534ee3139
```

El último comando fija la versión evaluada. Mantenga esta carpeta como directorio de trabajo para los siguientes pasos.

## 3 Configurar la conexión y la sesión

Cree un archivo llamado .env en la raíz, junto a package.json. Copie este contenido y sustituya los valores de ejemplo por los de su base de pruebas. Use el puerto indicado por su proveedor.

```text
PORT=3001
NODE_ENV=development
DB_TYPE=postgres
DB_HOST=HOST_POSTGRES
DB_PORT=5432
DB_USER=USUARIO_POSTGRES
DB_PASSWORD=CONTRASENA_POSTGRES
DB_NAME=BASE_PRUEBA
DB_SSL=true
JWT_SECRET=SECRETO_ALEATORIO_PROPIO
```

Para generar JWT_SECRET, ejecute el comando siguiente y copie su resultado como valor. Conserve .env solo en el equipo; no lo incluya en el informe ni en Git.

```text
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## 4 Instalar y preparar la aplicación

```text
npm run build
```

Este comando instala las dependencias del backend y del frontend, y genera la compilación de React. No hace falta instalar por separado cada carpeta.

Para preparar las tablas en una base de pruebas nueva, ejecute:

```text
node backend/init_postgres_db.js
```

El script crea o verifica las tablas usuarios y transacciones. No crea la base de datos: esta debe existir previamente. La versión evaluada del inicializador requiere una conexión PostgreSQL con SSL.

## 5 Iniciar y comprobar el funcionamiento

```text
npm start
```

Mantenga esa terminal abierta y visite http://localhost:3001. Express sirve la aplicación React y la API desde el mismo puerto.

Compruebe http://localhost:3001/api/health: debe devolver status con valor ok. Después cree una cuenta de prueba, registre un ingreso y un gasto, y vuelva a iniciar sesión para comprobar que los movimientos se recuperan. La respuesta de salud por sí sola no verifica la conexión a la base de datos.

Para detener el servidor, pulse Ctrl+C en la terminal.

## 6 Modo de desarrollo y comprobaciones opcionales

Para trabajar en la interfaz con actualización automática, mantenga el backend en ejecución y abra otra terminal en la raíz:

```text
npm run dev:react
```

Abra la dirección que indique Vite, normalmente http://localhost:5173. Las solicitudes de la API se envían al backend en el puerto 3001.

Para ejecutar las comprobaciones incluidas en el proyecto:

```text
npm test
npm --prefix sidan-frontend run lint
```

## Si aparece un error

Revise la versión de Node.js con node --version y confirme que .env esté en la raíz, sin extensión .txt. Si falla la conexión, revise host, puerto, usuario, contraseña, nombre de la base y acceso SSL. Si el puerto 3001 está ocupado, detenga la otra instancia antes de iniciar el servidor.

Estas instrucciones corresponden al commit indicado. La ejecución completa requiere proporcionar una base de pruebas y sus credenciales; el repositorio no las incluye.
