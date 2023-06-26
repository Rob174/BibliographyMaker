<script lang="ts">
    /** A component to render the graph of the papers according to a structure provided
     * @param {Structure[]}{structure} the structure to use to render the graph. Here the root node is implicitely above the structures provided (each structure object is a node)
     * @param {GenericPaper[]} papers the list of papers to render}
     * 
    */
    import {nodesToSvg} from "./graph";
    import type {Structure, Node} from "./graph";
    import { onMount } from "svelte";
    export let structure: Structure[] = [];
    export let papers = [];
    let graphSvg = "<svg><text>test</text></svg>";
    var nodesList: Node[] = [];
    let nodesMap = new Map();
    nodesList.forEach(n=>{
        nodesMap.set(n.id,n)
    })
    async function update() {
        const {graph,nodes} = await nodesToSvg(structure, papers, (node: Node) => {
            if(node.type === "root") {
                return `${node.papers.length} papers`
            }
            else if(Array.from(["tag","expression"]).includes(node.type)) {
                return `${node.expression}\n${node.papers.length} papers`
            } else if (Array.from(["paper"]).includes(node.type)) {
                return `${node.papers[0].title}`
            } else {
                throw new Error
            }
        });
        console.log(nodes)
        graphSvg = graph;
        nodesList = nodes;
    }
    onMount(()=>{
        update();
        setTimeout(()=>{
            document.querySelectorAll(".node").forEach(e=>{
                e.addEventListener("click", ()=>{
                    const id = e.id;
                    const node = nodesMap.get(id);
                    console.log(id,node)
                })
            })
        },100)
    })
</script>

<div>
    {@html graphSvg}
</div>