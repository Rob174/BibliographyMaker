<script lang="ts">
  import Textfield from "@smui/textfield";
  import Icon from "@smui/textfield/icon";
  import HelperText from "@smui/textfield/helper-text";
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
</script>

<div {style}>
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
    on:focus={() => (focused = true)}
    on:blur={() => (focused = false)}
    withTrailingIcon={!disabled}
  >
    <HelperText validationMsg slot="helper">
      That's not a valid input.
    </HelperText>
  </Textfield>
</div>

<style>
</style>
