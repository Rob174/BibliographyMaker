import {
  paperStore,
  type BibtexType,
  type DOIPaper,
  type GenericPaper,
  type NonDOIPaper,
  type AuthorType,
} from "../data";
import { v4 as uuidv4 } from "uuid";

export async function getBibtex(doi) {
  try {
    const url = `https://api.crossref.org/works/${doi}`;
    console.log(url, doi);
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    // Return the retrieved data
    return data.message;
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
}
export async function doipaperToGenericPaper(
  paper: DOIPaper
): Promise<GenericPaper> {
  const bibtex = await getBibtex(paper.doi);
  console.log("result", bibtex);
  const title: string = bibtex.title[0];
  const authors: AuthorType[] = bibtex.author;
  const year: string = bibtex.issued["date-parts"][0][0];
  const url = paper.url !== "" ? paper.url : bibtex.url;
  const r = {
    ...paper,
    type: "doi",
    title: title,
    authors: authors,
    year: year,
    url: url,
    bibtex: bibtex,
  };
  console.log(r);
  return r;
}
export function genericPaperToDOIPaper(paper: GenericPaper): DOIPaper {
  console.log(paper);
  return {
    id: paper.id,
    doi: paper.doi,
    url: paper.url,
    citations: paper.citations,
    tags: paper.tags,
    analysis: paper.analysis,
  };
}
export function genericPaperToNonDOIPaper(paper: GenericPaper): NonDOIPaper {
  return {
    id: paper.id,
    title: paper.title,
    authors: paper.authors,
    year: paper.year,
    url: paper.url,
    citations: paper.citations,
    tags: paper.tags,
    analysis: paper.analysis,
  };
}
export async function nondoipaperToGenericPaper(
  paper: NonDOIPaper
): Promise<GenericPaper> {
  const bibtex: BibtexType = {
    DOI: "",
    URL: paper.url,
    title: [paper.title],
    author: paper.authors,
    created: yearToDatePart(paper.year),
    issued: yearToDatePart(paper.year),
    published: yearToDatePart(paper.year),
    "published-print": yearToDatePart(paper.year),
  };
  return {
    ...paper,
    doi: "",
    type: "nondoi",
    bibtex: bibtex,
  };
}
function yearToDatePart(year: string) {
  return {
    "date-parts": [[parseInt(year), 1, 1]],
  };
}
export function emptyDOIPaper(): DOIPaper {
  return {
    id: uuidv4(),
    doi: "",
    url: "",
    citations: [emptyText()],
    tags: [emptyTag()],
    analysis: "",
  };
}
export function emptyNonDOIPaper(): NonDOIPaper {
  return {
    id: uuidv4(),
    title: "",
    authors: [emptyAuthor()],
    year: "",
    url: "",
    citations: [emptyText()],
    tags: [emptyTag()],
    analysis: "",
  };
}
export function insertDOIPaper(paper: DOIPaper) {
  doipaperToGenericPaper(paper).then((genericPaper: GenericPaper) => {
    paperStore.update((p) => {
      // Check if genericPaper.id is already in p: if yes overwrites the entry with the same id
      const index = p.findIndex((el) => el.id === genericPaper.id);
      if (index !== -1) {
        p[index] = genericPaper;
      }
      // if not, adds the new entry
      else {
        p.push(genericPaper);
      }
      return p;
    });
  });
}
export function insertNonDOIPaper(paper: NonDOIPaper) {
  nondoipaperToGenericPaper(paper).then((genericPaper: GenericPaper) => {
    paperStore.update((p) => {
      // Check if genericPaper.id is already in p: if yes overwrites the entry with the same id
      const index = p.findIndex((el) => el.id === genericPaper.id);
      if (index !== -1) {
        p[index] = genericPaper;
      }
      // if not, adds the new entry
      else {
        p.push(genericPaper);
      }
      return p;
    });
  });
}
export function shortString(txt: string, size: number = 10): string {
  if (txt === undefined) return "Error";
  return txt.length > size ? txt.substring(0, size) + "..." : txt;
}

export function emptyTag() {
  return {
    id: uuidv4(),
    text: "",
  };
}

export function emptyAuthor() {
  return {
    family: "",
    given: "",
    raw: "",
  };
}
export function processAuthor(author: AuthorType): AuthorType[] {
  // First check if there are multiple authors in raw field (separated by a comma and space)
  const authors = author.raw.split(",").map((x) => {
    let [family, given] = x
      .trim()
      .split(" ")
      .map((a) => a.trim());
    if (given === undefined) given = "";
    return {
      family: family,
      given: given,
      raw: x,
    };
  });
  return authors;
}
export function emptyText() {
  return {
    id: uuidv4(),
    text: "",
    tags: [],
    files: [],
  };
}
export function generateColors(n: number) {
  const step_size = 137.50776;
  const res = [];
  let hue = 0;
  for (let i = 0; i < n; i++) {
    hue = (hue + step_size) % 360;
    res.push(`hsl(${hue}, 100%, 50%)`);
  }
  return res;
}
