import type { Meta, StoryObj } from "@storybook/svelte";

import Window from "./Window.svelte";

const meta = {
  title: "Window/Window",
  component: Window,
  tags: ["autodocs"],
  argTypes: {},
} satisfies Meta<Window>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/svelte/writing-stories/args
export const Primary: Story = {
  args: {},
};
