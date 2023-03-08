import { writeFileSync, readFileSync, renameSync } from "fs";
import { v4 as uuidv4 } from "uuid";
import { formatUUID } from "./ops/utils";
// We have an data.js file in the same folder to store all of the data in the format
/**
 * {
 * papers: [
 *  {
 *   id: "auuid",
 *  bibtex: "...",
 * doi: "...",
 * url: "...",
 * relevant_text: ["...", "..."],
 * tags: ["...", "..."]
 * }
 * ],
 * tags: [{"name":...,"id":...}, {"name":...,"id":...}]
 * }
 */
const file_name: string = "data.json";
// We provide paper and tags are updated automatically if they are not already in the data
// We maintain the fact that each url in papers is unique
export const writePaper = (paper) => {
  // Show current folder
  const data = JSON.parse(readFileSync(file_name).toString());
  data.papers.push(paper);
  // Insert new tags
  paper.tags
    .filter((tag) => !data.tags.map((x) => x.name).includes(tag))
    .forEach((tag) => {
      data.tags.push({ name: tag, id: formatUUID("t"+uuidv4()) });
    });
  writeFileSync(file_name, JSON.stringify(data));
  return true;
};
export const updatePaper = (paper) => {
  // Show current folder
  const data = JSON.parse(readFileSync(file_name).toString());
  // Remove the old paper
  data.papers = data.papers.filter((x) => x.id !== paper.id);
  // Add the new paper
  data.papers.push(paper);
  // Insert new tags
  paper.tags
    .filter((tag) => !data.tags.map((x) => x.name).includes(tag))
    .forEach((tag) => {
      data.tags.push({ name: tag, id: formatUUID("t"+uuidv4()) });
    });
  writeFileSync(file_name, JSON.stringify(data));
  return true;
};
export const getPapers = () => {
  const data = JSON.parse(readFileSync(file_name).toString());
  return data.papers;
};
export const getTags = () => {
  const data = JSON.parse(readFileSync(file_name).toString());
  return data.tags;
};
export const generateEmptyData = () => {
  return {
    papers: [],
    tags: [],
  };
};
export const clean = () => {
  // Rename the former data file into data.json.bak
  renameSync(file_name, file_name + ".bak");
  writeFileSync(file_name, JSON.stringify(generateEmptyData()));
};