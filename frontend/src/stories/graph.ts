import type { GenericPaper } from "../data";
import { v4 as uuidv4 } from "uuid";
import * as Viz from "@viz-js/viz/lib/viz-standalone"
export type Structure = {
    id: string;
    type: "tag" | "expression"
    expression: string;
    children: Structure[]
}
function get_id() {
    return uuidv4()
}
export type Node = {
    id: string;
    type: "tag" | "expression" | "root" | "paper";
    expression: string;
    children: string[];
    papers: GenericPaper[];
}
export type NodeMap = Map<string, Set<string>>;

type GraphNode = {
    id: string;
    children: string[];
    allChildren: string[]
    parents: string[];
};
function getBranches(nodes: Node[]): NodeMap {
    const graph: Map<string, GraphNode> = new Map();

    // Build the graph representation
    for (const node of nodes) {
        const allChildren = getAllChildren(node, nodes);
        const parents = getParents(node.id, nodes);

        graph.set(node.id, {
            id: node.id,
            children: node.children,
            allChildren,
            parents,
        });

        for (const childId of node.children) {
            if (graph.has(childId)) {
                graph.get(childId)!.parents.push(node.id);
            } else {
                graph.set(childId, {
                    id: childId,
                    children: [],
                    allChildren: [],
                    parents: [node.id],
                });
            }
        }
    }

    // Build the node map using breadth-first search
    const nodeMap: NodeMap = new Map();

    for (const [nodeId, _] of graph) {
        const visited = new Set<string>();
        const queue: string[] = [];

        // Perform BFS traversal starting from the current node
        queue.push(nodeId);

        while (queue.length > 0) {
            const currentId = queue.shift()!;
            visited.add(currentId);

            const currentNode = graph.get(currentId)!;

            if (!nodeMap.has(currentNode.id)) {
                nodeMap.set(currentNode.id, new Set<string>());
            }

            // Add parents and their children to node map
            for (const parentId of currentNode.parents) {
                if (!visited.has(parentId)) {
                    nodeMap.get(currentNode.id)?.add(parentId);
                    queue.push(parentId);
                    visited.add(parentId);

                    const parentChildren = graph.get(parentId)!.children;
                    for (const childId of parentChildren) {
                        if (!visited.has(childId)) {
                            nodeMap.get(currentNode.id)?.add(childId);
                            queue.push(childId);
                            visited.add(childId);
                        }

                        const childNode = graph.get(childId);
                        if (childNode) {
                            const indirectChildren = childNode.allChildren;
                            for (const indirectChildId of indirectChildren) {
                                if (!visited.has(indirectChildId)) {
                                    nodeMap.get(currentNode.id)?.add(indirectChildId);
                                    queue.push(indirectChildId);
                                    visited.add(indirectChildId);
                                }
                            }
                        }
                    }
                }
            }

            // Add children to node map
            for (const childId of currentNode.children) {
                if (!visited.has(childId)) {
                    nodeMap.get(currentNode.id)?.add(childId);
                    queue.push(childId);
                    visited.add(childId);
                }
            }
        }
    }

    return nodeMap;
}

function getAllChildren(node: Node, nodes: Node[]): string[] {
    let allChildren: string[] = [];

    for (const childId of node.children) {
        const childNode = nodes.find((n) => n.id === childId);
        if (childNode) {
            allChildren.push(childId, ...getAllChildren(childNode, nodes));

            const indirectChildren = childNode.children;
            for (const indirectChildId of indirectChildren) {
                allChildren.push(indirectChildId, ...getAllChildren(nodes.find((n) => n.id === indirectChildId)!, nodes));
            }
        }
    }

    return allChildren;
}

function getParents(nodeId: string, nodes: Node[]): string[] {
    const parents: string[] = [];

    for (const node of nodes) {
        if (node.children.includes(nodeId)) {
            parents.push(node.id, ...getParents(node.id, nodes));
        }
    }

    return parents;
}
export function applyStructure(structure: Structure[], papers: GenericPaper[]) {
    // We want to extract given a list of Structures the tags for each one + other tags that are not in the structure
    let papersAvailable = papers.slice();
    // Then we do a BFS to extract the tags
    let queue = structure.slice()
    var nodes = [];
    const bfs = (queue: Structure[], papersAvailable: GenericPaper[]) => {
        // Recursive version of the bfs
        const remainingPapers = new Map();
        papersAvailable.forEach(p=>{
            remainingPapers.set(p.id, p)
        })
        let others = {present:false, structure: null};
        let childrenIds = [];
        queue.forEach((s: Structure):Node[] => {
            var node = {
                id: get_id(),
                type: s.type,
                expression: s.expression,
                children: [],
                papers: []
            }
            if(s.type == "tag" && s.expression == "others") {
                others.present= true;
                others.structure = s;
                return;
            }
            else if (s.type === "tag") {
                // Filter the paper with this tag inside queue
                node.papers = papersAvailable.filter(paper => paper.tags.some(tag => tag.text === s.expression))
            } else {
                // If the structure is an expression we need to extract the tags from the expression
                node.papers = papersAvailable.filter(paper => {
                    // We replace each tag that is in paper.tags by true inside the string
                    let expression = s.expression.slice();
                    // We want to match the biggest tags before the smallest so we order the tags to have the longest first
                    let tags = paper.tags.slice().sort((a, b) => b.text.length - a.text.length)
                    tags.forEach(tag => {
                        expression = expression.replace(tag.text, "true")
                    })
                    // We then replace all tags that are not in the paper by false
                    expression = expression.replace(/[^!|&()+*]+/g, "false")
                    // We then evaluate the expression and return the result
                    let returnValue;
                    try {
                        returnValue = (eval(expression))
                    } catch {
                        returnValue = false;
                    }
                    return returnValue;
                })
            }
            node.children = bfs(s.children, node.papers);
            // Remove used papers
            node.papers.forEach(p => {
                remainingPapers.delete(p.id)
            })
            // Add the node to the nodes
            nodes.push(node);
            childrenIds.push(node.id)

        })
        if(others.present) {
            var node = {
                id: get_id(),
                type: others.structure.type,
                expression: others.structure.expression,
                children: [],
                papers: Array.from(remainingPapers.values())
            }
            node.children = bfs(others.structure.children, node.papers)
            nodes.push(node);
            childrenIds.push(node.id)
        }
        if(queue.length === 0) {
            papersAvailable.forEach(p=> {
                nodes.push({
                    id: p.id,
                    type: "paper",
                    expression: "",
                    children: [],
                    papers: [p]
                })
                childrenIds.push(nodes[nodes.length-1].id)
            })
        }
        return childrenIds;
    }
    nodes.push({
        id: "root",
        type: "root",
        expression: "",
        children: bfs(queue, papersAvailable),
        papers: papersAvailable
    })
    console.log(papers, nodes)
    return nodes
}
export async function nodesToSvg(structure: Structure[], papers: GenericPaper[], getLabel: (paper: Node) => string, dispatch) {
    const nodes = applyStructure(structure, papers);
    const branches = await getBranches(nodes);
    // Make the dot graph
    const nodesTxt = nodes.map(n => `"${n.id}" [label="${getLabel(n)}", id="${n.id}"]`).join("\n");
    const linksTxt = nodes.map(n => n.children.map(c => `"${n.id}" -> "${c}"`).join("\n")).join("\n");
    const dot = `digraph {
        rankdir=LR;
        node [shape=box];
        ${nodesTxt}
        ${linksTxt}
    };`
    // We then convert it to svg
    const viz = await Viz.instance();
    const serializer = new XMLSerializer();
    const svg = await viz.renderSVGElement(dot)
    const graph = await serializer.serializeToString(svg)
    // Add the listeners
    return {graph, nodes, branches};
}
// function addPaperDetail(html: )