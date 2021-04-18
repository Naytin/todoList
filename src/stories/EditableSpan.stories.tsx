import React from 'react';
// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import { Story, Meta } from '@storybook/react/types-6-0';
import {EditableSpan, PropsType} from '../Components/EditableSpan';
import {action} from "@storybook/addon-actions";


export default {
  title: 'TodoList/EditableSpan',
  component: EditableSpan,
  argTypes: {
    onChange: {
      description: 'Value EditableSPan changed'
    },
    value: {
      defaultValue: 'CSS',
      description: 'Start value EditableSpan'
    }
  },
} as Meta;

const Template: Story<PropsType> = (args) => <EditableSpan {...args} />;

export const EditableSpanExample = Template.bind({});
EditableSpanExample.args = {
  onChange: action('value EditableSpan changed')
};

