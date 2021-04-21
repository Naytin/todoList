import {ThunkAction} from "redux-thunk";
import {AppRootStateType} from "./store";
import {todolistAPI} from "../api/todolist-api";
import {TodolistType} from "../api/todolist-api"


export type RemoveTodolistType = {
    type: "REMOVE-TODOLIST"
    id: string
}

export type AddTodolistType = {
    type: "ADD-TODOLIST"
    todo: TodolistType
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


type ActionsType = RemoveTodolistType
    | AddTodolistType
    | ChangeTodoListFilterType
    | ChangeTodoListTitleType
    | SetTodolistsActionType

export type FilterValuesType = "all" | "active" | "completed";
export type TodolistDomainType = TodolistType & {
    filter: FilterValuesType
}

const initialState: TodolistDomainType[] = [
    // {id: ID_1, title: "What to learn?", filter: 'all'},
    // {id: ID_2, title: "What to buy?", filter: 'all'},
]

export const todolistReducer = (state: TodolistDomainType[] = initialState, action: ActionsType): TodolistDomainType[] => {
    switch (action.type) {
        case "SET-TODOS":
            return action.todos.map(tl => ({
                ...tl,
                filter: 'all'
            }))
        case 'ADD-TODOLIST': {
            return [{
                ...action.todo,
                filter: 'all'
            }, ...state]
        }
        case "REMOVE-TODOLIST":
            return state.filter(tl => tl.id !== action.id)
        case "CHANGE-FILTER":
            return state.map(tl => tl.id === action.id ? {...tl, filter: action.filter} : tl)
        case "CHANGE-TITLE":
            return state.map(tl => tl.id === action.id ? {...tl, title: action.title} : tl)
        default:
            return state

    }
}

export type SetTodolistsActionType = ReturnType<typeof setTodolistsAC>

export const setTodolistsAC = (todos: Array<TodolistType>) => {
    return {type: 'SET-TODOS', todos} as const
}
export const addTodolistAC = (todo: TodolistType): AddTodolistType =>
    ({type: "ADD-TODOLIST", todo})
export const removeTodolistAC = (todolistID: string): RemoveTodolistType =>
    ({type: "REMOVE-TODOLIST", id: todolistID})

export const changeFilterAC = (filter: FilterValuesType, id: string): ChangeTodoListFilterType =>
    ({type: "CHANGE-FILTER", filter, id})
export const changeTitleAC = (id: string, title: string): ChangeTodoListTitleType =>
    ({type: "CHANGE-TITLE", id, title})

type ThunkType = ThunkAction<void, AppRootStateType, unknown, ActionsType>
export const fetchTodolistsTC = (): ThunkType => {
    return (dispatch) => {
        todolistAPI.getTodolist()
            .then((res) => dispatch(setTodolistsAC(res.data)))
    }
}


export const addTodolistsTC = (title: string): ThunkType => async dispatch => {
    try {
        const res = await todolistAPI.createTodolist(title)
        const action = addTodolistAC(res.data.data.item)
        dispatch(action)
    }catch (e) {
        throw new Error(e)
    }
}

export const deleteTodolistsTC = (todolistId: string): ThunkType => {
    return (dispatch) => {
        todolistAPI.deleteTodolist(todolistId)
            .then((res) => {
                const action = removeTodolistAC(todolistId)
                dispatch(action)
            })
    }
}

export const updateTodolistTitleTC = (todolistId: string, title: string): ThunkType => {
    return (dispatch) => {
// так как мы обязаны на сервер отправить все св-ва, которые сервер ожидает, а не только
// те, которые мы хотим обновить, соответственно нам нужно в этом месте взять таску целиком
// чтобы у неё отобрать остальные св-ва
        todolistAPI.updateTodolist(todolistId, title).then(res => {
            const action = changeTitleAC(todolistId, title)
            dispatch(action)
        })
    }
}