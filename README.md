# Anderson — perfil Monochrome 3D

Sitio estático de una sola página basado en la propuesta Monochrome 3D. Es un proyecto independiente; no modifica ni reemplaza el perfil que ya existe en el workspace.

## Requisitos

- Node.js 20.19 o superior
- npm

## Desarrollo local

```bash
npm install
npm run dev
```

## Comprobación y compilación

```bash
npm run typecheck
npm run build
npm run preview
```

La salida de producción queda en `dist/`. No necesita base de datos, servidor API, credenciales ni variables de entorno.

## Subir a GitHub

1. Descomprime el paquete.
2. Crea un repositorio vacío en GitHub y sube el contenido de esta carpeta.
3. Mantén `package.json` y `vercel.json` en la raíz del repositorio.

## Publicar en Vercel

1. Importa el repositorio desde Vercel.
2. Selecciona **Vite** como framework. Si el repositorio contiene este proyecto dentro de una subcarpeta, indica esa carpeta como **Root Directory**.
3. Usa `npm run build` como comando de compilación y `dist` como directorio de salida.

La configuración de `vercel.json` ya declara el comando y el directorio de salida.

## Recursos

- El arte geométrico y los fondos están hechos con CSS; no hay imágenes rasterizadas externas.
- Los iconos usan Lucide.
- Las tipografías Space Grotesk e IBM Plex Mono se cargan desde Google Fonts en `_group.css`; se usan fuentes de respaldo si no hay conexión.
- No se agregó un logotipo ni favicon.