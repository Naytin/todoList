import {tasksReducer} from '../features/Todolists/tasksReducer';
import {todolistReducer} from '../features/Todolists/todolistReducer';
import {combineReducers, createStore, applyMiddleware} from 'redux';
import thunk from 'redux-thunk'
import {appReducer} from "./appReducer";
import {authReducer} from "../features/Login/authReducer";


// объединяя reducer-ы с помощью combineReducers,
// мы задаём структуру нашего единственного объекта-состояния
export const rootReducer = combineReducers({
    tasks: tasksReducer,
    todolists: todolistReducer,
    app: appReducer,
    auth: authReducer
})
// непосредственно создаём store
// export const store = createStore(rootReducer);
// определить автоматически тип всего объекта состояния
export type AppRootStateType = ReturnType<typeof rootReducer>

//for redux-devtool
// @ts-ignore
const composeEnhancers = (typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose;
export const store = createStore(rootReducer,composeEnhancers(applyMiddleware(thunk)))

// а это, чтобы можно было в консоли браузера обращаться к store в любой момент store.getSstate
// @ts-ignore
window.store = store;