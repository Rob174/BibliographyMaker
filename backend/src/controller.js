const model = require("./model");
const request = require("request-promise");
const { spawn } = require("child_process");
const uuid = require("uuid");
const seedrandom = require("seedrandom");
/**
 *
 * @param {*} req body contains doi, relevant_text, tags. Url will be inferred from doi
 * @param {*} res
 */
const postPaper = async (req, res) => {
  console.log("postPaper");
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
  const success = model.writePaper(paper);
  if (!success) {
    console.log("Error: paper already exists");
    res.status(400).send({ result: "Error: paper already exists" });
    return;
  }
  res.status(200).send({ result: "Added" });
};
const getBibtex = async (doi) => {
  console.log("getBibtex");
  const url = `https://api.crossref.org/works/${doi}`;
  const options = {
    uri: url,
    json: true,
  };
  try {
    const bibtex = await request(options);
    return bibtex.message;
  } catch (err) {
    console.log(err);
    return null;
  }
};

function formatTrim(str) {
  str = sanitizeTitle(str);

  const limit = 50;
  if (str.length > limit) {
    str = str.substring(0, limit) + "...";
  }
  return str;
}
function sanitizeTitle(str) {
  str = str.replace(/\\n/g, " ");
  str = str.replace(/\s+/g, " ");
  str = str.replace(/\|/g, " ");
  // Remove html tags
  str = str.replace(/<\/?([a-z][a-z0-9]*)\b[^>]*>|<!--[\s\S]*?-->/gi, "");
  return str;
}
const getPapers = (req, res) => {
  console.log("getPapers");
  const papers = model.getPapers().map((paper) => {
    return {
      ...paper
    };
  });
  res.status(200).send(papers);
};
const getPapersWithTitle = async (req, res) => {
  console.log("getPapersWithTitle");
  const title = req.query.title;
  const encodedTitle = encodeURIComponent(title);
  // Make a get request to crossref to get the doi with title, authors and abstract
  // Make sure to escape appropriately the characters
  const url = `https://api.crossref.org/works?query.bibliographic=${encodedTitle}&rows=5`;
  const options = {
    uri: url,
    json: true,
  };
  const papers = await request(options)
    .then((response) => {
      const papers = response.message.items.map((item) => {
        return {
          doi: item.DOI,
          title: item.title[0],
          authors: item.author.map((author) => {
            return author.family + " " + author.given;
          }),
          abstract: item.abstract,
        };
      });
      return papers;
    })
    .catch((err) => {
      console.log(err);
    });
  res.status(200).send({ papers: papers });
};
const getTags = (req, res) => {
  console.log("getTags");
  const tags = model.getTags();
  res.status(200).send(tags);
};
const deterministicUuid = () => {
  const seed = "my_seed"; // Set a fixed seed
  const rng = seedrandom(seed); // Initialize the pseudo-random number generator with the seed

  const uuidv4 = () => {
    // Define a function to generate UUIDs
    return "a"+uuid.v4({
      random: [...new Array(16)].map(() => Math.floor(rng() * 256)), // Use the pseudo-random number generator to generate random bytes for the UUID
    }).replace(/-/g, "");
  };
  return uuidv4
};
const buildJSONGraph = (papers, tags, uuidv4, nodeGenerator) => {
  // Build the JSON
  const graph = {
    digraph: { node: [], edge: [] },
  };
  // Add main node
  graph.digraph.node.push({
    id: uuidv4(),
    label: "Paper",
  });
  // Add papers
  const papersNodes = papers.map((paper) => {
    const v = {
      id: paper.id,
      doi: paper.doi,
      label: nodeGenerator(formatTrim(paper.bibtex.title[0])),
    };
    return v;
  });
  // Add tags
  const tagsNodes = tags.map((tag) => {
    return {
      id: tag.id,
      label: nodeGenerator(`${tag.papers.length} papers`,tag.name),
      type: "tag",
      data: tag,
    };
  });
  const tagsEdges = tags.map((tag) => {
    const v = {
      id: uuidv4(),
      from: graph.digraph.node[0].id,
      to: tag.id,
    };
    return v;
  });
  const papersEdges = [];
  tags.forEach((tag) => {
    tag.papers.forEach((paperId) => {
      papersEdges.push({
        id: uuidv4(),
        from: tag.id,
        to: paperId,
      });
    });
  });
  graph.digraph.node = graph.digraph.node.concat(tagsNodes);
  graph.digraph.node = graph.digraph.node.concat(papersNodes);
  graph.digraph.edge = graph.digraph.edge.concat(tagsEdges);
  graph.digraph.edge = graph.digraph.edge.concat(papersEdges);
  return {
    graph: graph,
    paperNode: graph.digraph.node[0],
    tagsNodes: tagsNodes,
    papersNodes: papersNodes,
    paperTagsEdges: tagsEdges,
    tagsPapersEdges: papersEdges,
  };
};
const getGraph = (req, res) => {
  const {shape = 'record', splineType = 'polyline', style = ''} = req.body;
  let nodeGenerator = (txt1,txt2) => {
    if(txt2 === undefined) return txt1
    return `{${txt1}|${txt2}}`
  }
  if (shape !== 'record') {
    nodeGenerator = (txt1,txt2) => {
      if(txt2 === undefined) return txt1
      return `${txt1}\\n${txt2}`
    }
  }
  const uuidv4 = deterministicUuid()
  console.log("getGraph");
  // Build the JSON: Paper as main node, tags as subnodes and papers.bitex.title[0] as final nodes
  const tags = [];
  const papers = model.getPapers().map((paper) => {
    var paperCpy = { ...paper };
    paperCpy.id = uuidv4();
    paperCpy.tags.forEach((tag) => {
      let posTag = tags.map((tag) => tag.name).indexOf(tag);
      if (!tags.map((tag) => tag.name).includes(tag)) {
        tags.push({ name: tag, id: uuidv4(), papers: [] });
        posTag = tags.length - 1;
      }
      tags[posTag].papers.push(paperCpy.id);
    });
    return paperCpy;
  });
  const {
    graph,
    paperNode,
    tagsNodes,
    papersNodes,
    paperTagsEdges,
    tagsPapersEdges,
  } = buildJSONGraph(papers, tags, uuidv4, nodeGenerator);
  const nodeToDot = (node) =>
    `"${node.id}" [label="${node.label}" id="${node.id}"]`;
  const edgeToDot = (edge) =>
    `"${edge.from}":w -> "${edge.to}" [dir="forward" tailport="e" headport="w" id="${edge.id}"]`;
  const dotGraph = `
  digraph G {
    rankdir=LR;
    bgcolor=transparent;
    graph [splines=${splineType}] 
    node [shape=${shape}, style=${style}]
    ${graph.digraph.node.map(nodeToDot).join("\n")}
    ${graph.digraph.edge.map(edgeToDot).join("\n")}
  }
  `;
  // Render the graph with dot to svg
  const dotProcess = spawn("dot", ["-Tsvg"]);
  dotProcess.stdin.write(dotGraph);
  dotProcess.stdin.end();
  let svg = "";
  dotProcess.stdout.on("data", (data) => {
    svg += data;
  });
  dotProcess.stdout.on("end", () => {
    svg = cleanSVGGenerated(svg);
    res
      .status(200)
      .send({
        svg: svg,
        graph: graph,
        paperNode: paperNode,
        tagsNodes: tagsNodes,
        papersNodes: papersNodes,
        paperTagsEdges: paperTagsEdges,
        tagsPapersEdges: tagsPapersEdges
      });
  });
};
const cleanSVGGenerated = (svg) => {
  // remove the fill and stroke attributes of polygons
  svg = svg.replace(/fill="[^"]*"/g, "");
  svg = svg.replace(/stroke="[^"]*"/g, "");
  return svg;
};
const clean = (req, res) => {
  model.clean();
  console.log("Cleaned");
  res.status(200).send({ result: "Success" });
};
module.exports = {
  postPaper,
  getPapers,
  getPapersWithTitle,
  getTags,
  getGraph,
  clean,
};
