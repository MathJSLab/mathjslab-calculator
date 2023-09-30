[![Netlify Status](https://api.netlify.com/api/v1/badges/b5d64f05-80e8-4cc6-b428-923447f43621/deploy-status)](https://app.netlify.com/sites/mathjslab/deploys)

# MathJSLab

> An interpreter with language syntax like MATLAB&reg;/Octave written in [Typescript](https://www.typescriptlang.org/).

This is a demo of [MathJSLab npm package](https://www.npmjs.com/package/mathjslab).

See this demo powered by [Netlify](https://mathjslab.netlify.app/).

Get a minified version from a [CDN](https://en.wikipedia.org/wiki/Content_delivery_network).
To embed MathJSLab calculator in a webpage using [jsDelivr CDN](https://www.jsdelivr.com/)
copy the following HTML code:

```html
<head>
    ...
    <script defer="defer" src='https://cdn.jsdelivr.net/gh/sergiolindau/mathjslab-calculator/mathjslab-calc.min.js'></script>
    ...
</head>

<body>
    ...
    <div id="mathjslab-calc"></div>
    ...
</body>
```

For the examples and the `help` command to be available, it is necessary to
copy the `example` and `help` directories to the root of the web page.

This demo also uses:

* [MathJax](https://www.mathjax.org/), for browsers without [MathML](https://www.w3.org/Math/) support.
* [Marked](https://www.npmjs.com/package/marked), to display Markdown files.
* [Chart.js](https://www.chartjs.org/), to generate plots and histograms.

# License

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
