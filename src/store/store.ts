import {combineReducers} from 'redux';
import thunk from 'redux-thunk'
import {configureStore} from "@reduxjs/toolkit";

import {appReducer, authReducer, tasksReducer, todolistReducer} from './reducers';


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


// create our store use configureStore
export const store = configureStore({
    reducer: rootReducer,
    middleware: getDefaultMiddleware => getDefaultMiddleware().prepend(thunk),
})

// а это, чтобы можно было в консоли браузера обращаться к store в любой момент store.getState
// @ts-ignore
window.store = store;



