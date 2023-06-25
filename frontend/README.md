# BibliographyMaker

## Goal

When doing a litterature review, we have a goal in mind, for instance which deep learning architecture is used to tackle autonomous vehicles. However additionnal informations are also interesrting to extract at the same time: for instance is there an easy access to a github repository in the paper? Is this architecture achieving good results? In which category of architecture this architecture belongs?

These informations can be gathered in a text file format. However organizing them takes a long time and is error proned. It is easy to loose the url to a paper. Citations of the papers would be ideal to be sure of the information originally said in the paper. However it is fastidious to find the extracted text that is relevant for a specific goal of our litterature review.

Moreover there are technical limitations: often a screenshot of the paper diagram or equation would be the most relevant information


On the other side we can see that there are separated tools that can solve these problems: it is easy to do a form with keyboard controls and shortcuts to quickly enter and save informations. Crossref offers doi to bibtex services. Graphviz offer the possibility to visualize data as graphs.

This is why the current project has form main goal to provide an interface to make a litterature review from papers quicker by providing
- quick forms to enter references to the paper (by doi or not), citations as text or image and associate tags to each citation
- visualize the papers as graph given 
  - as a hierarchy based around the tags entered
  - as tables to count the number of papers of each category
- a quick way to find, cite and jump to the url of the original paper

## Dev - Getting started

1. Install nodejs
2. Clone this repository (I assume already done if you are here 😋)
3. Cd in frontend2 & `npm install`
4. `npm run storybook`
5. It should open storybook at localhost:6006 automatically 
6. See [documentation](./doc/svelte_doc.md)

## Elements of svelte used inside this project

Relevant extract of the interactive svelte documentation for this project

- [svelte events](https://svelte.dev/tutorial/component-events)
- [svelte stores](https://svelte.dev/tutorial/writable-stores)
- [svelte bindings](https://svelte.dev/repl/c233f0db93fa4f3ba3f503fefd6faa7d?version=3.16.0) --> maybe find a better source
- [lifecycle](https://svelte.dev/tutorial/onmount)
- [slots](https://svelte.dev/tutorial/slots) & [named slots](https://svelte.dev/tutorial/named-slots)
- [conditionnaly show elements & loops](https://svelte.dev/tutorial/if-blocks)


## Guidelines (to be discussed)

### Import formats order

(every element is optional, we want to demonstrate the order if all possible types of imports are used)

1. The svelte specific imports
```ts
import { createEventDispatcher, onMount } from "svelte";
```
2. External libraries imports
```ts
import { v4 as uuidv4 } from "uuid";
```
3. Typescripts files of the project imports
```ts
import {
doiPaperStore,
paperStore,
type DOIPaper,
type TagType,
} from "../data";
import { emptyTag, insertDOIPaper } from "./libs";
```
4. Components of the project imports
```ts
import Paper from "./Paper.svelte";
import TextLine from "./TextLine.svelte";
import Button from "./Button.svelte";
```

### Organization of a svelte file

(every element except the doc and html elements is optional: here we want to demonstrate the full example with the order of the elements)

```html
<script lang="ts">
  /** My documentation general description....
   * *@param {param1}{type} description...
   * *...
   * *@fires nameSvelteEvent data provided with the event (skip if no data), event svelte fired (dispatch("nameEvent", data))
   * *...
   * *@stores nameStore access (read/write) why this store is used here (accessory: why not passed the arguments as parameters)
   */
  // 1. Imports
   import ....
   ...
    // 2. parameters 
    export let param1: type1 = valueByDefault;
    ...

    // 3. variables & event dispatcher
    let var1: type1 = valueByDefault;
    let var2: type2 = valueByDefault;
    ...

    // 4. Stores subscriptions
    myStore1.subscribe(x=>var1=x) // Example to read a store value
    ...

    // 5. functions
    function function1(param1: type1, param2: type2): type3 {
      //...
      return value;
    }
    // 6. Mount event
  onMount(() => {
    // on first creation of the component do something...
  });
</script>

<-- HTML & svelte components --!>

<style>
<-- CSS styling of the component --!>
</style>

```

## Architecture

![](./architecture.png)

(To modify modify and rerender the architecture.dot with graphviz online)