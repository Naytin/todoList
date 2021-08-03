import {tasksReducer} from './reducers/tasksReducer';
import {todolistReducer} from './reducers/todolistReducer';
import {combineReducers} from 'redux';
import thunk from 'redux-thunk'
import {appReducer} from "./reducers/appReducer";
import {authReducer} from "./reducers/authReducer";
import {configureStore} from "@reduxjs/toolkit";
import {useDispatch} from "react-redux";
import {FieldError} from "../api/API";


// объединяя reducer-ы с помощью combineReducers,
// мы задаём структуру нашего единственного объекта-состояния (редюсера)
export const rootReducer = combineReducers({
    tasks: tasksReducer,
    todolists: todolistReducer,
    app: appReducer,
    auth: authReducer
})
// непосредственно создаём store
// export const store = createStore(rootReducer);
// определить автоматически тип всего объекта состояния
// export type AppRootStateType = ReturnType<typeof rootReducer>

// create our store use configureStore
export const store = configureStore({
    reducer: rootReducer,
    middleware: getDefaultMiddleware => getDefaultMiddleware().prepend(thunk),
})

export type AppRootStateType = ReturnType<typeof store.getState>

// а это, чтобы можно было в консоли браузера обращаться к store в любой момент store.getState
// @ts-ignore
window.store = store;


export type ThunkError = {rejectValue: {errors: Array<string>, fieldsErrors? : Array<FieldError>}}
type AppDispatchType = typeof store.dispatch
export const useAppDispatch = () => useDispatch()