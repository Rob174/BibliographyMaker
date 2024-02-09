import type { Meta, StoryObj } from "@storybook/svelte";

import Paper from "./Paper.svelte";

const meta = {
  title: "Window/Paper",
  component: Paper,
  tags: ["autodocs"],
  argTypes: {},
} satisfies Meta<Paper>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/svelte/writing-stories/args
export const Primary: Story = {
  args: {},
};
