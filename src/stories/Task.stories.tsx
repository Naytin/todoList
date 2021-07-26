import React from 'react';
// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import { Story, Meta } from '@storybook/react/types-6-0';
import {action} from "@storybook/addon-actions";
import Task, {PropsType} from "../features/Todolists/Todolist/Task/Task";
import {ReduxStoreProviderDecorator} from "./ReduxProviderStoreDecotaror";

export default {
  title: 'TodoList/Task',
  component: Task,
  decorators: [ReduxStoreProviderDecorator]
} as Meta;

const changeTaskTitleCallback = action('Title changed inside Task')
const changeTaskStatusCallback = action('Status changed inside Task')
const removeTaskCallback = action('Remove Button inside Task clicked')

const Template: Story<PropsType> = (args) => <Task {...args} />;

const baseArgs = {
  changeTaskStatus: changeTaskStatusCallback,
  changeTaskTitle: changeTaskTitleCallback,
  removeTask: removeTaskCallback
}

export const TaskIsDoneExample = Template.bind({});
TaskIsDoneExample.args = {
  ...baseArgs,
  task: {
    description: '',
    title: 'JS',
    status: 1,
    priority: 1,
    startDate: '',
    deadline: '',
    id: '01e4e3f5-0973-4933-aaf5-b7e6bdfe8252',
    todoListId: '1',
    order: 1,
    addedDate: '',
  },
  todolistId: '01e4e3f5-0973-4933-aaf5-b7e6bdfe8252'
};

export const TaskIsNotDoneExample = Template.bind({});
TaskIsNotDoneExample.args = {
  ...baseArgs,
  task: {
    description: '',
    title: 'JS',
    status: 2,
    priority: 1,
    startDate: '',
    deadline: '',
    id: '01e4e3f5-0973-4933-aaf5-b7e6bdfe8252',
    todoListId: '1',
    order: 1,
    addedDate: '',
  },
  todolistId: '01e4e3f5-0973-4933-aaf5-b7e6bdfe8252'
};



