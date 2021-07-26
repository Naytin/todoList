import {setAppStatusAC} from '../../app/appReducer'
import {authAPI, FieldError, ParamsLoginType} from "../../api/API";
import {handleServerAppError, handleServerNetworkError} from "../../utils/error-utils";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {AxiosError} from "axios";


export const loginTC = createAsyncThunk<
    {isLoggedIn: boolean},ParamsLoginType, {
    rejectValue: {errors: Array<string>, fieldErrors?: Array<FieldError>}
}
    >('auth/login',
    async (data,{dispatch, rejectWithValue}) => {
    dispatch(setAppStatusAC({status: 'loading'}))
    try {
        const res = await authAPI.login(data)
        if (res.data.resultCode === 0) {
            dispatch(setAppStatusAC({status: 'succeeded'}))
            return {isLoggedIn: true}
        } else {
            handleServerAppError(res.data, dispatch)
            return rejectWithValue({errors: res.data.messages, fieldErrors: res.data.fieldErrors})
        }
    } catch (err) {
        const error: AxiosError = err
        handleServerNetworkError(error, dispatch)
        return rejectWithValue({errors: [error.message], fieldErrors: undefined})
    }
})
export const logoutTC = createAsyncThunk('auth/logout', async (arg, {dispatch, rejectWithValue}) => {
    dispatch(setAppStatusAC({status: 'loading'}))
    try {
        const res = await authAPI.logout()
        if (res.data.resultCode === 0) {
            dispatch(setAppStatusAC({status: 'succeeded'}))
           return {isLoggedIn: false}
        } else {
            handleServerAppError(res.data, dispatch)

        }
    } catch (err) {
        handleServerNetworkError(err, dispatch)
    }

})


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
        builder.addCase(loginTC.fulfilled, (state, action) => {
            if (action.payload) {
                state.isLoggedIn = action.payload.isLoggedIn
            }
        });
        builder.addCase(logoutTC.fulfilled, (state, action) => {
            if (action.payload) {
                state.isLoggedIn = action.payload.isLoggedIn
            }
        })
    }
})
export const authReducer = slice.reducer // assign our reducer to variable
export const {setIsLoggedIn} = slice.actions // get actionCreator from actions
