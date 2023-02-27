import { writable } from "svelte/store";
import type { Writable } from "svelte/store";

export const tagsPoss = ["done", "todo"];
export type PaperTag = "done" | "todo" | "neutral" | "hover";
export type PaperMetadata = {
    id: string;
    tags: PaperTag[];
};
export type ID = string;
let mapMetadata: Map<ID, PaperMetadata> = new Map();
export const papersMetadata: Writable<Map<ID,PaperMetadata>> = writable(mapMetadata);