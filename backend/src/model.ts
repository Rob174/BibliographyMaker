import {writeFileSync, readFileSync, renameSync} from 'fs';
// We have an data.js file in the same folder to store all of the data in the format
/**
 * {
 * papers: [
 *  {
 *   id: "paperId",
 *  bibtex: "...",
 * doi: "...",
 * url: "...",
 * relevant_text: ["...", "..."],
 * tags: ["...", "..."]
 * }
 * ],
 * tags: ["...", "..."]
 * }
 */
const file_name: string = "data.json";
// We provide paper and tags are updated automatically if they are not already in the data
// We maintain the fact that each url in papers is unique
export const writePaper = (paper) => {
    // Show current folder
    const data = JSON.parse(readFileSync(file_name).toString())
    if (!data.papers.find((p) => p.doi === paper.doi)) {
        data.papers.push(paper);
        data.tags = [...new Set(data.tags.concat(paper.tags))];
        writeFileSync(file_name, JSON.stringify(data));
        return true;
    } else {
        console.log("Paper already exists");
        return false;
    }
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
        tags: []
    };
};
export const clean = () => {
    // Rename the former data file into data.json.bak
    renameSync(file_name, file_name + ".bak");
    writeFileSync(file_name, JSON.stringify(generateEmptyData()));
};
module.exports = {
    writePaper,
    getPapers,
    getTags,
    clean
};