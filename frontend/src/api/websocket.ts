import io from "socket.io-client";
import {
  graphStore,
  papersStore,
  serverMsgStore,
  svgGraphStore,
  tagsStore,
} from "../data";

const socket = io("http://localhost:3001");

export function initSocket() {
  console.log("initSocket");
  // Show port number used to transmit data
  socket.on("port", (port) => {
    console.log("port", port);
  });

  // Handle incoming paper data
  socket.on("papers", (data) => {
    papersStore.set(data);
  });
  // Handle incoming tag data
  socket.on("tags", (data) => {
    tagsStore.set(data);
  });
  // Handle incoming graph data
  socket.on("graph", (data) => {
    graphStore.set(data);
  });

  // Handle end of file transmission
  socket.on("dataGetGraphSVG", ({ data, isBinary }) => {
    if (isBinary) {
      // Create a binary file from the received data
      const file = new Blob([data], { type: "application/svg" });
      // Read the file as text
      const reader = new FileReader();
      reader.readAsText(file);
      reader.onloadend = () => {
        // Save the blob in a store
        svgGraphStore.set({ file, text: reader.result as string });
      };
    }
  });
  // Handle end of file transmission
  socket.on("dataGetGraphDOT", ({ data, isBinary }) => {
    if (isBinary) {
      // Create a binary file from the received data
      const file = new Blob([data], { type: "application/dot" });
      // Read the file as text
      const reader = new FileReader();
      reader.readAsText(file);
      reader.onloadend = () => {
        // Save the blob in a store
        svgGraphStore.set({ file, text: reader.result as string });
      };
    }
  });

  // Handle file errors
  socket.on("resultMsg", (msg) => {
    serverMsgStore.set(msg);
    setTimeout(() => {
      serverMsgStore.set("");
    }, 5000);
  });
}
export const emitPaperWithDOI = async (doi, relevant_texts, tags, analysis) => {
  const json = {
    doi: doi,
    relevant_text: relevant_texts,
    tags: tags,
    analysis: analysis,
  };
  socket.emit("addPaperWithDOI", json);
};

export const emitPaperWithoutDOI = async (
  title,
  authors,
  year,
  url,
  relevant_texts,
  tags,
  analysis
) => {
  const json = {
    title: title,
    authors: authors,
    year: year,
    url: url,
    relevant_text: relevant_texts,
    tags: tags,
    analysis: analysis,
  };
  socket.emit("addPaperWithoutDOI", json);
};
