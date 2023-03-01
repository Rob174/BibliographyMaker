<script lang="ts">
  import Textfield from "@smui/textfield";
  import Icon from "@smui/textfield/icon";
  import HelperText from "@smui/textfield/helper-text";
  import { v4 as uuidv4 } from "uuid";
  import { createEventDispatcher } from "svelte";
  import { onMount } from "svelte";
  export let focused = false;
  export let value: string | null = null;
  let dirty = false;
  let invalid = false;
  $: disabled = focused || !value || !dirty || invalid;
  export let style: string = "width: 100%;";
  export let label: string = "";
  export let checker: (value: string) => boolean = () => true;
  
  let textField;
  onMount(() => {
    if (focused) textField.focus();
  });
  export let className = "";
  const dispatch = createEventDispatcher();
  let uniqClass = "a" + uuidv4().replace(/-/g, "").slice(0, 10);
</script>

<div {style} class={className+" "+uniqClass}>
  <!--
      Note: when you bind to `invalid`, but you only want to
      monitor it instead of updating it yourself, you also
      should include `updateInvalid`.
    -->
  <Textfield
    bind:this={textField}
    bind:dirty
    bind:invalid
    updateInvalid
    bind:value
    {label}
    {style}
    on:focus={() => {
      focused = true;
      // put cursor at end of text
      const i = document.querySelectorAll("." + uniqClass + " input")[0];
      if (i instanceof HTMLInputElement)
        setTimeout(() => {
          i.setSelectionRange(value.length, value.length);
        }, 100);
    }}
    on:blur={() => (focused = false)}
    withTrailingIcon={!disabled}
    on:keydown={(e) => {
      dispatch("keydown", e);
      if(!checker(e))
        e.preventDefault();
    }}
  >
    <HelperText validationMsg slot="helper">
      That's not a valid input.
    </HelperText>
  </Textfield>
</div>

<style>
</style>
