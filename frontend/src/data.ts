import { writable, derived } from "svelte/store";
import type { Writable } from "svelte/store";
import {
  emptyDOIPaper,
  emptyNonDOIPaper,
  generateColors,
  getBibtex,
} from "./stories/libs";
import { v4 as uuidv4 } from "uuid";
export type CitationType = {
  id: string;
  text: string;
  tags: string[];
  files: any[];
};
export type AuthorType = {
  family: string;
  given: string;
  raw: string;
};
export type DatePartsType = { "date-parts": Array<Array<number>> };
export type BibtexType = {
  DOI: string;
  title: string[];
  author: AuthorType[];
  URL: string;
  created: DatePartsType;
  issued: DatePartsType;
  published: DatePartsType;
  "published-print": DatePartsType;
};
export type DOIPaper = {
  id: string;
  doi: string;
  url: string;
  citations: CitationType[];
  tags: TagType[];
  analysis: string;
};
export type NonDOIPaper = {
  id: string;
  title: string;
  authors: AuthorType[];
  year: string;
  url: string;
  citations: CitationType[];
  tags: TagType[];
  analysis: string;
};
export type TagType = {
  id: string;
  text: string;
  color: string;
};
export type PaperType = "doi" | "nondoi";
export type GenericPaper = {
  id: string;
  type: PaperType;
  title: string;
  authors: AuthorType[];
  year: string;
  url: string;
  doi: string;
  citations: CitationType[];
  tags: TagType[];
  analysis: string;
  bibtex: BibtexType;
};
export const doiPaperStore: Writable<DOIPaper> = writable(emptyDOIPaper());
export const nonDoiPaperStore: Writable<NonDOIPaper> = writable(
  emptyNonDOIPaper()
);
export const paperStore: Writable<GenericPaper[]> = writable([]);
export const tagsPossibilities = writable([]);
paperStore.subscribe((paperStore) => {
  const tags: Set<string> = new Set();
  for (const paper of paperStore) {
    for (const tag of paper.tags) {
      tags.add(tag.text);
    }
  }
  const sortedTags = Array.from(tags);
  sortedTags.sort();
  const colors = generateColors(sortedTags.length);
  console.log("colors", colors);
  tagsPossibilities.set(sortedTags.map((x, i) => ({
    id: uuidv4(),
    text: x,
    color: colors[i],
  })));
  saveToLocalStorage("paperStore",paperStore);
});
export function restoreFromLocalStorage() {
  console.log("Restoring...")
  const paperStoreValues = getFromLocalStorage("paperStore");
  console.log("Found ",paperStoreValues)
  if (paperStoreValues && paperStoreValues !== null) {
    paperStore.update((paperStore) => paperStoreValues);
  }
  else {
    console.log("Nothing found")
  }
}
export function saveToLocalStorage(key, value) {
  if(value.length==0) return
  console.log("Saving to local storage ",value)
  localStorage.setItem(key, JSON.stringify(value));
}

export function getFromLocalStorage(key) {
  const item = localStorage.getItem(key);
  return item ? JSON.parse(item) : null;
}