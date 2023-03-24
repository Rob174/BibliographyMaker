<script lang="ts">
  import Dialog, { Header, Title, Content, Actions } from "@smui/dialog";
  import Chip, { Set, TrailingIcon, Text } from "@smui/chips";
  import IconButton from "@smui/icon-button";
  import Paper from "@smui/paper";
  import { createEventDispatcher } from "svelte";
  import * as uuid from "uuid";
  import {
    activeTabStore,
    clickedSnackStore,
    countDoneStore,
    updateCountDone,
    edit,
    nodesMetadata,
    papersStore,
    paperWithDOIStore,
    paperWithoutDOIStore,
  } from "../../data";
  import Button from "@smui/button/src/Button.svelte";
  import ButtonsCitation from "./ButtonsCitation.svelte";
  import { onMount } from "svelte";
  const dispatch = createEventDispatcher();

  export let open = false;
  export let element: Paper;
  let paper_data = $papersStore.find((p) => p.id === element.id);
  export let status: "todo" | "done" = "todo";

  function closeHandler(e: CustomEvent<{ action: string }>) {
    switch (e.detail.action) {
      case "close":
        dispatch("close");
        break;
    }
  }
  let selection = status === "todo" ? [] : ["done"];
  onMount(() => {
    selection = $nodesMetadata.get(element.id).tags.includes("done") ? ["done"] : [];
  });
</script>

<Dialog
  bind:open
  fullscreen
  aria-labelledby="fullscreen-title"
  aria-describedby="fullscreen-content"
  on:SMUIDialog:closed={closeHandler}
>
  {#if element !== null}
    <Header>
      <Title id="fullscreen-title" style="word-wrap: break-word; width: 90%;"
        >{element.bibtex.title}</Title
      >
      <IconButton
        action="close"
        class="material-icons"
        on:click={() => dispatch("close")}
      >
        close
      </IconButton>
    </Header>
    <Content id="fullscreen-content">
      <div>Abreviation: {element.citation}</div>
      <div>DOI: {element.bibtex.DOI}</div>
      <div>
        <!-- Link opened in a new tab -->
        Link:
        <a href={element.bibtex.URL} target={uuid.v4()}>{element.bibtex.URL}</a>
      </div>
      <div>
        Tags:
        <Set chips={element.tags} let:chip>
          <Chip {chip} shouldRemoveOnTrailingIconClick={false}>
            <Text>{chip}</Text>
          </Chip>
        </Set>
      </div>
      <div>Relevant texts</div>
      {#each element.relevant_text as t}
        <Paper variant="outlined" style={"margin: 1em 2em; padding: 0em;"}>
          <Content style="padding: 1em;">
            {t}
          </Content>
        </Paper>
      {/each}
      {#if element.analysis !== ""}
        <div>Analysis</div>
        <div>{element.analysis}</div>
      {/if}
      <Set chips={["done"]} let:chip={chip1} filter bind:selected={selection}>
        <Chip
          chip={chip1}
          on:SMUIChip:selection={(e) => {
            nodesMetadata.update((value) => {
              if (!value.has(element.id)) return value;
              // try to remove the tag todo
              const pties = value.get(element.id);
              const state = pties
                .tags.filter((tag) =>
                  !Array.from(["todo", "done"]).includes(tag)
                );
              const toAdd = e.detail.selected ? "done" : "todo";
              console.log("toAdd", toAdd)
              state.push(toAdd);
              pties.tags = state;
              value.set(element.id, pties);
              console.log("pties", pties);
              return value;
            });
            
            updateCountDone();
          }}
        >
          <Text>{chip1}</Text>
        </Chip>
      </Set>
      <Button
        on:click={() => {
          console.log("Edit");
          const msg = edit(paper_data);
          clickedSnackStore.set("See " + msg);
          console.log("activeTabStore", $activeTabStore);
          activeTabStore.set("");
          console.log("activeTabStore", $activeTabStore);
          activeTabStore.set(msg);
          console.log("activeTabStore", $activeTabStore);
        }}
        style="width:100%; margin-top:2em;"
        variant="raised"
      >
        Edit
      </Button>
      <ButtonsCitation paper={paper_data} />
      <Button
        on:click={() => {
          // Copy in clipboard the ID of the paper
          navigator.clipboard.writeText(paper_data.id);
        }}
        style="width:100%; margin-top:2em;"
        variant="raised"
      >
        Get ID in JSON
      </Button>
    </Content>
    <Actions />
  {/if}
</Dialog>

<!-- bind:selected={selectedDone} -->
