import {Dispatch} from "redux";
import {setAppStatusAC} from "../../../app/appReducer";
import {todolistAPI} from "../../../api/API";
import {handleServerAppError, handleServerNetworkError} from "../../../utils/error-utils";
import {
    addTodolistAC,
    changeTitleAC,
    changeTodolistEntityStatusAC,
    removeTodolistAC,
    setTodolistsAC,
    changeFilterAC
} from "../todolistReducer";

export {changeFilterAC}

export const fetchTodolistsTC = () =>
    (dispatch: Dispatch) => {
        dispatch(setAppStatusAC({status: 'loading'}))
        todolistAPI.getTodolist()
            .then((res) => {
                dispatch(setTodolistsAC({todos: res.data}))
                dispatch(setAppStatusAC({status: 'succeeded'}))
            })
            .catch(error => {
                handleServerNetworkError(error, dispatch)
            })

    }


export const addTodolistsTC = (title: string) => (dispatch: Dispatch) => {
    try {
        dispatch(setAppStatusAC({status: 'loading'}))
        todolistAPI.createTodolist(title)//let result =  await todolistAPI.createTodolist(title) возвращает
            .then(res => {
                if (res.data.resultCode === 0) {
                    dispatch(addTodolistAC({todo: res.data.data.item}))
                    dispatch(setAppStatusAC({status: 'succeeded'}))
                } else {
                    handleServerAppError(res.data, dispatch)
                }
            }).catch(error => {
            handleServerNetworkError(error, dispatch)
        })
    } catch (e) {
        throw new Error(e)
    }
}

export const deleteTodolistsTC = (todolistId: string) =>
    (dispatch: Dispatch) => {
        dispatch(setAppStatusAC({status: 'loading'}))
        dispatch(changeTodolistEntityStatusAC({id: todolistId, entityStatus: 'loading'}))
        todolistAPI.deleteTodolist(todolistId)
            .then((res) => {
                if(res.data.resultCode === 0) {
                    const action = removeTodolistAC({todolistID: todolistId})
                    dispatch(action)
                    dispatch(setAppStatusAC({status: 'succeeded'}))
                }else {
                    handleServerAppError(res.data, dispatch)
                }
            }).catch(error => {
            handleServerNetworkError(error, dispatch)
        })
    }

export const updateTodolistTitleTC = (todolistId: string, title: string) =>
    (dispatch: Dispatch) => {
// так как мы обязаны на сервер отправить все св-ва, которые сервер ожидает, а не только
// те, которые мы хотим обновить, соответственно нам нужно в этом месте взять таску целиком
// чтобы у неё отобрать остальные св-ва
        dispatch(setAppStatusAC({status: 'loading'}))
        dispatch(changeTodolistEntityStatusAC({id: todolistId, entityStatus: 'loading'}))
        todolistAPI.updateTodolist(todolistId, title)
            .then(res => {
                if (res.data.resultCode === 0) {
                    const action = changeTitleAC({id: todolistId, title: title})
                    dispatch(action)
                    dispatch(setAppStatusAC({status: 'succeeded'}))
                    dispatch(changeTodolistEntityStatusAC({id: todolistId, entityStatus: 'succeeded'}))
                } else {
                    handleServerAppError(res.data, dispatch)
                }
            }).catch(error => {
            handleServerNetworkError(error, dispatch)
        })
    }