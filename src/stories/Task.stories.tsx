import React from 'react';
// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import { Story, Meta } from '@storybook/react/types-6-0';
import {action} from "@storybook/addon-actions";
import Task, {PropsType} from "../features/Todolists/Todolist/Task/Task";
import {ReduxStoreProviderDecorator} from "./ReduxProviderStoreDecotaror";
import {TaskPriorities, TaskStatuses} from "../api/task-api";


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
  // task: {id: '1', isDone: true, title: 'JS'},
  todolistId: 'todolistId1'
};

export const TaskIsNotDoneExample = Template.bind({});
TaskIsNotDoneExample.args = {
  ...baseArgs,
  // task: {id: '1', isDone: false, title: 'JS'},
  todolistId: 'todolistId1'
};

