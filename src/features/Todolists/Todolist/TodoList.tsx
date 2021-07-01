import React, {useCallback, useEffect} from 'react';
import {Button, IconButton} from '@material-ui/core';
import {Delete} from "@material-ui/icons";
import {AddItemForm} from "../../../Components/AddItemForm/AddItemForm";
import {EditableSpan} from "../../../Components/EditableSpan/EditableSpan";
import Task from "./Task/Task";
import {useDispatch, useSelector} from "react-redux";
import {addTaskTC, fetchTasksTC} from "../tasksReducer";
import {
    changeFilterAC,
    deleteTodolistsTC,
    FilterValuesType,
    TodolistDomainType,
    updateTodolistTitleTC
} from "../todolistReducer";
import {TaskStatuses, TaskType} from "../../../api/API";
import {AppRootStateType} from "../../../app/store";

type PropsType = {
    todolist: TodolistDomainType
    title: string
    tasks: Array<TaskType>
    filter: FilterValuesType
    todolistId: string
}

export const Todolist = React.memo((props: PropsType) =>  {
    const isLogged = useSelector<AppRootStateType, boolean>(state => state.auth.isLoggedIn)
    const dispatch = useDispatch()

    useEffect(() => {
        if(!isLogged) {
            return
        }
        dispatch(fetchTasksTC(props.todolistId))
    },[])//no dependencies. runs only once when the component will render

    const addTask = useCallback((title: string) => {
        dispatch(addTaskTC(title.trim(), props.todolistId))
    },[dispatch]);
    const changeTodoListTitle = useCallback((newTitle: string) => {

        dispatch(updateTodolistTitleTC(props.todolistId, newTitle))
    },[dispatch, props.todolistId])

    const changeFilter = useCallback((value: FilterValuesType, taskId: string) => {
        dispatch(changeFilterAC({filter: value,id: taskId}));
    },[dispatch])

    const removeTodolist = useCallback((id: string) => {
        dispatch(deleteTodolistsTC(id))
    },[])

    const onAllClickHandler = useCallback(() => {
        changeFilter("all", props.todolistId)
    },[]);
    const onActiveClickHandler = useCallback(() => {
        changeFilter("active", props.todolistId)
    },[]);
    const onCompletedClickHandler = useCallback(() => {
        changeFilter("completed", props.todolistId)
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
                     todolistId={props.todolistId}
        />
    })

    const statusLoading = props.todolist.entityStatus === 'loading'

    return <div>
        <div className='title__wrapper'>
            <EditableSpan value={props.title} onChange={changeTodoListTitle} disabled={statusLoading}/>
            <IconButton onClick={() => removeTodolist(props.todolistId)} disabled={statusLoading}>
                <Delete/>
            </IconButton>
        </div>
        <AddItemForm addItem={addTask} disabled={statusLoading}/>
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


