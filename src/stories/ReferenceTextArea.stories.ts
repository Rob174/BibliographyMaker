import type { Meta, StoryObj } from "@storybook/svelte";

import ReferenceTextArea from "./ReferenceTextArea.svelte";

const meta = {
  title: "Element/ReferenceTextArea",
  component: ReferenceTextArea,
  tags: ["autodocs"],
  argTypes: {},
} satisfies Meta<ReferenceTextArea>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/svelte/writing-stories/args
export const Primary: Story = {
  args: {},
};
