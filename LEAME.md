# Calculadora MathJSLab

[![Estado Netlify](https://api.netlify.com/api/v1/badges/b5d64f05-80e8-4cc6-b428-923447f43621/deploy-status)](https://app.netlify.com/sites/mathjslab/deploys)
[![Licencia MIT](https://img.shields.io/badge/License-MIT-brightgreen.svg)](https://github.com/sergiolindau/mathjslab-calculator/blob/main/LICENSE)
[![CircleCI](https://dl.circleci.com/status-badge/img/gh/sergiolindau/mathjslab-calculator/tree/main.svg?style=svg)](https://dl.circleci.com/status-badge/redirect/gh/sergiolindau/mathjslab-calculator/tree/main)

> Un intérprete con sintaxis de lenguaje como [MATLAB&reg;](https://www.mathworks.com/)/[Octave](https://www.gnu.org/software/octave/) escrito en [Typescript](https://www.typescriptlang.org/).

Esta es una aplicación de demostración del [paquete npm](https://es.wikipedia.org/wiki/Npm) [MathJSLab](https://www.npmjs.com/package/mathjslab) .

Vea esta demostración alojada en [Netlify](https://mathjslab.netlify.app/).

Obtenga una versión minimizada de un [CDN](https://es.wikipedia.org/wiki/Red_de_distribuci%C3%B3n_de_contenidos).
Para insertar la calculadora [MathJSLab](https://www.npmjs.com/package/mathjslab) en una página web usando [CDN jsDelivr](https://www.jsdelivr.com/)
copie el siguiente código HTML:

```html
<head>
    ...
    <script defer src="https://cdn.jsdelivr.net/gh/sergiolindau/mathjslab-calculator/mathjslab-calculator.min.js"></script>
    ...
</head>

<body>
    ...
    <div id="mathjslab-calculator"></div>
    ...
</body>
```

Para que los ejemplos y el comando `help` estén disponibles, es necesario
copiar los directorios `example` y `help` a la raíz de la página web.

Otra opción es configurar para usar directamente desde
[repositorio](https://github.com/sergiolindau/mathjslab-calculator) vía
[CDN jsDelivr](https://www.jsdelivr.com/) también antes de cargar `mathjs-calculator.min.js` script usando:

```html
<head>
    ...
    <script>
        MathJSLabCalc = {
            exampleBaseUrl: "https://cdn.jsdelivr.net/gh/sergiolindau/mathjslab-calculator/",
            helpBaseUrl: "https://cdn.jsdelivr.net/gh/sergiolindau/mathjslab-calculator/",
        }
    </script>
    <script defer src="https://cdn.jsdelivr.net/gh/sergiolindau/mathjslab-calculator/mathjslab-calculator.min.js"></script>
    ...
</head>

<body>
    ...
    <div id="mathjslab-calculator"></div>
    ...
</body>
```

Esta demostración también utiliza:

* [MathJax](https://www.mathjax.org/), para navegadores sin soporte [MathML](https://www.w3.org/Math/).
* [Marked](https://www.npmjs.com/package/marked), para formatear archivos [Markdown](https://www.markdownguide.org/) como [HTML](https://developer.mozilla.org/es/docs/Web/HTML).
* [Chart.js](https://www.chartjs.org/), para generar gráficos e histogramas.

## Compilacion

Compile `mathjslab-calculator` en modo de desarrollo:

```bash
npm run build:dev
```

Compile `mathjslab-calculator` en modo de depuración:

```bash
npm run build:debug
```

Compile `mathjslab-calculator` en modo de producción:

```bash
npm run build:prod
```

## Comunidad

Únase al chat de la comunidad:

[![Únase al chat en https://matrix.to/#/#mathjslab:gitter.im](https://badges.gitter.im/Join%20Chat.svg)](https://matrix.to/#/#mathjslab:gitter.im?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

## Licencia

>MIT License
>
>Copyright &copy; 2016-2023 Sergio Lindau
>
>Permission is hereby granted, free of charge, to any person obtaining a copy
>of this software and associated documentation files (the "Software"), to deal
>in the Software without restriction, including without limitation the rights
>to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
>copies of the Software, and to permit persons to whom the Software is
>furnished to do so, subject to the following conditions:
>
>The above copyright notice and this permission notice shall be included in all
>copies or substantial portions of the Software.
>
>THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
>IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
>FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
>AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
>LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
>OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
>SOFTWARE.

