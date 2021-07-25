import {authAPI} from "../api/API";
import {handleServerAppError, handleServerNetworkError} from "../utils/error-utils";
import {setIsLoggedIn} from "../features/Login/authReducer";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";

const initialState = {
    status: 'idle',
    error: null as string | null,
    isInitialized: false
}

export const initializeAppTC = createAsyncThunk('app/initializeApp', async (arg, thunkAPI) => {
    thunkAPI.dispatch(setAppStatusAC({status: 'loading'}))
    try {
        const res = await authAPI.auth()
        if (res.data.resultCode === 0) {
            thunkAPI.dispatch(setIsLoggedIn({value: true}))
            thunkAPI.dispatch(setAppStatusAC({status: 'succeeded'}))
        } else {
            handleServerAppError(res.data, thunkAPI.dispatch)
        }
        return {isInitialized: true}
    } catch (err) {
        handleServerNetworkError(err, thunkAPI.dispatch)
    }
})


const slice = createSlice({
    name: 'app',
    initialState: initialState,
    reducers: {
        setAppStatusAC(state, action: PayloadAction<{ status: RequestStatusType }>) {
            state.status = action.payload.status
        },
        setAppErrorAC(state, action: PayloadAction<{ error: string | null }>) {
            state.error = action.payload.error
        },
        // setIsInitialized(state, action: PayloadAction<{value: boolean}>) {
        //     state.isInitialized = action.payload.value
        // }
    },
    extraReducers: builder => {
        builder.addCase(initializeAppTC.fulfilled, (state, action) => {
            if (action.payload) {
                state.isInitialized = action.payload.isInitialized
            }
        })
    }
})

export const appReducer = slice.reducer
export const {setAppStatusAC, setAppErrorAC} = slice.actions

// types
export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'

