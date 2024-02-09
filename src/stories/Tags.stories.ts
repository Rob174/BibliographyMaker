import type { Meta, StoryObj } from "@storybook/svelte";

import Tags from "./Tags.svelte";

const meta = {
  title: "Composed/Tags",
  component: Tags,
  tags: ["autodocs"],
  argTypes: {},
} satisfies Meta<Tags>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/svelte/writing-stories/args
export const Primary: Story = {
  args: {},
};
