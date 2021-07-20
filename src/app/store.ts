import {tasksReducer} from '../features/Todolists/tasksReducer';
import {todolistReducer} from '../features/Todolists/todolistReducer';
import {ActionCreatorsMapObject, bindActionCreators, combineReducers} from 'redux';
import thunk from 'redux-thunk'
import {appReducer} from "./appReducer";
import {authReducer} from "../features/Auth/authReducer";
import {configureStore} from "@reduxjs/toolkit";
import {useDispatch} from "react-redux";
import {useMemo} from "react";


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
export type AppRootStateType = ReturnType<typeof rootReducer>

// create our store use configureStore
export const store = configureStore({
    reducer: rootReducer,
    middleware: getDefaultMiddleware => getDefaultMiddleware().prepend(thunk),
})


// а это, чтобы можно было в консоли браузера обращаться к store в любой момент store.getSstate
// @ts-ignore
window.store = store;

type AppDispatchType = typeof store.dispatch
export const useAppDispatch = () => useDispatch<AppDispatchType>()


// создаем hook, который связывает все actions creators с диспатчем
// нам больше не понядобиться использование диспатча в комоненте, просто будем вызывать функцию
//

export const useActions = <T extends ActionCreatorsMapObject>(actions: T) => {
    const dispatch = useAppDispatch()

    const boundActions = useMemo(() => {
        return bindActionCreators(actions,dispatch)
    },[])

    return boundActions
}