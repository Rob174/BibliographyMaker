import * as model from "../../model";
import { Node,Edge, ID } from "../../types";

export const cleanSVGGenerated = (svg) => {
    // remove the fill and stroke attributes of polygons
    svg = svg.replace(/fill="[^"]*"/g, "");
    svg = svg.replace(/stroke="[^"]*"/g, "");
    return svg;
  };
  export const clean = (req, res) => {
    model.clean();
    console.log("Cleaned");
    res.status(200).send({ result: "Success" });
  };
  
export const makeEdge = (from: ID, to: ID): Edge => {
  return {
    id: from + "_" + to,
    from,
    to,
  };
};
export const makeNode = (id: ID, label: string, type: "paper" | "tag" | "root"): Node => {
  return {
    id,
    label,
    type,
  };
};