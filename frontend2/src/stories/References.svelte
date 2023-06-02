<script lang="ts">
  import ReferenceTextArea from "./ReferenceTextArea.svelte";
  import IconButton from "./IconButton.svelte";
  import { preprocessLatexText } from "./preprocessings";
  import { v4 as uuidv4 } from "uuid";
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();
  export let tags: string[] = ["test1", "test2"];
  export let data = [emptyText()];
  export function emptyText() {
    return {
      id: uuidv4(),
      text: "",
      tags: [],
      files: [],
    };
  }
  function selectLast() {
    setTimeout(() => {
      const x = document.querySelectorAll("#references textarea");
      x[x.length - 1].focus();
    }, 100);
  }
  function selectI(i) {
    setTimeout(() => {
      const x = document.querySelectorAll("#references textarea");
      x[i].focus();
    }, 100);
  }
  let id = 0;
  let selectedId= -1;
</script>

<div id="references">
  {#key id}
    {#each data as d, i}
      <ReferenceTextArea
        label={`§${i + 1}`}
        text={d.text}
        attachedElements={d.tags}
        options={tags.filter((x) => x !== "")}
        on:change={(e) => {
          const idx = data.indexOf(data.filter((x) => x.id == d.id)[0]);

          data[idx].text = e.detail.text;
          data[idx].tags = e.detail.attached;
          dispatch("change", data);
        }}
      >
        <IconButton
          iconName="add"
          on:change={(e) => {
            data.push(emptyText());
            dispatch("change", data);
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
            data[idx].text = preprocessLatexText(data[idx].text);
            dispatch("change", data);
            selectI(idx);
          }}
        />
        <IconButton
          iconName="image"
          on:change={(e) => {
            document.querySelector("#load-file").click();
            selectedId = d.id;
          }}
        />
        <input
          id="load-file"
          type="file"
          accept="image/*"
          style="display: none;"
          on:change={(e) => {
            const idx = data.findIndex((x) => x.id === selectedId);
            console.log("inserting in index ",idx, data.map(x=>x.id), selectedId)
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onload = (e) => {
              const imageSrc = e.target.result;
              data[idx].files = [imageSrc];
              dispatch("change", data);
              selectI(idx);
            };
            reader.readAsDataURL(file);
          }}
        />
      </ReferenceTextArea>
    {/each}
  {/key}
</div>

<style>
</style>
