import {handleServerAppError, handleServerNetworkError} from "../../utils/error-utils";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {AxiosError} from "axios";
import {todolistAPI} from "../../api/API";
import {TodolistType} from "../../api/types"
import {ThunkError} from "../../utils/types";
import {RequestStatusType, setAppStatus,} from "../actionCreators/appActionCreators";

// thunks
export const fetchTodolists = createAsyncThunk('todolists/fetchTodolists',
    async (arg, {
        dispatch, rejectWithValue
    }) => {
        dispatch(setAppStatus({status: 'loading'}))
        try {
            const res = await todolistAPI.getTodolist()
            dispatch(setAppStatus({status: 'succeeded'}))
            return {todos: res.data}
        } catch (err) {
            handleServerNetworkError(err, dispatch)
            return rejectWithValue(null)
        }
    })

export const addTodolists = createAsyncThunk<
    TodolistType,
    string,
    ThunkError
    >('todolists/addTodolist',
    async (title, {dispatch, rejectWithValue}) => {
        try {
            dispatch(setAppStatus({status: 'loading'}))
            const res = await todolistAPI.createTodolist(title)
            if (res.data.resultCode === 0) {
                dispatch(setAppStatus({status: 'succeeded'}))
                return res.data.data.item
            } else {
                handleServerAppError(res.data, dispatch)
                return rejectWithValue({errors: res.data.messages, fieldsErrors: res.data.fieldsErrors})
            }
        } catch (err) {
            const error: AxiosError = err
            handleServerNetworkError(err, dispatch)
            return rejectWithValue({errors: [error.message], fieldsErrors: undefined})
        }
    })

export const removeTodolist = createAsyncThunk('todolists/removeTodolist',
    async (todolistId: string, {dispatch, rejectWithValue}) => {
        dispatch(setAppStatus({status: 'loading'}))
        try {
            const res = await todolistAPI.deleteTodolist(todolistId)
            if (res.data.resultCode === 0) {
                dispatch(setAppStatus({status: 'succeeded'}))
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

export const updateTodolistTitle = createAsyncThunk('todolists/updateTodolist',
    async (param:{todolistId: string, title: string}, {dispatch, rejectWithValue}) => {
        dispatch(setAppStatus({status: 'loading'}))
        try {
            const res = await todolistAPI.updateTodolist(param.todolistId, param.title)
            if (res.data.resultCode === 0) {
                dispatch(setAppStatus({status: 'succeeded'}))
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

export const asyncActions = {
    fetchTodolists,
    addTodolists,
    removeTodolist,
    updateTodolistTitle
}


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
    },
    extraReducers: builder => {
        builder.addCase(fetchTodolists.fulfilled, (state, action) => {
            return action.payload.todos.map(tl => ({...tl, filter: 'all', entityStatus: 'idle'}))
        });
        builder.addCase(addTodolists.fulfilled, (state, action) => {
            state.push({...action.payload, filter: 'all', entityStatus: 'idle'})
        });
        builder.addCase(removeTodolist.fulfilled, (state, action) => {
            const index = state.findIndex(tl => tl.id === action.payload.todolistId)
            if (index !== -1) state.splice(index, 1)
        });
        builder.addCase(updateTodolistTitle.fulfilled, (state, action) => {
            const index = state.findIndex(tl => tl.id === action.payload.todolistId)
            state[index].title = action.payload.title
        });

    }
})

export const todolistReducer = slice.reducer
export const {changeFilterAC,} = slice.actions

// types

export type FilterValuesType = "all" | "active" | "completed";
export type TodolistDomainType = TodolistType & {
    filter: FilterValuesType
    entityStatus: RequestStatusType
}