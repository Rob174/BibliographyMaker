export type Paper = {
    doi: DOI;
    bibtex: BibTex;
    relevant_text: RelevantText[];
    tags: Tag[];
    analysis: string;
};
export type DOI = string;
export type BibTex = {
    created: {timestamp: number};
    title: string[];
    author: {given:string,family:string}[];
    link: {URL:string}[];
    URL: string;
};
export type RelevantText = string;
export type Tag = string;
export type TagStructureElement = {
    tag: string;
    children: TagStructureElement[];
}
/**
 * Tag structure is a tree of tags where each parallel branch will be a choice (OR) of tags and each child will be a requirement (AND) of tags.
 */
export type TagStructure = TagStructureElement[];
export type URL = string;