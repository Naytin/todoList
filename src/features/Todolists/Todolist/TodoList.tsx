import React, {useCallback, useEffect} from 'react';
import {Button, IconButton} from '@material-ui/core';
import {Delete} from "@material-ui/icons";
import {AddItemForm} from "../../../Components/AddItemForm/AddItemForm";
import {EditableSpan} from "../../../Components/EditableSpan/EditableSpan";
import Task from "./Task/Task";
import {changeFilterAC, FilterValuesType, TodolistDomainType,} from "../../../store/reducers/todolistReducer";
import {TaskStatuses, TaskType} from "../../../api/API";
import style from './TodoList.module.scss'
import {useAppSelector} from "../../../hooks/useAppSelector";
import {useActions} from "../../../hooks/useActions";
import {taskAsyncActions, todolistAsyncActions} from "../../../store/actionCreators";
import {useAppDispatch} from "../../../store/store";

type PropsType = {
    todolist: TodolistDomainType
    title: string
    tasks: Array<TaskType>
    filter: FilterValuesType
    todolistId: string
}

export const Todolist = React.memo((props: PropsType) => {

    const isLogged = useAppSelector(state => state.auth.isLoggedIn)
    const status = useAppSelector(state => state.app.status)
    const {updateTodolistTitle, removeTodolist} = useActions(todolistAsyncActions)
    const {fetchTasks} = useActions(taskAsyncActions)
    const {addTask} = taskAsyncActions

    const dispatch = useAppDispatch()

    useEffect(() => {
        if (!isLogged) {
            return
        }
        fetchTasks(props.todolistId)
    }, [])//no dependencies. runs only once when the component will render

    const addTaskHandler = useCallback(async (title: string) => {
        let action = await dispatch(addTask({title: title.trim(), todolistId: props.todolistId}))
        //@ts-ignore
        if (addTask.rejected.match(action)) {
            if (action.payload?.fieldsErrors?.length) {
                const error = action.payload?.fieldsErrors[0]
                throw new Error(error.error)
            }else {
                throw new Error('Some error occurred')
            }
        }
    }, []);

    const changeTodoListTitle = useCallback((title: string) => {
        updateTodolistTitle({todolistId: props.todolistId, title})
    }, [props.todolistId])

    const changeFilter = useCallback((value: FilterValuesType, taskId: string) => {
        dispatch(changeFilterAC({filter: value, id: taskId}));
    }, [dispatch])

    const removeTodolistHandler = useCallback((id: string) => {
        removeTodolist(id)
    }, [])

    const onAllClickHandler = useCallback(() => {
        changeFilter("all", props.todolistId)
    }, []);
    const onActiveClickHandler = useCallback(() => {
        changeFilter("active", props.todolistId)
    }, []);
    const onCompletedClickHandler = useCallback(() => {
        changeFilter("completed", props.todolistId)
    }, [])


    let allTodoLists = props.tasks;
    let tasksForTodolist = allTodoLists
    if (props.filter === "active") {
        tasksForTodolist = allTodoLists.filter(t => t.status === TaskStatuses.New);
    }
    if (props.filter === "completed") {
        tasksForTodolist = allTodoLists.filter(t => t.status === TaskStatuses.Completed);
    }

    const task = tasksForTodolist.map(t => {
        return <Task key={t.id}
                     task={t}
                     todolistId={props.todolistId}
                     status={status}
        />
    })

    const statusLoading = props.todolist.entityStatus === 'loading'

    return <div className={style.todo}>
        <div className={style.title__wrapper}>
            <EditableSpan fontSize={'20px'} value={props.title} onChange={changeTodoListTitle}
                          disabled={statusLoading}/>
            <IconButton onClick={() => removeTodolistHandler(props.todolistId)} disabled={statusLoading}>
                <Delete/>
            </IconButton>
        </div>
        <AddItemForm addItem={addTaskHandler} disabled={statusLoading}/>
        <div>
            {
                task.length ? task : <span>No tasks - create your first task</span>
            }
        </div>
        <div className={style.btn__wrapper}>
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


