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
    edit,
    nodesMetadata,
    papersStore,
    paperWithDOIStore,
    paperWithoutDOIStore,
  } from "../../data";
  import Button from "@smui/button/src/Button.svelte";
  import ButtonsCitation from "./ButtonsCitation.svelte";
  const dispatch = createEventDispatcher();

  export let open = false;
  export let element: Paper;
  console.log("element", element);
  let paper_data = $papersStore.find((p) => p.id === element.id);
  export let status: "todo" | "done" = "todo";

  function closeHandler(e: CustomEvent<{ action: string }>) {
    switch (e.detail.action) {
      case "close":
        dispatch("close");
        break;
    }
  }
  let selection = [];
  $: {
    const sel = selection.length > 0 ? selection[0] : "todo";
    if (element !== null && sel !== status) {
      nodesMetadata.update((value) => {
        console.log("update 1")
        if (!value.has(element.id)) return value;
        // try to remove the tag todo
        const state = value
          .get(element.id)
          .tags.filter((tag) => Array.from(["todo", "done"]).includes(tag));
        if (state.length === 0) {
          value.get(element.id).tags.push(sel);
        } else {
          value.get(element.id).tags = value
            .get(element.id)
            .tags.filter((tag) => !Array.from(["todo", "done"]).includes(tag));
          value.get(element.id).tags.push(sel);
        }
        return value;
      });
    }
  }
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
      <Title id="fullscreen-title">{element.bibtex.title}</Title>
      <IconButton
        action="close"
        class="material-icons"
        on:click={() => dispatch("close")}
      >
        close
      </IconButton>
    </Header>
    <Content id="fullscreen-content">
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
      <Set
        chips={["done"]}
        let:chip={chip1}
        filter
        bind:selected={selection}
        on:SMUIChips:selection={(e) => {
          console.log(e.detail);
          selection = e.detail.selected;
        }}
      >
        <Chip chip={chip1}>
          <Text>{chip1}</Text>
        </Chip>
      </Set>
      <Button
        on:click={() => {
          const msg = edit(paper_data);
          clickedSnackStore.set("See " + msg);
          activeTabStore.set("")
          activeTabStore.set(msg)
        }}
        style="width:100%; margin-top:2em;"
        variant="raised"
      >
        Edit
      </Button>
      <ButtonsCitation paper={paper_data} />
    </Content>
    <Actions />
  {/if}
</Dialog>

<!-- bind:selected={selectedDone} -->
