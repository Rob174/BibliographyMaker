import * as model from "../../model";

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
  