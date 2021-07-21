import React, {useCallback, useEffect} from 'react';
import {Button, IconButton} from '@material-ui/core';
import {Delete} from "@material-ui/icons";
import {AddItemForm} from "../../../Components/AddItemForm/AddItemForm";
import {EditableSpan} from "../../../Components/EditableSpan/EditableSpan";
import Task from "./Task/Task";
import { useSelector} from "react-redux";
import {
    FilterValuesType,
    TodolistDomainType,
} from "../todolistReducer";
import {TaskStatuses, TaskType} from "../../../api/API";
import {selectIsLoggedIn} from "../../Auth/selectors";
import {useActions} from "../../../hooks/useActions";

type PropsType = {
    todolist: TodolistDomainType
    title: string
    tasks: Array<TaskType>
    filter: FilterValuesType
    todolistId: string
}

export const Todolist = React.memo((props: PropsType) =>  {
    const isLoggedIn = useSelector(selectIsLoggedIn)

    const {fetchTasksTC, addTaskTC, updateTodolistTitleTC,deleteTodolistsTC,changeFilterAC} = useActions()

    useEffect(() => {
        if(!isLoggedIn) {
            return
        }
        fetchTasksTC(props.todolistId)
    },[])//no dependencies. runs only once when the component will render

    const addTask = useCallback((title: string) => {
        addTaskTC(title.trim(), props.todolistId)
    },[]);

    const changeTodoListTitle = useCallback((newTitle: string) => {
        updateTodolistTitleTC(props.todolistId, newTitle)
    },[props.todolistId])

    const changeFilter = useCallback((value: FilterValuesType, taskId: string) => {
            changeFilterAC({filter: value,id: taskId});
    },[])

    const removeTodolist = useCallback((id: string) => {
        deleteTodolistsTC(id)
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


