import React, {useCallback, useEffect} from 'react';
import {FilterValuesType} from './App';
import {Button, IconButton} from '@material-ui/core';
import {Delete} from "@material-ui/icons";
import {AddItemForm} from "./Components/AddItemForm";
import {EditableSpan} from "./Components/EditableSpan";
import Task from "./Components/Task";
import {useDispatch} from "react-redux";
import {addTaskTC, fetchTasksTC} from "./state/tasksReducer";
import {changeFilterAC, deleteTodolistsTC, updateTodolistTitleTC} from "./state/todolistReducer";
import {TaskStatuses, TaskType} from "./api/task-api";

type PropsType = {
    title: string
    tasks: Array<TaskType>
    filter: FilterValuesType
    id: string
}

export const Todolist = React.memo((props: PropsType) =>  {
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(fetchTasksTC(props.id))
    },[])

    const addTask = useCallback((title: string) => {
        dispatch(addTaskTC(title.trim(), props.id))
    },[dispatch]);
    const changeTodoListTitle = useCallback((newTitle: string) => {

        dispatch(updateTodolistTitleTC(props.id, newTitle))
    },[dispatch, props.id])

    const changeFilter = useCallback((value: FilterValuesType, taskId: string) => {
        dispatch(changeFilterAC(value, taskId));
    },[])

    const removeTodolist = useCallback((id: string) => {
        dispatch(deleteTodolistsTC(id))
    },[])

    const onAllClickHandler = useCallback(() => {
        changeFilter("all", props.id)
    },[]);
    const onActiveClickHandler = useCallback(() => {
        changeFilter("active", props.id)
    },[]);
    const onCompletedClickHandler = useCallback(() => {
        changeFilter("completed", props.id)
    },[])


    let allTodoLists = props.tasks;
    let tasksForTodolist = allTodoLists
    if (props.filter === "active") {
        tasksForTodolist = allTodoLists.filter(t => t.status === TaskStatuses.New);
    }
    if (props.filter === "completed") {
        tasksForTodolist = allTodoLists.filter(t => t.status === TaskStatuses.Completed);
    }

    const task =  tasksForTodolist.map(t => {
        return <Task key={t.id}
                     task={t}
                     todolistId={props.id}
        />
    })

    return <div>
        <div className='title__wrapper'>
            <EditableSpan value={props.title} onChange={changeTodoListTitle}/>
            <IconButton onClick={() => removeTodolist(props.id)}><Delete/></IconButton>
        </div>
        <AddItemForm addItem={addTask}/>
        <div>
            {
                task
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
})


