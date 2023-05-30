<script lang="ts">
  import AutocompleteInput from "./AutocompleteInput.svelte";
  import IconButton from "./IconButton.svelte";
  import { v4 as uuidv4 } from "uuid";
  import { createEventDispatcher } from "svelte";
  import { preprocessLatexText } from "./preprocessings";
  const dispatch = createEventDispatcher();
  let data = [emptyText()];
  function emptyText() {
    return {
      id: uuidv4(),
      text: "",
      obj: null,
    };
  }
  function selectLast() {
    setTimeout(() => {
      const x = document.querySelectorAll("#tags input");
      x[x.length - 1].focus();
    }, 100);
  }
  function selectI(i) {
    setTimeout(() => {
      const x = document.querySelectorAll("#tags input");
      x[i].focus();
    }, 100);
  }
  let id = 0;
  export let possibilities = ["test", "test1", "hjj"];
  console.log();
</script>

<div id="tags">
  {#key id}
    {#each data as d, i}
      {#key d.id}
        <AutocompleteInput
          label={`Tag ${i + 1}`}
          text={d.text}
          {possibilities}
          on:change={(e) => {
            const idx = data.indexOf(data.filter((x) => x.id == d.id)[0]);

            data[idx].text = e.detail;
            console.log(data[idx]);
            dispatch("change", data);
          }}
        >
          <svelte:fragment slot="after">
            <IconButton
              iconName="add"
              on:change={(e) => {
                const idx = data.indexOf(data.filter((x) => x.id == d.id)[0]);
                if (data[idx].text.trim() !== "") {
                  data.push(emptyText());
                  dispatch("change", data);
                }
                selectLast();
                id++;
              }}
            />
            <IconButton
              iconName="delete"
              on:change={(e) => {
                data = data.filter((x) => x.id !== d.id);
                console.log(data);
                if (data.length == 0) {
                  data.push(emptyText());
                }
                dispatch("change", data);
                selectLast();
              }}
            />
            <IconButton
              iconName="cleaning_services"
              on:change={(e) => {
                const idx = data.indexOf(data.filter((x) => x.id == d.id)[0]);
                console.log(data[idx].text);
                data[idx].text = preprocessLatexText(data[idx].text);
                dispatch("change", data);
                selectI(idx);
              }}
            />
          </svelte:fragment>
        </AutocompleteInput>
      {/key}
    {/each}
  {/key}
</div>

<style>
</style>
