import * as Cite from "citation-js";
import { Bibtex } from "../types";
export async function cite(bibtex: Bibtex): Promise<string> {
  // Make a promise to get the citation as a return value
  Cite.forceType = "@else/json";
  var options = { generateGraph: false };
  return new Promise((resolve, reject) => {
    Cite.async(JSON.stringify(bibtex), options).then(function (result) {
      const text = result.format("bibtex", { type: "text" });
      resolve(text);
    });
  });
}
export async function getCitationId(bibtex: Bibtex) {
  const citation = await cite(bibtex);

  // Get first line that is in the format @article{...
  const firstLine = citation.split("\n")[0];
  // Get the key
  const key = firstLine.split("{")[1].split(",")[0];
  return `${key}`;
}
