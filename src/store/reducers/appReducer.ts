import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {handleServerAppError, handleServerNetworkError} from "../../utils/error-utils";
import {setIsLoggedIn} from "./authReducer";
import {authAPI} from "../../api/API";
import {setAppStatus,setAppError} from '../actionCreators/appActionCreators'

const initialState = {
    status: 'idle',
    error: null as string | null,
    isInitialized: false
}

const initializeApp = createAsyncThunk('app/initializeApp',
    async (arg, {dispatch}) => {
    dispatch(setAppStatus({status: 'loading'}))
    try {
        const res = await authAPI.auth()
        if (res.data.resultCode === 0) {
            dispatch(setIsLoggedIn({isLoggedIn: true}))
            dispatch(setAppStatus({status: 'succeeded'}))
        } else {
            handleServerAppError(res.data, dispatch)
        }
    } catch (err) {
        handleServerNetworkError(err, dispatch)
    }
})

export const asyncActions = {
    initializeApp
}

const slice = createSlice({
    name: 'app',
    initialState: initialState,
    reducers: {
        // setAppStatusAC(state, action: PayloadAction<{ status: RequestStatusType }>) {
        //     state.status = action.payload.status
        // },
        // setAppErrorAC(state, action: PayloadAction<{ error: string | null }>) {
        //     state.error = action.payload.error
        // },
    },
    extraReducers: builder => {
        builder.addCase(initializeApp.fulfilled, (state, action) => {
            state.isInitialized = true
        })
        builder.addCase(setAppStatus, (state, action) => {
            state.status = action.payload.status
        })
        builder.addCase(setAppError, (state, action) => {
            state.error = action.payload.error
        })
    }
})

export const appReducer = slice.reducer


