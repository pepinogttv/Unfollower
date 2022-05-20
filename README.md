# Unfollower

Unfollower es una aplicacion para instagram que busca facilitar la forma en que
interactuamos y visualizamos datos de nuestros seguidores y seguidos. La ventaja
de unfollower frente a otras aplicaciones de este estilo es que te permite accionar (dejar de seguir, boquear, etc)
en mas de un usuario a la vez y ademas en 100% gratis.

## Aclaraciones

- No se almacenan tus inicios de sesion ni tus claves. La aplicacion inicia sesion mediante el sitio oficial de Instagram y luego recibe los datos necesarios (cookies, etc) para hacer solicitudes y analizar tu cuenta
- Por el momento su uso no esta pensando para cuentas con mucha cantidad de seguidores/seguidos (+20.000);

## Run Locally

```bash
  git clone https://github.com/pepinogttv/unfollower.git
```

Go to the project directory

```bash
  cd unfollower
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  npm run serve
```

```bash
  npm run express-api
```

El proyecto esta subido en Vercel por lo que la API esta pensanda para funcionar con
las serverless funcitons de vercel, para facilitar el uso en local utilice express
para crear los endpoints, de lo contrario se verian obligados a crearse una cuenta en vercel
probar en local.
IMPORTANTE: Es necesario ejecutar "npm run serve" y "npm run express-api" en paralelo
ya que el primer comando se encarga de servir el cliente y el segundo de servir los endpoints.

## Demo

https://unfollower.vercel.app/

![image](https://im3.ezgif.com/tmp/ezgif-3-ef81cbab32.gif)
_gif de muestra_

## Features

- Multiples acciones disponibles: Seguir, Bloquear, Desbloquear, Dejar de seguir, Eliminar seguidor.
- Accionar en mas de un usuario a la vez.
- Descargar fotos de perfil.
- Visualizar seguidores perdidos y ganados.

## Tech Stack

**Client:** Vue 2, Vuex, Vuetify, IndexedDB, localStorage.

**Server:** Vercel, Vercel Serverless Functions, instagram-private-api.
