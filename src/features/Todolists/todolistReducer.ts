import {todolistAPI} from "../../api/API";
import {TodolistType} from "../../api/API"
import {
    RequestStatusType,
    setAppStatusAC,
} from "../../app/appReducer";
import {Dispatch} from "redux";
import {handleServerAppError, handleServerNetworkError} from "../../utils/error-utils";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

const initialState = [
    {
        id: '1',
        addedDate: '',
        order:0,
        title: 'React',
        filter: 'all',
        entityStatus: "idle"
    },
    {
        id: '2',
        addedDate: '',
        order:0,
        title: 'React',
        filter: 'all',
        entityStatus: "idle"
    },
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


// thunks
export const fetchTodolistsTC = () =>
    (dispatch: Dispatch) => {
        dispatch(setAppStatusAC({status: 'loading'}))
        todolistAPI.getTodolist()
            .then((res) => {
                dispatch(setTodolistsAC({todos: res.data}))
                dispatch(setAppStatusAC({status: 'succeeded'}))
            })
            .catch(error => {
                handleServerNetworkError(error, dispatch)
            })

    }


export const addTodolistsTC = (title: string) => async (dispatch: Dispatch) => {
    try {
        dispatch(setAppStatusAC({status: 'loading'}))
        await todolistAPI.createTodolist(title)//let result =  await todolistAPI.createTodolist(title) возвращает
            .then(res => {
                if (res.data.resultCode === 0) {
                    const action = addTodolistAC({todo: res.data.data.item})
                    dispatch(action)
                    dispatch(setAppStatusAC({status: 'succeeded'}))
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
    (dispatch: Dispatch) => {
        dispatch(setAppStatusAC({status: 'loading'}))
        dispatch(changeTodolistEntityStatusAC({id: todolistId, entityStatus: 'loading'}))
        todolistAPI.deleteTodolist(todolistId)
            .then((res) => {
                if(res.data.resultCode === 0) {
                    const action = removeTodolistAC({todolistID: todolistId})
                    dispatch(action)
                    dispatch(setAppStatusAC({status: 'succeeded'}))
                }else {
                    handleServerAppError(res.data, dispatch)
                }
            }).catch(error => {
            handleServerNetworkError(error, dispatch)
        })
    }

export const updateTodolistTitleTC = (todolistId: string, title: string) =>
    (dispatch: Dispatch) => {
// так как мы обязаны на сервер отправить все св-ва, которые сервер ожидает, а не только
// те, которые мы хотим обновить, соответственно нам нужно в этом месте взять таску целиком
// чтобы у неё отобрать остальные св-ва
        dispatch(setAppStatusAC({status: 'loading'}))
        dispatch(changeTodolistEntityStatusAC({id: todolistId, entityStatus: 'loading'}))
        todolistAPI.updateTodolist(todolistId, title)
            .then(res => {
                if (res.data.resultCode === 0) {
                    const action = changeTitleAC({id: todolistId, title: title})
                    dispatch(action)
                    dispatch(setAppStatusAC({status: 'succeeded'}))
                    dispatch(changeTodolistEntityStatusAC({id: todolistId, entityStatus: 'succeeded'}))
                } else {
                    handleServerAppError(res.data, dispatch)
                }
            }).catch(error => {
                handleServerNetworkError(error, dispatch)
        })
    }

// types

// export type AddTodolistType = ReturnType<typeof addTodolistAC>
// export type RemoveTodolistType = ReturnType<typeof removeTodolistAC>
// export type SetTodolistsActionType = ReturnType<typeof setTodolistsAC>


export type FilterValuesType = "all" | "active" | "completed";
export type TodolistDomainType = TodolistType & {
    filter:  "all" | "active" | "completed";
    entityStatus: 'idle' | 'loading' | 'succeeded' | 'failed'
}