fs = require("fs");
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
const file_name = "data.json";
// We provide paper and tags are updated automatically if they are not already in the data
// We maintain the fact that each url in papers is unique
const writePaper = (paper) => {
    // Show current folder
    const data = JSON.parse(fs.readFileSync(file_name));
    if (!data.papers.find((p) => p.doi === paper.doi)) {
        data.papers.push(paper);
        data.tags = [...new Set(data.tags.concat(paper.tags))];
        fs.writeFileSync(file_name, JSON.stringify(data));
        return true;
    } else {
        console.log("Paper already exists");
        return false;
    }
};
const getPapers = () => {
    const data = JSON.parse(fs.readFileSync(file_name));
    return data.papers;
};
const getTags = () => {
    const data = JSON.parse(fs.readFileSync(file_name));
    return data.tags;
};
const generateEmptyData = () => {
    return {
        papers: [],
        tags: []
    };
};
const clean = () => {
    // Rename the former data file into data.json.bak
    fs.renameSync(file_name, file_name + ".bak");
    fs.writeFileSync(file_name, JSON.stringify(generateEmptyData()));
};
module.exports = {
    writePaper,
    getPapers,
    getTags,
    clean
};