import {todolistAPI} from "../../api/todolist-api";
import {TodolistType} from "../../api/todolist-api"
import {
    RequestStatusType,
    setAppErrorAC,
    setAppStatusAC,
    SetErrorActionType,
    SetStatusActionType
} from "../../app/app.Reducer";
import {Dispatch} from "redux";
import {handleServerAppError, handleServerNetworkError} from "../../utils/error-utils";

const initialState: TodolistDomainType[] = []

export const todolistReducer = (state: TodolistDomainType[] = initialState, action: ActionsType): TodolistDomainType[] => {
    switch (action.type) {
        case "SET-TODOS":
            return action.todos.map(tl => ({...tl, filter: 'all', entityStatus: 'idle'}))
        case 'ADD-TODOLIST':
            return [{...action.todo, filter: 'all', entityStatus: 'idle'}, ...state]
        case "REMOVE-TODOLIST":
            return state.filter(tl => tl.id !== action.id)
        case "CHANGE-FILTER":
            return state.map(tl => tl.id === action.id ? {...tl, filter: action.filter} : tl)
        case "CHANGE-TITLE":
            return state.map(tl => tl.id === action.id ? {...tl, title: action.title} : tl)
        case 'CHANGE-TODOLIST-ENTITY-STATUS':
            return state.map(tl => tl.id === action.id ? {...tl, entityStatus: action.entityStatus} : tl)
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
export const changeTodolistEntityStatusAC = (id: string, entityStatus: RequestStatusType) => ({type: 'CHANGE-TODOLIST-ENTITY-STATUS', id, entityStatus}) as const

// thunks
export const fetchTodolistsTC = () =>
    (dispatch: ThunkType) => {
        dispatch(setAppStatusAC('loading'))
        todolistAPI.getTodolist()
            .then((res) => {
                dispatch(setTodolistsAC(res.data))
                dispatch(setAppStatusAC('succeeded'))
            })
            .catch(error => {
                handleServerNetworkError(error, dispatch)
            })

    }


export const addTodolistsTC = (title: string) => async (dispatch: ThunkType) => {
    try {
        dispatch(setAppStatusAC('loading'))
        await todolistAPI.createTodolist(title)
            .then(res => {
                if (res.data.resultCode === 0) {
                    const action = addTodolistAC(res.data.data.item)
                    dispatch(action)
                    dispatch(setAppStatusAC('succeeded'))
                } else {
                    handleServerAppError(res.data, dispatch)
                }
            }).catch(error => {
                handleServerNetworkError(error, dispatch)
            })
    } catch (e) {
        throw new Error(e)
    }
}

export const deleteTodolistsTC = (todolistId: string) =>
    (dispatch: ThunkType) => {
        dispatch(setAppStatusAC('loading'))
        dispatch(changeTodolistEntityStatusAC(todolistId,'loading'))
        todolistAPI.deleteTodolist(todolistId)
            .then((res) => {
                if(res.data.resultCode === 0) {
                    const action = removeTodolistAC(todolistId)
                    dispatch(action)
                    dispatch(setAppStatusAC('succeeded'))
                }else {
                    handleServerAppError(res.data, dispatch)
                }
            }).catch(error => {
            handleServerNetworkError(error, dispatch)
        })
    }

export const updateTodolistTitleTC = (todolistId: string, title: string) =>
    (dispatch: ThunkType) => {
// так как мы обязаны на сервер отправить все св-ва, которые сервер ожидает, а не только
// те, которые мы хотим обновить, соответственно нам нужно в этом месте взять таску целиком
// чтобы у неё отобрать остальные св-ва
        dispatch(setAppStatusAC('loading'))
        dispatch(changeTodolistEntityStatusAC(todolistId,'loading'))
        todolistAPI.updateTodolist(todolistId, title)
            .then(res => {
                if (res.data.resultCode === 0) {
                    const action = changeTitleAC(todolistId, title)
                    dispatch(action)
                    dispatch(setAppStatusAC('succeeded'))
                    dispatch(changeTodolistEntityStatusAC(todolistId,'succeeded'))
                } else {
                    handleServerAppError(res.data, dispatch)
                }
            }).catch(error => {
                handleServerNetworkError(error, dispatch)
        })
    }

// types
type ThunkType = Dispatch<SetStatusActionType | SetErrorActionType | ActionsType>

export type AddTodolistType = ReturnType<typeof addTodolistAC>
export type RemoveTodolistType = ReturnType<typeof removeTodolistAC>
export type SetTodolistsActionType = ReturnType<typeof setTodolistsAC>

type ActionsType =
    | ReturnType<typeof removeTodolistAC>
    | ReturnType<typeof addTodolistAC>
    | ReturnType<typeof changeFilterAC>
    | ReturnType<typeof changeTitleAC>
    | ReturnType<typeof setTodolistsAC>
    | ReturnType<typeof changeTodolistEntityStatusAC>

export type FilterValuesType = "all" | "active" | "completed";
export type TodolistDomainType = TodolistType & {
    filter: FilterValuesType
    entityStatus: RequestStatusType
}