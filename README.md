# OASYS

## Desarrollo local y ESP32 por USB

Inicia la aplicacion con `npm run dev` y abre exactamente `http://localhost:5173` en Chrome o Edge de escritorio. Chromium reconoce `localhost` como contexto seguro, por lo que Web Serial, Web USB y Web Bluetooth funcionan sin HTTPS y sin aceptar certificados autofirmados.

La primera conexion abre el selector de puertos del navegador: es una proteccion obligatoria de Web Serial que la aplicacion no puede omitir. Selecciona el puerto del ESP32 y concede el permiso. El navegador podra reutilizar los puertos ya autorizados mientras no borres los permisos del sitio.

No uses una URL con la IP de red, por ejemplo `http://192.168.x.x:5173`, para conectar el USB: no es un contexto seguro. Si necesitas abrir la app desde otro equipo, usa un dominio con un certificado HTTPS valido y de confianza, no uno autofirmado. El selector del puerto y el permiso del dispositivo USB siguen siendo obligatorios: el navegador no permite que una pagina elija un puerto automaticamente.

Si el ESP32 no aparece en el selector, comprueba en el Administrador de dispositivos de Windows que se muestre como puerto COM. Algunas placas requieren el controlador del puente USB que incorporan: normalmente CP210x o CH340/CH9102.

## React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
