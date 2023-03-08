import { API_URL } from "../data";
export const postPaperWithDOI = async (
  doi,
  relevant_texts,
  tags,
  analysis,
  id_in_db = ""
): Promise<string> => {
  const json = {
    doi: doi,
    relevant_text: relevant_texts,
    tags: tags,
    analysis: analysis,
    id_in_db: id_in_db
  };
  // Make a post request to the backend
  const r = await fetch(`${API_URL}/papers/doi`, {
    method: "POST",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(json),
  });
  // Field result contains always "Added" if the paper was added& successfully or the error message
  //   res.status(200).send({ result: "Added" });
  return (await r.json()).result;
};

export const postPaperWithoutDOI = async (
  title,
  authors,
  year,
  url,
  relevant_texts,
  tags,
  analysis,
  id_in_db = ""
): Promise<string> => {
  const json = {
    title: title,
    authors: authors,
    year: year,
    url: url,
    relevant_text: relevant_texts,
    tags: tags,
    analysis: analysis,
    id_in_db: id_in_db
  };
  // Make a post request to the backend
  const r = await fetch(`${API_URL}/papers/withoutDoi`, {
    method: "POST",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(json),
  });
  // Field result contains always "Added" if the paper was added& successfully or the error message
  //   res.status(200).send({ result: "Added" });
  return (await r.json()).result;
}