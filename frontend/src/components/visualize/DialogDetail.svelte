<script lang="ts">
  import Dialog, { Header, Title, Content, Actions } from "@smui/dialog";
  import Chip, { Set, LeadingIcon, TrailingIcon, Text } from "@smui/chips";
  import IconButton from "@smui/icon-button";
  import Paper from "@smui/paper";
  import { createEventDispatcher } from "svelte";
  import { papersMetadata, tagsPoss } from "./papersData";
  import * as uuid from "uuid";
  const dispatch = createEventDispatcher();

  export let open = false;
  export let element: Paper = null;

  function closeHandler(e: CustomEvent<{ action: string }>) {
    switch (e.detail.action) {
      case "close":
        break;
    }
  }
  let selectedDone = [];
  papersMetadata.subscribe((value) => {
    if (!value.has(element.id)) return;
    selectedDone = value
      .get(element.id)
      .tags.filter((tag) => Array.from(["todo", "done"]).includes(tag))
      .filter((tag) => tag !== "todo");
  });

  $: {
    if (element !== null) {
      papersMetadata.update((value) => {
        if (!value.has(element.id)) return;
        // try to remove the tag todo
        const state = value
          .get(element.id)
          .tags.filter((tag) => Array.from(["todo", "done"]).includes(tag));
        const selection = selectedDone.length === 0 ? "todo" : selectedDone[0];
        if (state.length === 0) {
          value.get(element.id).tags.push(selection);
        } else {
          value.get(element.id).tags = value
            .get(element.id)
            .tags.filter((tag) => !Array.from(["todo", "done"]).includes(tag));
          value.get(element.id).tags.push(selection);
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
        bind:selected={selectedDone}
      >
        <Chip chip={chip1}>
          <Text>{chip1}</Text>
        </Chip>
      </Set>
    </Content>
    <Actions />
  {/if}
</Dialog>
