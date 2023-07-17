import type { Meta, StoryObj } from "@storybook/svelte";

import TextLine from "./TextLine.svelte";

const meta = {
  title: "Element/TextLine",
  component: TextLine,
  tags: ["autodocs"],
  argTypes: {},
} satisfies Meta<TextLine>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/svelte/writing-stories/args
export const Primary: Story = {
  args: {},
};
