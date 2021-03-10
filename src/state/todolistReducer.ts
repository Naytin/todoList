import { v1 } from "uuid";
import {FilterValuesType, TodolistType} from "../App";


export type RemoveTodolistType = {
    type: "REMOVE-TODOLIST"
    id: string
}

export type AddTodolistType = {
    type: "ADD-TODOLIST"
    title: string
    todolistId: string
}

type ChangeTodoListFilterType = {
    type: "CHANGE-FILTER"
    filter: FilterValuesType,
    id: string
}

type ChangeTodoListTitleType = {
    type: "CHANGE-TITLE"
    title: string
    id: string
}

type ActionType = RemoveTodolistType | AddTodolistType | ChangeTodoListFilterType | ChangeTodoListTitleType
export const ID_1 = v1()
export const ID_2 = v1()


const initialState: TodolistType[] = [
    {id: ID_1, title: "What to learn?", filter: 'all'},
    {id: ID_2, title: "What to buy?", filter: 'all'},
]

export const todolistReducer = (state: TodolistType[] = initialState, action: ActionType):TodolistType[]  => {
    switch (action.type) {
        case "REMOVE-TODOLIST":
            return state.filter(tl => tl.id !== action.id)
        case "ADD-TODOLIST":
            const newTodolist: TodolistType = {id: action.todolistId, title: action.title, filter: 'all'}
            return [...state, newTodolist]
        case "CHANGE-FILTER":
            return state.map(tl => tl.id === action.id ? {...tl, filter: action.filter} : tl)
        case "CHANGE-TITLE":
            return state.map(tl => tl.id === action.id ? {...tl, title: action.title} : tl)
        default:
            return state

    }
}

export const removeTodolistAC = (todolistID: string):RemoveTodolistType =>
    ({type: "REMOVE-TODOLIST", id: todolistID})
export const addTodolistAC = (todolistTitle: string):AddTodolistType =>
    ({type: "ADD-TODOLIST", title: todolistTitle, todolistId: v1()})
export const changeFilterAC = (filter: FilterValuesType, id: string):ChangeTodoListFilterType =>
    ({type: "CHANGE-FILTER",id ,filter})
export const changeTitleAC = (title: string, id: string):ChangeTodoListTitleType =>
    ({type: "CHANGE-TITLE",id ,title})