import { getBibtex } from "./utils";
import { writePaper } from "../model";
import { v4 as uuidv4 } from "uuid";
import type { Bibtex, PaperJSON } from "../types";
/**
 *
 * @param {*} req body contains doi, relevant_text, tags. Url will be inferred from doi
 * @param {*} res
 */
export const postPaperWithDOI = async (req, res) => {
  console.log("postPaper incoming");
  const { doi, relevant_text, tags, analysis } = req.body;
  if (!doi || !relevant_text || !tags) {
    console.log("Missing parameters");
    res.status(400).send({ result: "Missing parameters" });
    return;
  }
  const bibtex = await getBibtex(doi);
  if (!bibtex) {
    console.log("Error: bibtex is null");
    res.status(400).send({ result: "Error: bibtex is null" });
    return;
  }
  const paper = {
    id: doi,
    bibtex: bibtex,
    doi: doi,
    relevant_text: relevant_text,
    tags: tags,
    analysis: analysis || "",
  };
  const success = writePaper(paper);
  if (!success) {
    console.log("Error: paper already exists");
    res.status(400).send({ result: "Error: paper already exists" });
    return;
  }
  res.status(200).send({ result: "Added" });
};

export const postPaperWithoutDOI = async (req, res) => {
  console.log("postPaperWithoutDOI incoming");
  const { title, authors, year, url, relevant_text, tags, analysis } = req.body;
  if (!title || !authors || !year || !url || !relevant_text || !tags) {
    console.log("Missing parameters");
    res.status(400).send({ result: "Missing parameters" });
    return;
  }
  // Build the bibtext
  const bibtex: Bibtex = {
    DOI: "",
    title: [title],
    author: authors.map((author) => {
      const [family, given] = author.split(" ");
      return { family, given };
    }),
    URL: url,
    issued: { "date-parts": [[year, 1, 1]] },
    published: { "date-parts": [[year, 1, 1]] },
    "published-print": { "date-parts": [[year, 1, 1]] },
  };
  const paper: PaperJSON = {
    id: uuidv4(),
    bibtex: bibtex,
    doi: "",
    relevant_text: relevant_text,
    tags: tags,
    analysis: analysis || "",
  };
  const success = writePaper(paper);
  if (!success) {
    console.log("Error: paper already exists");
    res.status(400).send({ result: "Error: paper already exists" });
    return;
  }
  res.status(200).send({ result: "Added" });
};
