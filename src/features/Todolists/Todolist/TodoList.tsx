import React, {useCallback, useEffect} from 'react';
import {AddItemForm} from "../../../Components/AddItemForm/AddItemForm";
import {EditableSpan} from "../../../Components/EditableSpan/EditableSpan";
import Task from "./Task/Task";
import {changeFilterAC, FilterValuesType, TodolistDomainType,} from "../../../store/reducers/todolistReducer";
import {TaskStatuses, TaskType} from "../../../api/types";
import {useAppSelector} from "../../../utils/hooks/useAppSelector";
import {useActions, useAppDispatch} from "../../../utils/hooks/useActions";
import {taskAsyncActions, todolistAsyncActions} from "../../../store/actionCreators";
import {icons} from "../../../assets/icons";


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

    const removeTodolistHandler = useCallback(() => {
        removeTodolist(props.todolistId)
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

    const statusLoading = status === 'loading'

    return <div className='w-full p-4 border rounded-md shadow-xl bg-white'>
        <div className='flex pb-8 justify-between'>
            <EditableSpan fontSize={'22px'}
                          fontWeight='bold'
                          value={props.title}
                          onChange={changeTodoListTitle}
                          disabled={statusLoading}/>
            <button onClick={removeTodolistHandler} disabled={statusLoading}>{icons.trash}</button>
        </div>
        <AddItemForm
            addItem={addTaskHandler}
            disabled={statusLoading}
            placeholder='Add new task'
            icon={icons.plus}
        />
        <div className='task'>
            {
                props.tasks.length ? task
                    :
                    <span className='my-2 text-center bg-red-50 '>No tasks - create your first task</span>
            }
        </div>
        <div className='w-full flex justify-between'>
            <ButtonDefault text='All' filter={props.filter === 'all'} onclick={onAllClickHandler}/>
            <ButtonDefault text='Active' filter={props.filter === 'active'} onclick={onActiveClickHandler}/>
            <ButtonDefault text='Completed' filter={props.filter === 'completed'} onclick={onCompletedClickHandler}/>
        </div>
    </div>
})

type ButtonDefaultType = {
    text: string
    filter: boolean
    onclick: () => void
}
const ButtonDefault = ({text,filter,onclick}: ButtonDefaultType) => {
    return (
        <button
            onClick={onclick}
            className={`transition duration-300 py-1 px-3 border-4 ${filter ? 'border-blue-300' : 'border-blue-600'} 
            border-opacity-100 hover:border-opacity-75 rounded-lg shadow-md font-medium`}>
            {text}
        </button>
    )
}








