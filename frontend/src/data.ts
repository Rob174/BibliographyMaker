import { writable, type Writable } from "svelte/store";
import type { Paper, Tag, TagStructure } from "./types";

export const PORT = 3000;
export const API_URL = `http://localhost:${PORT}`;
export const checkField = (fields: any) => {
  const regexTag = /^[a-zA-Z0-9_-]+$/;
  const { doi, relevant_text, tags } = fields;
  if (doi == "" || doi == null) {
    return {error:true, message:"DOI is required"};
  }
  // Check if relevant texts are not empty

  const sentRelevantTexts = relevant_text.filter((text) => text != "");
  // Check if tags are not empty
  const sentTags = tags.filter((tag) => tag != "");
  if (sentTags.length == 0) {
    return {error:true, message:"At least one non empty tag is required"};
  }
  // Check that each tag contains only letters, numbers and underscores or -
  for (let tag of sentTags) {
    if (!regexTag.test(tag)) {
      return {error:true, message:"Each tag must contain only letters, numbers and underscores or -"};
    }
  }
  return {error:false, message:""};
};
export const papersTags: Writable<{papers: Paper[]; tags: Tag[]}> = writable({papers: [], tags: []});
export const structureStore: Writable<TagStructure|undefined> = writable(undefined);
export const othersShownStore: Writable<boolean> = writable(true);