import {TaskPriorities, tasksAPI, TaskStatuses, TaskType, TodolistType, UpdateTaskModelType} from "../../api/API";
import {
    addTodolistAC,
    removeTodolistAC,
    setTodolistsAC,
} from "./todolistReducer";
import {AppRootStateType} from "../../app/store";
import {Dispatch} from "redux";
import {RequestStatusType, setAppStatusAC} from "../../app/appReducer";
import {handleServerAppError, handleServerNetworkError} from "../../utils/error-utils";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

const initialState: TaskStateType = {
    "1": [
        {
            id: "1", title: "CSS",
            status: TaskStatuses.New, todoListId: 'todolistId1', description: '', startDate: '',
            deadline: '', addedDate: '', order: 0,
            priority: TaskPriorities.Low,
            entityStatus: 'succeeded' as RequestStatusType,
        },
        {
            id: "2", title: "JS",
            status: TaskStatuses.Completed, todoListId: 'todolistId1', description: '', startDate: '',
            deadline: '', addedDate: '', order: 0,
            priority: TaskPriorities.Low,
            entityStatus: 'succeeded' as RequestStatusType,
        },
        {
            id: "3", title: "REACT",
            status: TaskStatuses.New, todoListId: 'todolistId1', description: '', startDate: '',
            deadline: '', addedDate: '', order: 0,
            priority: TaskPriorities.Low,
            entityStatus: 'succeeded' as RequestStatusType,
        },
    ],
    "2": [
        {
            id: "1", title: "book",
            status: TaskStatuses.New, todoListId: 'todolistId1', description: '', startDate: '',
            deadline: '', addedDate: '', order: 0,
            priority: TaskPriorities.Low,
            entityStatus: 'succeeded' as RequestStatusType,
        },
        {
            id: "2", title: "book2",
            status: TaskStatuses.New, todoListId: 'todolistId1', description: '', startDate: '',
            deadline: '', addedDate: '', order: 0,
            priority: TaskPriorities.Low,
            entityStatus: 'succeeded' as RequestStatusType,
        },
        {
            id: "3", title: "book3",
            status: TaskStatuses.New, todoListId: 'todolistId1', description: '', startDate: '',
            deadline: '', addedDate: '', order: 0,
            priority: TaskPriorities.Low,
            entityStatus: 'succeeded' as RequestStatusType,
        },

    ]
}

const slice = createSlice({
    name: 'tasks',
    initialState: initialState,
    reducers: {
        setTasksAC: (state, action: PayloadAction<SetTaskType>) => {
            state[action.payload.todolistId] = action.payload.tasks
        },
        addTaskAC: (state, action: PayloadAction<TaskType>) => {
            state[action.payload.todoListId].unshift(action.payload)
        },
        removeTaskAC: (state, action: PayloadAction<RemoveTaskType>) => {
            const tasks = state[action.payload.todolistId]
            const index = tasks.findIndex(t => t.id === action.payload.taskId)
            if (index > -1) {
                tasks.splice(index, 1)
            }
        },
        updateTaskAC: (state, action: PayloadAction<UpdateTaskType>) => {
            const tasks = state[action.payload.todolistId]
            const index = tasks.findIndex(t => t.id === action.payload.taskId)
            if (index > -1) {
                tasks[index] = {...tasks[index], ...action.payload.model}
            }
        },
        changeTaskEntityStatusAC: (state, action: PayloadAction<ChangeTaskEntityType>) => {
            const tasks = state[action.payload.todolistId]
            const index = tasks.findIndex(t => t.id === action.payload.taskId)
            if (index > -1) {
                tasks[index].entityStatus = action.payload.entityStatus
            }
        }
    },//
    extraReducers: (builder) => {
        builder.addCase(addTodolistAC, (state, action) => {
            state[action.payload.todo.id] = []
        });
        builder.addCase(removeTodolistAC, (state, action) => {
            delete state[action.payload.todolistID]
        });
        builder.addCase(setTodolistsAC, (state, action) => {
            action.payload.todos.forEach((tl) => {
                state[tl.id] = []
            })
        })
    }
})

type ChangeTaskEntityType = { taskId: string, todolistId: string, entityStatus: RequestStatusType }
type UpdateTaskType = { taskId: string, model: UpdateDomainTaskModelType, todolistId: string }
type RemoveTaskType = { taskId: string, todolistId: string }
type SetTaskType = { tasks: Array<TaskType>, todolistId: string }

export const tasksReducer = slice.reducer
export const {setTasksAC,addTaskAC,removeTaskAC,updateTaskAC,changeTaskEntityStatusAC} = slice.actions



// types
export type TaskStateType = {
    [key: string]: Array<TaskType>
}


// создаем тип, для универсальной санки с необязательными полями, для подстановки нужного поля в санку
export type UpdateDomainTaskModelType = {
    title?: string
    description?: string
    status?: number
    priority?: number
    startDate?: string
    deadline?: string
    entityStatus?: RequestStatusType
}