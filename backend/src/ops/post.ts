import { getBibtex } from "./utils";
import { writePaper } from "../model";
/**
 *
 * @param {*} req body contains doi, relevant_text, tags. Url will be inferred from doi
 * @param {*} res
 */
export const postPaper = async (req, res) => {
    // console.log("postPaper");
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