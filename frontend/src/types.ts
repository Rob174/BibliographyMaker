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