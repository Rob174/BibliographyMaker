import type { Meta, StoryObj } from "@storybook/svelte";

import DOIPaper from "./DOIPaper.svelte";

const meta = {
  title: "Window/DOIPaper",
  component: DOIPaper,
  tags: ["autodocs"],
  argTypes: {},
} satisfies Meta<DOIPaper>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/svelte/writing-stories/args
export const Primary: Story = {
  args: {},
};
