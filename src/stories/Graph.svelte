<script lang="ts">
  /** A component to render the graph of the papers according to a structure provided
   * @param {Structure[]}{structure} the structure to use to render the graph. Here the root node is implicitely above the structures provided (each structure object is a node)
   * @param {GenericPaper[]} papers the list of papers to render}
   *
   */
  import { nodesToSvg } from "./graph";
  import type { Structure, Node, NodeMap } from "./graph";
  import { onMount } from "svelte";
import { createEventDispatcher } from "svelte";
  export let structure: Structure[] = [
    { id: "aaaa", type: "tag", expression: "CNN", children: [] },
  ];
  console.log("structure: ", structure);
  export let papers = [];
  let graphSvg = "<svg><text>test</text></svg>";
  var nodesList: Node[] = [];
  let nodesMap = new Map();
  let branchesElem: NodeMap | null = null;
const dispatch = createEventDispatcher();
  nodesList.forEach((n) => {
    nodesMap.set(n.id, n);
  });
  async function update() {
    const { graph, nodes, branches } = await nodesToSvg(
      structure,
      papers,
      (node: Node) => {
        if (node.type === "root") {
          return `${node.papers.length} papers`;
        } else if (Array.from(["tag", "expression"]).includes(node.type)) {
          return `${node.expression}\n${node.papers.length} papers`;
        } else if (Array.from(["paper"]).includes(node.type)) {
          return `${node.papers[0].title}`;
        } else {
          throw new Error();
        }
      },
      dispatch
    );
    graphSvg = graph;
    nodesList = nodes;
    branchesElem = branches;
    setTimeout(() => {
      // add the listener to each node to chaneg the view to the details wen click on a node of type paper
      document.querySelectorAll(".node").forEach((e) => {
        for (let event of ["mouseleave", "mouseenter"]) {
          e.addEventListener(event, () => {
            const id = e.id;
            Array.from([...branchesElem.get(id)]).forEach((n) => {
              document.getElementById(n).classList.toggle("selected");
              // And select edges with id composed of the characters of the source node and the characters of the destination node
              Array.from(document.querySelectorAll(".edge")).forEach((edge) => {
                const [id1,id2] = edge.id.split("_")
                // if id1 and id2 in branchesElem then toogle
                const branch = Array.from([...branchesElem.get(id)])
                branch.push(id)
                const branchSet = new Set(branch)
                if (branchSet.has(id1) && branchSet.has(id2)) {
                    edge.classList.toggle("selected");
                }
                
              });
            });
            
          });
        }
        // if node of type paper
        const id = e.id;
        const node = nodes.find(x=>x.id === id) 
        if(node) {
          if(node.type === "paper") {
            e.addEventListener("click", () => {
              dispatch("visualize", node.papers[0]);
            });
          }
        }
      });
      
    },600)
  }
  onMount(() => {
    update();
  });
</script>

<div>
  {@html graphSvg}
</div>

<style>
  :global(.node) {
    cursor: pointer;

  }
  :global(.node:hover > polygon) {
    stroke: red;
  }
  :global(.node:hover text) {
    fill:red;
  }
  :global(.selected polygon) {
    stroke: orange;
  }
  :global(.selected path) {
    stroke: orange;
  }
</style>
