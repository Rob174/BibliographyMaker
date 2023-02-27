<script lang="ts">
  import Autocomplete from "@smui-extra/autocomplete";
  import { Text } from "@smui/list";
  import Button, { Label } from "@smui/button";
  import Dialog, { Title, Content, Actions } from "@smui/dialog";
  import Textfield from "@smui/textfield";


  let dialogOpen = false;
  export let options = [];
  let newLabel = "";

  let value: string | undefined = undefined;
  export let text = "";

  function addObject() {
    options = [...options, newLabel];
    value = newLabel;
    dialogOpen = false;
  }
  export let label = "";
</script>

<div style="width:100%">
  <Autocomplete
    {options}
    bind:text={text}
    bind:value
    noMatchesActionDisabled={false}
    on:SMUIAutocomplete:noMatchesAction={() => {
      newLabel = text;
      dialogOpen = true;
    }}
    label={label}
    style="width: 100%; margin-bottom: 1em;"
    class="autocomplete"
  >
    <div slot="no-matches">
      <Text>Add item</Text>
    </div>
  </Autocomplete>

  <Dialog
    bind:open={dialogOpen}
    aria-labelledby="autocomplete-dialog-title"
    aria-describedby="autocomplete-dialog-content"
  >
    <!-- Title cannot contain leading whitespace due to mdc-typography-baseline-top() -->
    <Title id="autocomplete-dialog-title">New Item</Title>
    <Content id="autocomplete-dialog-content">
      <Textfield bind:value={newLabel} label="Label" />
    </Content>
    <Actions>
      <Button>
        <Label>Cancel</Label>
      </Button>
      <Button on:click={addObject}>
        <Label>Add</Label>
      </Button>
    </Actions>
  </Dialog>
</div>

<style>
  :global(.autocomplete label) {
    width: 100%;
  }
</style>
