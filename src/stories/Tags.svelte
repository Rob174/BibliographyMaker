<script lang="ts">
  /** The list of tags fields to enter by the user
   * *@param {data}{TagType[]} the list of tags currently in the form
   * *@stores tagsPossibilities read to get the list of current tags in the database
   * *@fires change when the user change one tag for the current form, every tags of the form are send with the event
  */
  import { createEventDispatcher } from "svelte";
  import { preprocessLatexText } from "./preprocessings";
  import { tagsPossibilities, type TagType } from "../data";
  import { emptyTag } from "./libs";
  import AutocompleteInput from "./AutocompleteInput.svelte";
  import IconButton from "./IconButton.svelte";

  export let data: TagType[] = [emptyTag()];

  const dispatch = createEventDispatcher();
  let id = 0;
  let possibilities = [];
  tagsPossibilities.subscribe((p) => {
    possibilities = p;
  });

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
</script>

<div id="tags">
  {#key id}
    {#each data as d, i}
      {#key d.id}
        <AutocompleteInput
          label={`Tag ${i + 1}`}
          text={d.text}
          possibilities={possibilities.map(x=>x.text)}
          on:change={(e) => {
            const idx = data.indexOf(data.filter((x) => x.id == d.id)[0]);
            console.log("data[idx]",data)
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
                  data.push(emptyTag());
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
                  data.push(emptyTag());
                }
                dispatch("change", data);
                selectLast();
              }}
            />
            {#if i === data.length - 1}
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
            {:else}
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
            {/if}
          </svelte:fragment>
        </AutocompleteInput>
      {/key}
    {/each}
  {/key}
</div>

<style>
</style>
