import { formatUUID, getBibtex } from "./utils";
import { updatePaper } from "../model";
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
  const { doi, relevant_text, tags, analysis, id_in_db } = req.body;
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
  const id = formatUUID("a" + uuidv4());
  const paper = {
    id: id_in_db === undefined || id_in_db === "" ? id : id_in_db,
    bibtex: bibtex,
    doi: doi,
    relevant_text: relevant_text,
    tags: tags,
    analysis: analysis || "",
  };
  if (id_in_db !== "" && id_in_db !== undefined) {
    const success = updatePaper(paper);
    if (!success) {
      console.log("Error");
      res.status(400).send({ result: "Error" });
      return;
    }
    res.status(200).send({ result: "Paper updated" });
  } else {
    const success = writePaper(paper);
    if (!success) {
      console.log("Error: paper already exists");
      res.status(400).send({ result: "Error: paper already exists" });
      return;
    }
    res.status(200).send({ result: "Added" });
  }
};

export const postPaperWithoutDOI = async (req, res) => {
  console.log("postPaperWithoutDOI incoming");
  const { title, authors, year, url, relevant_text, tags, analysis, id_in_db, ...others } =
    req.body;
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
    created: { "date-parts": [[year, 1, 1]] },
    issued: { "date-parts": [[year, 1, 1]] },
    published: { "date-parts": [[year, 1, 1]] },
    "published-print": { "date-parts": [[year, 1, 1]] },
  };
  const id = formatUUID("a" + uuidv4());
  const paper: PaperJSON = {
    id: id_in_db === undefined || id_in_db === "" ? id : id_in_db,
    bibtex: bibtex,
    doi: "",
    relevant_text: relevant_text,
    tags: tags,
    analysis: analysis || "",
  };
  if (id_in_db !== "" && id_in_db !== undefined) {
    const success = updatePaper(paper);
    if (!success) {
      console.log("Error");
      res.status(400).send({ result: "Error" });
      return;
    }
    res.status(200).send({ result: "Paper updated" });
  } else {
    const success = writePaper(paper);
    if (!success) {
      console.log("Error: paper already exists");
      res.status(400).send({ result: "Error: paper already exists" });
      return;
    }
    res.status(200).send({ result: "Added" });
  }
};
