import {handleServerAppError, handleServerNetworkError} from "../../utils/error-utils";
import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {AxiosError} from "axios";
import {tasksAPI} from "../../api/API";
import {TaskType, UpdateTaskModelType} from "../../api/types";
import {AppRootStateType, ThunkError} from "../../utils/types";
import {setAppStatus} from "../actionCreators/appActionCreators";
import {addTodolists, fetchTodolists, removeTodolist} from "./todolistReducer";

const fetchTasks = createAsyncThunk('tasks/fetchTasks',
    async (todolistId: string, {dispatch, rejectWithValue}) => {
        dispatch(setAppStatus({status: 'loading'}))
        try {
            const res = await tasksAPI.getTasks(todolistId)
            dispatch(setAppStatus({status: 'succeeded'}))
            const tasks = res.data.items
            return {tasks, todolistId}
        } catch (err) {
            handleServerNetworkError(err, dispatch)
            return rejectWithValue(null)
        }
    })



const addTask = createAsyncThunk<
    TaskType, { title: string, todolistId: string },
    ThunkError
    >('tasks/addTask',
    async (param, {dispatch, rejectWithValue}) => {
        dispatch(setAppStatus({status: 'loading'}))
        try {
            const res = await tasksAPI.createTask(param.todolistId, param.title)
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

const removeTask = createAsyncThunk('tasks/removeTask',
    async (param: { taskId: string, todolistId: string }, {dispatch, rejectWithValue}) => {
        dispatch(setAppStatus({status: 'loading'}))
        try {
            const res = await tasksAPI.deleteTask(param.taskId, param.todolistId)
            if (res.data.resultCode === 0) {
                dispatch(setAppStatus({status: 'succeeded'}))
                return {taskId: param.taskId, todolistId: param.todolistId}
            } else {
                handleServerAppError(res.data, dispatch)
                return rejectWithValue(null)
            }
        } catch (err) {
            handleServerNetworkError(err, dispatch)
            return rejectWithValue(null)
        }
    })


//универсальная санка, которая помимо taskId и todolistId принимает необходимое поле для изменения status|title
const updateTask = createAsyncThunk('tasks/updateTasks',
    async (param: { taskId: string, todolistId: string, domainModel: UpdateDomainTaskModelType },
           {dispatch, rejectWithValue, getState}) => {
 // так как мы обязаны на сервер отправить все св-ва, которые сервер ожидает, а не только
// те, которые мы хотим обновить, соответственно нам нужно в этом месте взять таску целиком
// чтобы у неё отобрать остальные св-ва
        const state = getState() as AppRootStateType
        const tasksForCurrentTodolist = state.tasks[param.todolistId]
        const task = tasksForCurrentTodolist.find(t => t.id === param.taskId)
        if (!task) {
            return rejectWithValue('task not found in the state')
        }
        const apiModel: UpdateTaskModelType = {
            title: task.title,
            description: task.description,
            status: task.status,
            priority: task.priority,
            startDate: task.startDate,
            deadline: task.deadline,
            ...param.domainModel// перезатираем только то свойство, которое было передано в domainModel
        }
        dispatch(setAppStatus({status: 'loading'}))
        const res = await tasksAPI.updateTask(param.todolistId, param.taskId, apiModel)
        try {
            if (res.data.resultCode === 0) {
                dispatch(setAppStatus({status: 'succeeded'}))
                return param
            } else {
                handleServerAppError(res.data, dispatch)
                return rejectWithValue(null)
            }
        } catch (err) {
            handleServerNetworkError(err, dispatch)
            return rejectWithValue(null)
        }
})

export const asyncActions = {
    fetchTasks,
    addTask,
    removeTask,
    updateTask
}


const initialState: TaskStateType = {
    // "1": [
    //     {
    //         id: "1", title: "CSS",
    //         status: TaskStatuses.New, todoListId: 'todolistId1', description: '', startDate: '',
    //         deadline: '', addedDate: '', order: 0,
    //         priority: TaskPriorities.Low,
    //         entityStatus: 'succeeded' as RequestStatusType,
    //     },
    //     {
    //         id: "2", title: "JS",
    //         status: TaskStatuses.Completed, todoListId: 'todolistId1', description: '', startDate: '',
    //         deadline: '', addedDate: '', order: 0,
    //         priority: TaskPriorities.Low,
    //         entityStatus: 'succeeded' as RequestStatusType,
    //     },
    //     {
    //         id: "3", title: "REACT",
    //         status: TaskStatuses.New, todoListId: 'todolistId1', description: '', startDate: '',
    //         deadline: '', addedDate: '', order: 0,
    //         priority: TaskPriorities.Low,
    //         entityStatus: 'succeeded' as RequestStatusType,
    //     },
    // ],
    // "2": [
    //     {
    //         id: "1", title: "book",
    //         status: TaskStatuses.New, todoListId: 'todolistId1', description: '', startDate: '',
    //         deadline: '', addedDate: '', order: 0,
    //         priority: TaskPriorities.Low,
    //         entityStatus: 'succeeded' as RequestStatusType,
    //     },
    //     {
    //         id: "2", title: "book2",
    //         status: TaskStatuses.New, todoListId: 'todolistId1', description: '', startDate: '',
    //         deadline: '', addedDate: '', order: 0,
    //         priority: TaskPriorities.Low,
    //         entityStatus: 'succeeded' as RequestStatusType,
    //     },
    //     {
    //         id: "3", title: "book3",
    //         status: TaskStatuses.New, todoListId: 'todolistId1', description: '', startDate: '',
    //         deadline: '', addedDate: '', order: 0,
    //         priority: TaskPriorities.Low,
    //         entityStatus: 'succeeded' as RequestStatusType,
    //     },
    //
    // ]
}

const slice = createSlice({
    name: 'tasks',
    initialState: initialState,
    reducers: {
    },
    extraReducers: (builder) => {
        builder.addCase(addTodolists.fulfilled, (state, action) => {
            state[action.payload.id] = []
        });
        builder.addCase(removeTodolist.fulfilled, (state, action) => {
            delete state[action.payload.todolistId]
        });
        builder.addCase(fetchTodolists.fulfilled, (state, action) => {
            action.payload.todos.forEach((tl) => {
                state[tl.id] = []
            })
        });
        builder.addCase(fetchTasks.fulfilled, (state, action) => {
            state[action.payload.todolistId] = action.payload.tasks
        });
        builder.addCase(addTask.fulfilled, (state, action) => {
            state[action.payload.todoListId].unshift(action.payload)
        });
        builder.addCase(removeTask.fulfilled, (state, action) => {
            const tasks = state[action.payload.todolistId]
            const index = tasks.findIndex(t => t.id === action.payload.taskId)
            if (index > -1) {
                tasks.splice(index, 1)
            }
        });
        builder.addCase(updateTask.fulfilled, (state, action) => {
            const tasks = state[action.payload.todolistId]
            const index = tasks.findIndex(t => t.id === action.payload.taskId)
            if (index > -1) {
                tasks[index] = {...tasks[index], ...action.payload.domainModel}
            }
        })
    }
})

export const tasksReducer = slice.reducer

// types
export type TaskStateType = {
    [key: string]: Array<TaskType>
}

// создаем тип, для универсальной санки с необязательными полями, для подстановки нужного поля в санку
type UpdateDomainTaskModelType = {
    title?: string
    description?: string
    status?: number
    priority?: number
    startDate?: string
    deadline?: string
}