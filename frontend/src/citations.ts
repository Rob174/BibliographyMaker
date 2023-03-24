import * as Cite from "citation-js";
import type { Paper } from "./types";
export async function cite(paper: Paper): Promise<string> {
  // Make a promise to get the citation as a return value
  Cite.forceType = "@else/json";
  var options = { generateGraph: false };
  return new Promise((resolve, reject) => {
    Cite.async(JSON.stringify(paper.bibtex), options).then(function (result) {
      const text = result.format("biblatex", { type: "text"});
      resolve(text);
    });
  });
}
export async function getCitation(paper: Paper) {
  return await cite(paper);
}
export async function getCitationCitep(paper: Paper, citationStyle) {
  const text = await cite(paper);
  // Get first line that is in the format @article{...
  const firstLine = text.split("\n")[0];
  // Get the key
  const key = firstLine.split("{")[1].split(",")[0];
  return `\\${citationStyle}{${key}}`;
}
export async function getCitationAbr(paper: Paper) {
  const text = await cite(paper);
  // Get first line that is in the format @article{...
  const firstLine = text.split("\n")[0];
  // Get the key
  const key = firstLine.split("{")[1].split(",")[0];
  return key;
}
