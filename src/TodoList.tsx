import React, {ChangeEvent, KeyboardEvent, useState} from 'react';
import {FilterValuesType} from './App';
import {IconButton, Button, Checkbox} from '@material-ui/core';
import {Delete} from "@material-ui/icons";
import {AddItemForm} from "./Components/EditableSpan";
import {EditableSpan} from "./Components/AddItemForm";

export type TaskType = {
    id: string
    title: string
    isDone: boolean
}

type PropsType = {
    title: string
    tasks: Array<TaskType>
    removeTask: (id: string, taskId: string) => void
    changeFilter: (value: FilterValuesType, taskId: string) => void
    addTask: (title: string, taskId: string) => void
    changeTaskStatus: (id: string, isDone: boolean, taskId: string) => void
    filter: FilterValuesType
    id: string
    removeTodolist: (id: string) => void
    changeTaskTitle: (id: string, newTitle: string, taskId: string) => void
    changeTodoTitle: (todoTitle: string, taskId: string) => void
}

export function Todolist(props: PropsType) {

    const addTask = (title: string) => props.addTask(title.trim(), props.id);
    const changeTodoListTitle = (newTitle: string) => {
        props.changeTodoTitle(newTitle, props.id)
    }
    const onAllClickHandler = () => props.changeFilter("all", props.id);
    const onActiveClickHandler = () => props.changeFilter("active", props.id);
    const onCompletedClickHandler = () => props.changeFilter("completed", props.id)

    return <div>
        <div className='title__wrapper'>
            <EditableSpan value={props.title} onChange={changeTodoListTitle}/>
            <IconButton onClick={() => props.removeTodolist(props.id)}><Delete/></IconButton>
        </div>
        <AddItemForm addItem={addTask}/>
        <div>
            {
                props.tasks.map(t => {
                    const removeTask = () => props.removeTask(t.id, props.id)
                    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
                        props.changeTaskStatus(t.id, e.currentTarget.checked, props.id);
                    }
                    const changeTaskTitle = (newTitle: string) => {
                        props.changeTaskTitle(t.id, newTitle, props.id);
                    }
                    return <div key={t.id} className={t.isDone ? "task__wrapper is-done" : "task__wrapper"}>
                        <Checkbox color='primary'  onChange={onChangeHandler} checked={t.isDone}/>
                        <EditableSpan value={t.title} onChange={changeTaskTitle}/>
                        <IconButton onClick={removeTask}><Delete/></IconButton>
                    </div>
                })
            }
        </div>
        <div>
            <Button variant='outlined' color={props.filter === 'all' ? "secondary" : "primary"} size='small'
                    onClick={onAllClickHandler}>All
            </Button>
            <Button variant='outlined' color={props.filter === 'active' ? "secondary" : "primary"} size='small'
                    onClick={onActiveClickHandler}>Active
            </Button>
            <Button variant='outlined' color={props.filter === 'completed' ? "secondary" : "primary"} size='small'
                    onClick={onCompletedClickHandler}>Completed
            </Button>
        </div>
    </div>
}


