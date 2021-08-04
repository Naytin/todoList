import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {AxiosError} from "axios";
import {handleServerAppError, handleServerNetworkError} from "../../utils/error-utils";
import {setAppStatus} from '../actionCreators/appActionCreators'
import {authAPI} from "../../api/API";
import {ParamsLoginType} from "../../api/types";
import {ThunkError} from "../../utils/types";


export const login = createAsyncThunk<
    {isLoggedIn: boolean},ParamsLoginType,
    ThunkError
    >('auth/login',
    async (data,{dispatch, rejectWithValue}) => {
    dispatch(setAppStatus({status: 'loading'}))
    try {
        const res = await authAPI.login(data)
        if (res.data.resultCode === 0) {
            dispatch(setAppStatus({status: 'succeeded'}))
            return {isLoggedIn: true}
        } else {
            handleServerAppError(res.data, dispatch)
            return rejectWithValue({errors: res.data.messages, fieldsErrors: res.data.fieldsErrors})
        }
    } catch (err) {
        const error: AxiosError = err
        handleServerNetworkError(error, dispatch)
        return rejectWithValue({errors: [error.message], fieldsErrors: undefined})
    }
})
const logout = createAsyncThunk('auth/logout', async (arg, {dispatch, rejectWithValue}) => {
    dispatch(setAppStatus({status: 'loading'}))
    try {
        const res = await authAPI.logout()
        if (res.data.resultCode === 0) {
            dispatch(setAppStatus({status: 'succeeded'}))
           return {isLoggedIn: false}
        } else {
            handleServerAppError(res.data, dispatch)

        }
    } catch (err) {
        handleServerNetworkError(err, dispatch)
    }
})

export const asyncActions = {
    login,
    logout
}


const initialState = {
    isLoggedIn: false
}

const slice = createSlice({
    name: 'auth', // name of our reducer
    initialState: initialState, // initialState
    reducers: {
        // Transfer to reducer our actions and put state and action to the parameters
        // we need types actions and and use PayloadAction< {our value: type} >
        setIsLoggedIn(state, action: PayloadAction<{ isLoggedIn: boolean }>) {
            state.isLoggedIn = action.payload.isLoggedIn
        }
    },
    extraReducers: builder => {
        builder.addCase(login.fulfilled, (state, action) => {
            if (action.payload) {
                state.isLoggedIn = action.payload.isLoggedIn
            }
        });
        builder.addCase(logout.fulfilled, (state, action) => {
            if (action.payload) {
                state.isLoggedIn = action.payload.isLoggedIn
            }
        })
    }
})

export const authReducer = slice.reducer // assign our reducer to variable
export const {setIsLoggedIn} = slice.actions // get actionCreator from actions
