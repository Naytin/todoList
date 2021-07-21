import {TodolistType} from "../../api/API"
import {RequestStatusType} from "../../app/appReducer";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

const initialState: Array<TodolistDomainType> = [
    // {
    //     id: '1',
    //     addedDate: '',
    //     order:0,
    //     title: 'React',
    //     filter: 'all' as FilterValuesType,
    //     entityStatus: "idle" as RequestStatusType,
    // },
    // {
    //     id: '2',
    //     addedDate: '',
    //     order:0,
    //     title: 'React',
    //     filter: 'all' as FilterValuesType,
    //     entityStatus: "idle" as RequestStatusType,
    // },
]

const slice = createSlice({
    name: 'todolist',
    initialState: initialState,
    reducers: {
        setTodolistsAC: (state, action: PayloadAction<{todos: Array<TodolistType>}>) => {
            return action.payload.todos.map(tl => ({...tl, filter: 'all', entityStatus: 'idle'}))
        },
        addTodolistAC: (state, action: PayloadAction<{todo: TodolistType}>) => {
            state.push({...action.payload.todo, filter: 'all', entityStatus: 'idle'})
        },
        removeTodolistAC: (state, action: PayloadAction<{todolistID: string}>) => {
            const index = state.findIndex(tl => tl.id === action.payload.todolistID)
            if(index !== -1) state.splice(index, 1)
        },
        changeFilterAC: (state, action: PayloadAction<{filter: FilterValuesType, id: string}>) => {
            const index = state.findIndex(tl => tl.id === action.payload.id)
            state[index].filter = action.payload.filter
        },
        changeTitleAC: (state, action: PayloadAction<{id: string, title: string}>) => {
            const index = state.findIndex(tl => tl.id === action.payload.id)
            state[index].title = action.payload.title
        },
        changeTodolistEntityStatusAC: (state, action: PayloadAction<{id: string, entityStatus: RequestStatusType}>) => {
            const index = state.findIndex(tl => tl.id === action.payload.id)
            state[index].entityStatus = action.payload.entityStatus
        },
    }
})

export const todolistReducer = slice.reducer
export const {setTodolistsAC,addTodolistAC,removeTodolistAC,changeFilterAC,changeTitleAC,changeTodolistEntityStatusAC}
= slice.actions

// types

export type FilterValuesType = "all" | "active" | "completed";
export type TodolistDomainType = TodolistType & {
    filter:  FilterValuesType
    entityStatus: RequestStatusType
}