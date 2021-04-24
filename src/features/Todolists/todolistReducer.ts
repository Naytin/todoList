import {ThunkAction} from "redux-thunk";
import {AppRootStateType} from "../../app/store";
import {todolistAPI} from "../../api/todolist-api";
import {TodolistType} from "../../api/todolist-api"

const initialState: TodolistDomainType[] = []

export const todolistReducer = (state: TodolistDomainType[] = initialState, action: ActionsType): TodolistDomainType[] => {
    switch (action.type) {
        case "SET-TODOS":
            return action.todos.map(tl => ({...tl, filter: 'all'}))
        case 'ADD-TODOLIST':
            return [{...action.todo, filter: 'all'}, ...state]
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
// actions
export const setTodolistsAC = (todos: Array<TodolistType>) => ({type: 'SET-TODOS', todos}) as const
export const addTodolistAC = (todo: TodolistType) => ({type: "ADD-TODOLIST", todo}) as const
export const removeTodolistAC = (todolistID: string) => ({type: "REMOVE-TODOLIST", id: todolistID}) as const // as const - фиксирует строку как константу.
export const changeFilterAC = (filter: FilterValuesType, id: string) => ({type: "CHANGE-FILTER", filter, id}) as const
export const changeTitleAC = (id: string, title: string) => ({type: "CHANGE-TITLE", id, title}) as const

// thunks
export const fetchTodolistsTC = (): ThunkType =>
    (dispatch) => {
        todolistAPI.getTodolist()
            .then((res) => dispatch(setTodolistsAC(res.data)))
    }


export const addTodolistsTC = (title: string): ThunkType => async dispatch => {
    try {
        const res = await todolistAPI.createTodolist(title)
        const action = addTodolistAC(res.data.data.item)
        dispatch(action)
    } catch (e) {
        throw new Error(e)
    }
}

export const deleteTodolistsTC = (todolistId: string): ThunkType =>
    (dispatch) => {
        todolistAPI.deleteTodolist(todolistId)
            .then((res) => {
                const action = removeTodolistAC(todolistId)
                dispatch(action)
            })
    }

export const updateTodolistTitleTC = (todolistId: string, title: string): ThunkType =>
    (dispatch) => {
// так как мы обязаны на сервер отправить все св-ва, которые сервер ожидает, а не только
// те, которые мы хотим обновить, соответственно нам нужно в этом месте взять таску целиком
// чтобы у неё отобрать остальные св-ва
        todolistAPI.updateTodolist(todolistId, title).then(res => {
            const action = changeTitleAC(todolistId, title)
            dispatch(action)
        })
    }

// types
type ThunkType = ThunkAction<void, AppRootStateType, unknown, ActionsType>

export type AddTodolistType = ReturnType<typeof addTodolistAC>
export type RemoveTodolistType = ReturnType<typeof removeTodolistAC>
export type SetTodolistsActionType = ReturnType<typeof setTodolistsAC>

type ActionsType =
    | ReturnType<typeof removeTodolistAC>
    | ReturnType<typeof addTodolistAC>
    | ReturnType<typeof changeFilterAC>
    | ReturnType<typeof changeTitleAC>
    | ReturnType<typeof setTodolistsAC>

export type FilterValuesType = "all" | "active" | "completed";
export type TodolistDomainType = TodolistType & {
    filter: FilterValuesType
}