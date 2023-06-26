
import { parse, HtmlGenerator } from "latex.js";
export function renderLaTeX(latex,style="") {
    let generator = new HtmlGenerator({ hyphenate: false });
    let doc = parse(latex, { generator: generator }).htmlDocument();
    console.log(doc.documentElement.outerHTML)
    return `
      <html>
        <head>
          <link rel="stylesheet" href="css/katex.css" type="text/css" />
          <link rel="stylesheet" href="css/article.css" type="text/css"/>
          <style>font-size: 10em;</style>
        </head>
        <body>
          ${doc.documentElement.outerHTML}
        </body>
      </html>
    `;
  }