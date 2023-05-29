import type { Meta, StoryObj } from "@storybook/svelte";

import IconButton from "./IconButton.svelte";

const meta = {
  title: "IconButton",
  component: IconButton,
  tags: ["autodocs"],
  argTypes: {},
} satisfies Meta<IconButton>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/svelte/writing-stories/args
export const Primary: Story = {
  args: {},
};
