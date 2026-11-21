# Planificador de torneo de ajedrez

Herramienta construida con **Node.js, HTML, CSS y JavaScript** para planificar un torneo de ajedrez. Permite estimar el espacio, comparar reconocimientos y consultar el presupuesto, los ingresos y el resultado económico.

## 1. Requisitos

- Windows, macOS o Linux.
- Visual Studio Code.
- Node.js instalado.

No se necesitan paquetes externos ni ejecutar `npm install`.

## 2. Abrir el proyecto en Visual Studio Code

1. Descarga y descomprime la carpeta `torneo-ajedrez-node`.
2. Abre Visual Studio Code.
3. Selecciona **Archivo > Abrir carpeta**.
4. Busca y selecciona la carpeta `torneo-ajedrez-node`.
5. Abre una terminal desde **Terminal > Nueva terminal**.

## 3. Comprobar Node.js

En la terminal escribe:

```bash
node -v
```

También puedes comprobar npm:

```bash
npm -v
```

Si Windows indica que `node` no se reconoce, instala la versión LTS de Node.js desde https://nodejs.org/ y vuelve a abrir Visual Studio Code.

## 4. Ejecutar la aplicación

En la terminal de Visual Studio Code escribe:

```bash
node server.js
```

También puedes usar:

```bash
npm start
```

Cuando aparezca el mensaje del servidor, abre el navegador y visita:

http://localhost:3000

Para detener el servidor, vuelve a la terminal y presiona `Ctrl + C`.

## 5. Estructura de carpetas

```text
torneo-ajedrez-node/
│
├── public/
│   ├── index.html
│   ├── styles.css
│   └── app.js
│
├── package.json
├── server.js
└── README.md
```

### ¿Qué hace cada archivo?

- `server.js`: crea el servidor local con Node.js y entrega los archivos de la página.
- `package.json`: contiene los datos del proyecto y el comando `npm start`.
- `public/index.html`: estructura y contenido de la interfaz.
- `public/styles.css`: colores, tamaños y distribución visual.
- `public/app.js`: valida los datos y realiza los cálculos del torneo.

## 6. Fórmulas utilizadas

### Área

Una mesa para dos participantes:

`mesas = techo(participantes / 2)`

`área = mesas × área por mesa + área adicional`

### Costos

`costos fijos = alquiler + árbitro + adecuación`

`costo variable por jugador = refrigerio + material impreso`

`costo total = costos fijos + reconocimientos + (costo variable por jugador × participantes)`

Con los valores iniciales y la alternativa C:

`C(x) = 418.000 + 10.000x`

### Ingresos y excedente

`ingresos = inscripción × participantes`

`excedente = ingresos − costo total`

## 7. Valores iniciales del ejercicio

- 32 participantes.
- Inscripción: $40.000 COP.
- 16 mesas.
- 4 m² por mesa.
- 24 m² adicionales.
- Alquiler: $150.000 COP.
- Árbitro: $120.000 COP.
- Adecuación: $50.000 COP.
- Refrigerio: $8.000 COP por jugador.
- Material impreso: $2.000 COP por jugador.
- Medallas: $90.000 COP.
- Certificados digitales: $8.000 COP.

Resultado inicial esperado:

- Área: 88 m².
- Costo total: $738.000 COP.
- Ingresos: $1.280.000 COP.
- Excedente: $542.000 COP.

Los valores iniciales son estimaciones de referencia. Puedes modificarlos según las condiciones reales del torneo.

## 8. Nota técnica

Esta primera versión realiza los cálculos en el navegador mediante JavaScript. Node.js se utiliza para ejecutar el servidor local que entrega la aplicación. Todavía no se utiliza una base de datos ni se guardan inscripciones. La gráfica compara los ingresos y los costos y se actualiza automáticamente al cambiar los datos.
