<p align="center">
    <a href="https://mathjslab.com/" target="_blank" rel="noopener"><img src="images/mathjslab-logo.svg" alt="logo" width="200" height="200" /></a>
</p>

# [MathJSLab](https://mathjslab.com/) - [mathjslab.com](https://mathjslab.com/)

[![Netlify Status](https://api.netlify.com/api/v1/badges/b5d64f05-80e8-4cc6-b428-923447f43621/deploy-status)](https://app.netlify.com/sites/mathjslab/deploys)
[![CircleCI](https://dl.circleci.com/status-badge/img/gh/MathJSLab/mathjslab-demo/tree/main.svg?style=svg)](https://dl.circleci.com/status-badge/redirect/gh/MathJSLab/mathjslab-demo/tree/main)
[![Website](https://img.shields.io/website?url=https%3A%2F%2Fmathjslab.com%2F)](https://mathjslab.com/)
[![GitHub Created At](https://img.shields.io/github/created-at/MathJSLab/mathjslab-demo)](https://github.com/MathJSLab/mathjslab-demo)
[![MIT License](https://img.shields.io/badge/License-MIT-brightgreen.svg)](https://github.com/MathJSLab/mathjslab-demo/blob/main/LICENSE)
[![DOI](https://zenodo.org/badge/DOI/10.5281/zenodo.8396263.svg)](https://doi.org/10.5281/zenodo.8396263)
[![ISBN](https://img.shields.io/badge/ISBN-978--65--00--84828--1-green?style=flat&link=https://grp.isbn-international.org/search/piid_solr?keys=978-65-00-84828-1)](https://grp.isbn-international.org/search/piid_solr?keys=978-65-00-84828-1)
[![jsDelivr hits](https://img.shields.io/jsdelivr/gh/hy/MathJSLab/mathjslab-demo)](https://cdn.jsdelivr.net/gh/MathJSLab/mathjslab-demo/)

> An [interpreter](https://en.wikipedia.org/wiki/Interpreter_(computing)) with language syntax like [MATLAB&reg;](https://www.mathworks.com/)/[Octave](https://www.gnu.org/software/octave/) written in [Typescript](https://www.typescriptlang.org/).

**[ISBN 978-65-00-84828-1](https://grp.isbn-international.org/search/piid_solr?keys=978-65-00-84828-1)**

This is a demo application of [MathJSLab](https://www.npmjs.com/package/mathjslab) [npm package](https://en.wikipedia.org/wiki/Npm). See this demo on the project page at [mathjslab.com](https://mathjslab.com/). The repository is in the
[MathJSLab Organization](https://github.com/MathJSLab) on
[GitHub](https://github.com/).

Get a minified version from a [CDN](https://en.wikipedia.org/wiki/Content_delivery_network).
To embed [MathJSLab Demo](https://github.com/MathJSLab/mathjslab-demo) in a webpage using [jsDelivr CDN](https://cdn.jsdelivr.net/gh/MathJSLab/mathjslab-demo/)
copy the following [HTML](https://developer.mozilla.org/en-US/docs/Web/HTML) code:

```html
<head>
    ...
    <script defer src="https://cdn.jsdelivr.net/gh/MathJSLab/mathjslab-demo/mathjslab-demo.min.js"></script>
    ...
</head>

<body>
    ...
    <div id="mathjslab-examples"></div>
    ...
    <div id="mathjslab-prompt"></div>
    ...
</body>
```

For the examples and the `help` command to be available, it is necessary to
copy the `example` and `help` directories to the root of the web page.

Another option is to configure to use assets directly from
[repository](https://github.com/MathJSLab/mathjslab-demo) via
[jsDelivr CDN](https://www.jsdelivr.com/) too before load `mathjslab-demo.min.js`
script using:

```html
<head>
    ...
    <script>
        MathJSLabCalc = {
            exampleBaseUrl: "https://cdn.jsdelivr.net/gh/MathJSLab/mathjslab-demo/",
            helpBaseUrl: "https://cdn.jsdelivr.net/gh/MathJSLab/mathjslab-demo/",
        }
    </script>
    <script defer src="https://cdn.jsdelivr.net/gh/MathJSLab/mathjslab-demo/mathjslab-demo.min.js"></script>
    ...
</head>

<body>
    ...
    <div id="mathjslab-examples"></div>
    ...
    <div id="mathjslab-prompt"></div>
    ...
</body>
```

This demo also uses:

* [MathJax](https://www.mathjax.org/) for navigators without [MathML](https://www.w3.org/Math/) support.
* [Marked](https://www.npmjs.com/package/marked) to format [Markdown](https://www.markdownguide.org/) files as [HTML](https://developer.mozilla.org/en-US/docs/Web/HTML).
* [Plotly.js](https://plotly.com/javascript/) to generate plots, histograms and 3D graphics.
* [Mermaid](https://mermaid.js.org/) to generate charts and diagrams.

## Contributing

To contribute to this project see our
[contributing guidelines](https://github.com/MathJSLab/mathjslab-demo/blob/main/CONTRIBUTING.md).

Join the community chat:

[![Join the chat at https://matrix.to/#/#mathjslab:gitter.im](https://badges.gitter.im/Join%20Chat.svg)](https://matrix.to/#/#mathjslab:gitter.im?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

## Build scripts

The following build scripts are defined:

1. **Before building** `mathjslab-demo`, to **initialize** the project workspace, run:
```bash
npm run update
```
This will update the dependencies and install all of them, preparing any
resources needed to build the project.

2. **Format** and **lint** `mathjslab-demo` code:
```bash
npm run format:lint
```

3. Build `mathjslab-demo` in **development mode**:
```bash
npm run build:dev
```

4. Build `mathjslab-demo` in **debug mode**:
```bash
npm run build:debug
```

5. Build `mathjslab-demo` in **production mode**:
```bash
npm run build:prod
```

6. To **cleanup** all build files in workspace use:
```bash
npm run clean
```

7. To **delete dependencies**, the `package-lock.json` file and `node_modules`
directory too, use:
```bash
npm run clean:all
```
After run this command you will need to do workspace setup running
`npm run update` again.

## Community

Join the community chat:

[![Join the chat at https://matrix.to/#/#mathjslab:gitter.im](https://badges.gitter.im/Join%20Chat.svg)](https://matrix.to/#/#mathjslab:gitter.im?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

## License

>[MIT License](https://opensource.org/license/mit)
>
>Copyright &copy; 2016-2024 [Sergio Lindau](mailto:sergiolindau@gmail.com), [mathjslab.com](https://mathjslab.com/), [ISBN 978-65-00-84828-1](https://grp.isbn-international.org/search/piid_solr?keys=978-65-00-84828-1)
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
