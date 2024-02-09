import type { Meta, StoryObj } from "@storybook/svelte";

import { v4 as uuidv4 } from "uuid";
import PapersListElem from "./PapersListElem.svelte";
import type { GenericPaper, NonDOIPaper } from "../data";
import { nondoipaperToGenericPaper } from "./libs";

const meta = {
  title: "Element/PapersListElem",
  component: PapersListElem,
  tags: ["autodocs"],
  argTypes: {},
} satisfies Meta<PapersListElem>;

export default meta;
type Story = StoryObj<typeof meta>;

const citations = [
  {
      id: uuidv4(),
      text: "When applying the 2-opt heuristic to the travelling salesman problem, selecting the best improvement at each iteration gives worse results on average than selecting the first improvement, if the initial solution is chosen at random. However, starting with ‘greedy’ or ‘nearest neighbor’ constructive heuristics, the best improvement is better and faster on average. Reasons for this behavior are investigated. It appears to be better to use exchanges introducing into the solution a very small edge and fairly large one, which can easily be removed later, than two small ones which are much harder to remove.",
      tags: ["test1","test2"],
      files: []
  },
  {
      id: uuidv4(),
      text: "phase (or VNS proper) which seeks a better local optimum. For the TSP, VND uses a series of heuristics, in order of increasing complexity: 1-opt, 2-opt, 2.5-opt, Or-opt, etc. \nVariants of the 2-opt heuristic",
      tags: [],
      files: [null, null]
  },
  
]
const tags = ["test1","test2","test3", "test4", "test5", "test6", "testssdqdsqsqdssqsqddsqdsqsdqsdqsdsdsdsqdsqsdqqdsddsqsds7"]
const paperNonDOI: NonDOIPaper = {
  id: uuidv4(),
  title: "First vs best improvement: an empirical study",
  authors: [
    {family: "sds", given: "qsdqsq"},
  ],
  year: "2022",
  url: "https://www.sciencedirect.com/science/article/pii/S0166218X05003070",
  citations: citations,
  tags: tags,
  analysis: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis consectetur dolor consequat, ultricies turpis vitae, iaculis lorem. Nulla facilisi. Pellentesque feugiat porta leo eu auctor. Ut ullamcorper viverra tortor, fermentum pretium quam facilisis ac. Quisque vitae congue tellus, sed elementum tortor. Suspendisse pulvinar nec sem vel tempor. Duis suscipit tellus sed massa tincidunt tempus a ut urna. Vivamus quis neque non nulla accumsan feugiat ac auctor tortor. Vivamus vel aliquet eros."
}
const paper = await nondoipaperToGenericPaper(paperNonDOI)
export const Primary: Story = {
  args: {
    paper: paper
  },
};
