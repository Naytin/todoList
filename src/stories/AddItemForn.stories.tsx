import React from 'react';
// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import { Story, Meta } from '@storybook/react/types-6-0';
import {AddItemForm, PropsType} from '../Components/AddItemForm/AddItemForm';
import {action} from "@storybook/addon-actions";


export default {
  title: 'TodoList/AddItemForm',
  component: AddItemForm,
  argTypes: {
    onClick: {
      description: 'Button inside form clicked'
    }
  },
} as Meta;

const asyncCallback = async (...params: any[]) => {
  action('Button inside form clicked')(...params)
}

export const Template: Story<PropsType> = (args) => <AddItemForm addItem={asyncCallback} />;

// export const AddItemFormExample = Template.bind({});
//
// AddItemFormExample.args = {
//   addItem: action('Button inside form clicked')
// };

