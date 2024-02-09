import type { Meta, StoryObj } from "@storybook/svelte";

import NonDOIPaper from "./NonDOIPaper.svelte";

const meta = {
  title: "Window/NonDOIPaper",
  component: NonDOIPaper,
  tags: ["autodocs"],
  argTypes: {},
} satisfies Meta<NonDOIPaper>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {},
};
