import {todolistAPI} from "../../api/API";
import {TodolistType} from "../../api/API"
import {
    RequestStatusType,
    setAppStatusAC,
} from "../../app/appReducer";
import {handleServerAppError, handleServerNetworkError} from "../../utils/error-utils";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";

// thunks
export const fetchTodolistsTC = createAsyncThunk('todolists/fetchTodolists',
    async (arg, {
        dispatch, rejectWithValue
    }) => {
        dispatch(setAppStatusAC({status: 'loading'}))
        try {
            const res = await todolistAPI.getTodolist()
            dispatch(setAppStatusAC({status: 'succeeded'}))
            return {todos: res.data}
        } catch (err) {
            handleServerNetworkError(err, dispatch)
            return rejectWithValue(null)
        }
    })

export const addTodolistsTC = createAsyncThunk('todolists/addTodolist',
    async (title: string, {dispatch, rejectWithValue}) => {
        try {
            dispatch(setAppStatusAC({status: 'loading'}))
            const res = await todolistAPI.createTodolist(title)
            if (res.data.resultCode === 0) {
                dispatch(setAppStatusAC({status: 'succeeded'}))
                return {todo: res.data.data.item}
            } else {
                handleServerAppError(res.data, dispatch)
                return rejectWithValue(null)
            }
        } catch (err) {
            handleServerNetworkError(err, dispatch)
            return rejectWithValue(null)
        }
    })

export const removeTodolistTC = createAsyncThunk('todolists/removeTodolist',
    async (todolistId: string, {dispatch, rejectWithValue}) => {
        dispatch(setAppStatusAC({status: 'loading'}))
        try {
            const res = await todolistAPI.deleteTodolist(todolistId)
            if (res.data.resultCode === 0) {
                dispatch(setAppStatusAC({status: 'succeeded'}))
                return {todolistId}
            } else {
                handleServerAppError(res.data, dispatch)
                return rejectWithValue(null)
            }
        } catch (err) {
            handleServerNetworkError(err, dispatch)
            return rejectWithValue(null)
        }
    })


export const updateTodolistTitleTC = createAsyncThunk('todolists/updateTodolist',
    async (param:{todolistId: string, title: string}, {dispatch, rejectWithValue}) => {
        dispatch(setAppStatusAC({status: 'loading'}))
        try {
            const res = await todolistAPI.updateTodolist(param.todolistId, param.title)
            if (res.data.resultCode === 0) {
                dispatch(setAppStatusAC({status: 'succeeded'}))
                return {todolistId: param.todolistId,  title: param.title}
            } else {
                handleServerAppError(res.data, dispatch)
                return rejectWithValue(null)
            }
        }catch (err) {
            handleServerNetworkError(err, dispatch)
            return rejectWithValue(null)
        }
})


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
        changeFilterAC: (state, action: PayloadAction<{ filter: FilterValuesType, id: string }>) => {
            const index = state.findIndex(tl => tl.id === action.payload.id)
            state[index].filter = action.payload.filter
        },
        changeTodolistEntityStatusAC: (state, action: PayloadAction<{ id: string, entityStatus: RequestStatusType }>) => {
            const index = state.findIndex(tl => tl.id === action.payload.id)
            state[index].entityStatus = action.payload.entityStatus
        },
    },
    extraReducers: builder => {
        builder.addCase(fetchTodolistsTC.fulfilled, (state, action) => {
            return action.payload.todos.map(tl => ({...tl, filter: 'all', entityStatus: 'idle'}))
        });
        builder.addCase(addTodolistsTC.fulfilled, (state, action) => {
            state.push({...action.payload.todo, filter: 'all', entityStatus: 'idle'})
        });
        builder.addCase(removeTodolistTC.fulfilled, (state, action) => {
            const index = state.findIndex(tl => tl.id === action.payload.todolistId)
            if (index !== -1) state.splice(index, 1)
        });
        builder.addCase(updateTodolistTitleTC.fulfilled, (state, action) => {
            const index = state.findIndex(tl => tl.id === action.payload.todolistId)
            state[index].title = action.payload.title
        });

    }
})

export const todolistReducer = slice.reducer
export const {
    changeFilterAC,
    changeTodolistEntityStatusAC
} = slice.actions

// types

export type FilterValuesType = "all" | "active" | "completed";
export type TodolistDomainType = TodolistType & {
    filter: FilterValuesType
    entityStatus: RequestStatusType
}