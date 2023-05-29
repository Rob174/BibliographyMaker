import type { Meta, StoryObj } from "@storybook/svelte";

import TextArea from "./TextArea.svelte";

const meta = {
  title: "TextArea",
  component: TextArea,
  tags: ["autodocs"],
  argTypes: {},
} satisfies Meta<TextArea>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/svelte/writing-stories/args
export const Primary: Story = {
  args: {},
};
