import type { Meta, StoryObj } from "@storybook/svelte";

import BooleanButton from "./BooleanButton.svelte";

const meta = {
  title: "Element/BooleanButton",
  component: BooleanButton,
  tags: ["autodocs"],
} satisfies Meta<BooleanButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    label: "Test",
  },
};
