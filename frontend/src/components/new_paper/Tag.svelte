<script lang="ts">
    import AutoCompletePerso from "../form_elems/AutoCompletePerso.svelte";
    
    import TextValue from "../form_elems/TextValue.svelte";
    import IconButton, { Icon } from "@smui/icon-button";
    export let text: string = "";
    import { createEventDispatcher } from "svelte";
    const dispatch = createEventDispatcher();
    export let index: number;
    const regexTag = /^[a-zA-Z0-9_-]+$/;
    function checkInput() {
      if (regexTag.test(text)) {
        return true;
      } else {
        return false;
      }
    }
    let tags = [];
    // Make a fetch request to backend to get tags
    fetch(`http://localhost:3000/tags`)
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);
        tags = data;
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  </script>
  
  <div style="width: 100%">
    <AutoCompletePerso label="Tag" options={tags} bind:text={text}/>
    <IconButton
      class="material-icons"
      on:click={() => dispatch('remove')}>delete</IconButton
    >
  </div>
  
  <style>
    div {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
    }
  </style>
  