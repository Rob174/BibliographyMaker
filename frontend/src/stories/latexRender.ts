
import { parse, HtmlGenerator } from "latex.js";
export function renderLaTeX(latex) {
    let generator = new HtmlGenerator({ hyphenate: false });
    let doc = parse(latex, { generator: generator }).htmlDocument();
    return `
      <html>
        <head>
          <link rel="stylesheet" href="https://latex.js.org/css/katex.css" type="text/css" />
          <link rel="stylesheet" href="https://latex.js.org/css/article.css" type="text/css"/>
          <style>body{background-color: white; color: black;}</style>
        </head>
        <body>
          ${doc.documentElement.outerHTML}
        </body>
      </html>
    `;
  }