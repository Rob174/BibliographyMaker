import type { Meta, StoryObj } from "@storybook/svelte";

import AutocompleteInput from "./AutocompleteInput.svelte";

const meta = {
  title: "AutocompleteInput",
  component: AutocompleteInput,
  tags: ["autodocs"],
} satisfies Meta<AutocompleteInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    label: "Test",
    possibilities: ["test1","test2","patate"]
  },
};
