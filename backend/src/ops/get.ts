import * as model from "../model";
const request =  require("request-promise");
export const getPapersWithTitle = (req, res) => {
  // console.log("getPapersWithTitle");
  // Get the title from the request
  const title = encodeURIComponent(req.params.title);
  // Make a get request to crossref to get the doi with title, authors and abstract
  // Make sure to escape appropriately the characters
  const url = `https://api.crossref.org/works?query.bibliographic=${title}&rows=5`;
  const options = {
    uri: url,
    json: true,
    timeout: 10000,
  };
  request(options)
    .then((response) => {
      const papers = response.message.items.map((item) => {
        return {
          doi: item.DOI,
          title: item.title[0],
          authors: item.author.map((author) => {
            if(author.given && author.family)
              return author.family + " " + author.given;
            else if(author.given)
              return author.given;
            else if(author.family)
              return author.family;
            else
              return "";
          }).filter((author) => author !== ""),
          abstract: item.abstract ? item.abstract : "",
        };
      });
      res.status(200).send({ papers: papers });
      return
    })
    .catch((err) => {
      res.status(400).send({ error: err, papers: [] });
      return
    });
};
export const getTags = (req, res) => {
  console.log("getTags");
  const tags = model.getTags();
  res.status(200).send(tags);
};

export const getPapers = (req, res) => {
  console.log("getPapers");
  const papers = model.getPapers().map((paper) => {
    return {
      ...paper,
    };
  });
  res.status(200).send(papers);
};
