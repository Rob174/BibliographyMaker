import type { Meta, StoryObj } from "@storybook/svelte";

import References from "./References.svelte";

const meta = {
  title: "Composed/References",
  component: References,
  tags: ["autodocs"],
  argTypes: {},
} satisfies Meta<References>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/svelte/writing-stories/args
export const Primary: Story = {
  args: {},
};
