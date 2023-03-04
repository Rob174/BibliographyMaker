<script lang="ts">
  import Button from "@smui/button";
  import { clean } from "../../api/delete";
  import { createEventDispatcher } from "svelte";
  import MultilineFormatDel from "./InputLists/Inputs/MultilineButtons.svelte";
  import MultilineFormatDelList from "./InputLists/MultilineFormatDelList.svelte";
  import AutocompleteButList from "./InputLists/AutocompleteButList.svelte";
  import { tagsStore } from "../../data";

  const dispatch = createEventDispatcher();

  export let relevantTexts: string[] = [""];
  export let tags: string[] = [""];
  export let analysisText: string = "";
  export let save = (relevantTexts, tags, analysis) => {};
  let refreshPossValues = true;
  let errorMsg = "";
  export function setErrorMsg(msg: string) {
    errorMsg = msg;
    setTimeout(() => {
      errorMsg = "";
    }, 2000);
    return;
  }
  let exitingTags: string[] = [];
  tagsStore.subscribe((value) => {
    exitingTags = value.map((tag) => tag.name);
    refreshPossValues = !refreshPossValues;
  });
</script>

<!-- Following fields are required: doi, relevant texts (add function possible), tags (function add possible) -->
<div class="main">
  <h1>New Paper</h1>
  <Button
    style="width:100%; margin-bottom:2em;"
    variant="raised"
    on:click={() => clean(setErrorMsg)}>Clear all papers</Button
  >
  <div class="form">
    <slot />
    <MultilineFormatDelList
      label="Relevant Texts"
      bind:texts={relevantTexts}
      formatAction={(text) => text.replace("\n", " ")}
    />
    <AutocompleteButList
      label="Tags"
      bind:texts={tags}
      possibleValues={exitingTags}
      formatAction={(text) => text.replace(" ", "")}
    />
    <!-- Analysis Text -->
    <div class="analysis">
      <MultilineFormatDel
        label="Analysis Text"
        bind:text={analysisText}
        buttons={[]}
        on:format={() => {
          analysisText = analysisText.replace("\n", " ");
        }}
      />
    </div>
    <Button
      style="width:100%; margin-top:2em;"
      variant="raised"
      on:click={() => {
        dispatch("save");
      }}>Save</Button
    >
    <Button
      style="width:100%; margin-top:2em;"
      variant="raised"
      on:keydown={(e) => {
        if (!(e instanceof KeyboardEvent)) return;
        if (e.key === "Tab") {
          e.preventDefault();
          document.querySelectorAll("input")[0].focus();
        }
      }}
      on:click={() => {
        dispatch("clearFields");
        // Focus first input field
        setTimeout(() => {
          document.querySelectorAll("input")[0].focus();
        }, 100);
      }}>Clear</Button
    >
    {#if errorMsg !== ""}
      <p style="color:red;">{errorMsg}</p>
    {/if}
    <span style="margin-top: 10vh" />
  </div>
</div>

<style>
  h1 {
    color: grey;
  }
  .form {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
  }
  .main {
    margin: 2em;
    width: calc(100%-2em);
  }
  .form {
    width: 100%;
  }

  .analysis {
    display: flex;
    flex-direction: row;
    align-items: center;
    width: 100%;
    color: white;
  }
</style>
