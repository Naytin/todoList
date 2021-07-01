import {TaskPriorities, tasksAPI, TaskStatuses, TaskType, TodolistType, UpdateTaskModelType} from "../../api/API";
import {
    addTodolistAC,
    removeTodolistAC,
    setTodolistsAC,
} from "./todolistReducer";
import {AppRootStateType} from "../../app/store";
import {Dispatch} from "redux";
import {RequestStatusType, setAppStatusAC} from "../../app/appReducer";
import {handleServerAppError, handleServerNetworkError} from "../../utils/error-utils";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

const initialState: TaskStateType = {
    "1": [
        {
            id: "1", title: "CSS",
            status: TaskStatuses.New, todoListId: 'todolistId1', description: '', startDate: '',
            deadline: '', addedDate: '', order: 0,
            priority: TaskPriorities.Low,
            entityStatus: 'succeeded' as RequestStatusType,
        },
        {
            id: "2", title: "JS",
            status: TaskStatuses.Completed, todoListId: 'todolistId1', description: '', startDate: '',
            deadline: '', addedDate: '', order: 0,
            priority: TaskPriorities.Low,
            entityStatus: 'succeeded' as RequestStatusType,
        },
        {
            id: "3", title: "REACT",
            status: TaskStatuses.New, todoListId: 'todolistId1', description: '', startDate: '',
            deadline: '', addedDate: '', order: 0,
            priority: TaskPriorities.Low,
            entityStatus: 'succeeded' as RequestStatusType,
        },
    ],
    "2": [
        {
            id: "1", title: "book",
            status: TaskStatuses.New, todoListId: 'todolistId1', description: '', startDate: '',
            deadline: '', addedDate: '', order: 0,
            priority: TaskPriorities.Low,
            entityStatus: 'succeeded' as RequestStatusType,
        },
        {
            id: "2", title: "book2",
            status: TaskStatuses.New, todoListId: 'todolistId1', description: '', startDate: '',
            deadline: '', addedDate: '', order: 0,
            priority: TaskPriorities.Low,
            entityStatus: 'succeeded' as RequestStatusType,
        },
        {
            id: "3", title: "book3",
            status: TaskStatuses.New, todoListId: 'todolistId1', description: '', startDate: '',
            deadline: '', addedDate: '', order: 0,
            priority: TaskPriorities.Low,
            entityStatus: 'succeeded' as RequestStatusType,
        },

    ]
}

const slice = createSlice({
    name: 'tasks',
    initialState: initialState,
    reducers: {
        setTasksAC: (state, action: PayloadAction<SetTaskType>) => {
            state[action.payload.todolistId] = action.payload.tasks
        },
        addTaskAC: (state, action: PayloadAction<{ task: TaskType }>) => {
            state[action.payload.task.todoListId].unshift(action.payload.task)
        },
        removeTaskAC: (state, action: PayloadAction<RemoveTaskType>) => {
            const tasks = state[action.payload.todolistId]
            const index = tasks.findIndex(t => t.id === action.payload.taskId)
            if (index > -1) {
                tasks.splice(index, 1)
            }
        },
        updateTaskAC: (state, action: PayloadAction<UpdateTaskType>) => {
            const tasks = state[action.payload.todolistId]
            const index = tasks.findIndex(t => t.id === action.payload.taskId)
            if (index > -1) {
                tasks[index] = {...tasks[index], ...action.payload.model}
            }
        },
        changeTaskEntityStatusAC: (state, action: PayloadAction<ChangeTaskEntityType>) => {
            const tasks = state[action.payload.todolistId]
            const index = tasks.findIndex(t => t.id === action.payload.taskId)
            if (index > -1) {
                tasks[index].entityStatus = action.payload.entityStatus
            }
        }
    },//
    extraReducers: (builder) => {
        builder.addCase(addTodolistAC, (state, action) => {
            state[action.payload.todo.id] = []
        });
        builder.addCase(removeTodolistAC, (state, action) => {
            delete state[action.payload.todolistID]
        });
        builder.addCase(setTodolistsAC, (state, action) => {
            action.payload.todos.forEach((tl) => {
                state[tl.id] = []
            })
        })
        // [setTodolistsAC.type]: (state, action: PayloadAction<{}>) => {},
        // [removeTodolistAC.type]: (state, action: PayloadAction<{todos: Array<TodolistType>}>) => {},
        // [addTodolistAC.type]: (state, action: PayloadAction<{todos: Array<TodolistType>}>) => {},
    }
})

type ChangeTaskEntityType = { taskId: string, todolistId: string, entityStatus: RequestStatusType }
type UpdateTaskType = { taskId: string, model: UpdateDomainTaskModelType, todolistId: string }
type RemoveTaskType = { taskId: string, todolistId: string }
type SetTaskType = { tasks: Array<TaskType>, todolistId: string }

export const tasksReducer = slice.reducer
export const {setTasksAC,addTaskAC,removeTaskAC,updateTaskAC,changeTaskEntityStatusAC} = slice.actions


// thunks
export const fetchTasksTC = (todolistId: string) =>
    (dispatch: Dispatch) => {
        dispatch(setAppStatusAC({status: 'loading'}))
        tasksAPI.getTasks(todolistId)
            .then(res => {
                const tasks = res.data.items
                const action = setTasksAC({tasks, todolistId})
                dispatch(action)
                dispatch(setAppStatusAC({status: 'succeeded'}))
            }).catch(error => {
            handleServerNetworkError(error, dispatch)
        })
    }

export const removeTaskTC = (taskId: string, todolistId: string) =>
    (dispatch: Dispatch) => {
        dispatch(setAppStatusAC({status: 'loading'}))
        dispatch(changeTaskEntityStatusAC({taskId, todolistId, entityStatus: 'loading'}))
        tasksAPI.deleteTask(taskId, todolistId)
            .then(res => {
                if (res.data.resultCode === 0) {
                    const action = removeTaskAC({taskId, todolistId})
                    dispatch(action)
                    dispatch(setAppStatusAC({status: 'succeeded'}))
                } else {
                    handleServerAppError(res.data, dispatch)
                }
            }).catch(error => {
            handleServerNetworkError(error, dispatch)
        })
    }

export const addTaskTC = (title: string, todolistId: string) =>
    (dispatch: Dispatch) => {
        dispatch(setAppStatusAC({status: 'loading'}))
        tasksAPI.createTask(todolistId, title)
            .then(res => {
                if (res.data.resultCode === 0) {
                    const action = addTaskAC({task: res.data.data.item})
                    dispatch(action)
                    dispatch(setAppStatusAC({status: 'succeeded'}))
                } else {
                    handleServerAppError(res.data, dispatch)
                }
            }).catch(error => {
            handleServerNetworkError(error, dispatch)
        })

    }

// универсальная санка, которая помимо taskId и todolistId принимает необходимое поле для изменения status|title
export const updateTask = (taskId: string, todolistId: string, domainModel: UpdateDomainTaskModelType) =>
    (dispatch: Dispatch, getState: () => AppRootStateType) => {
// так как мы обязаны на сервер отправить все св-ва, которые сервер ожидает, а не только
// те, которые мы хотим обновить, соответственно нам нужно в этом месте взять таску целиком
// чтобы у неё отобрать остальные св-ва
        const allTasksFromState = getState().tasks
        const tasksForCurrentTodolist = allTasksFromState[todolistId]
        const task = tasksForCurrentTodolist.find(t => t.id === taskId)
        if (!task) {
            console.warn('task not found in the state')
            return
        }
        const apiModel: UpdateTaskModelType = {
            title: task.title,
            description: task.description,
            status: task.status,
            priority: task.priority,
            startDate: task.startDate,
            deadline: task.deadline,
            ...domainModel// перезатираем только то свойство, которое было передано в domainModel
        }
        dispatch(setAppStatusAC({status: 'loading'}))
        dispatch(changeTaskEntityStatusAC({taskId, todolistId, entityStatus: 'loading'}))
        tasksAPI.updateTask(todolistId, taskId, apiModel)
            .then(res => {
                if (res.data.resultCode === 0) {
                    const action = updateTaskAC({taskId,model: domainModel, todolistId})
                    dispatch(action)
                    dispatch(setAppStatusAC({status: 'succeeded'}))
                    dispatch(changeTaskEntityStatusAC({taskId, todolistId, entityStatus: 'succeeded'}))
                } else {
                    handleServerAppError(res.data, dispatch)
                }
            }).catch(error => {
            handleServerNetworkError(error, dispatch)
        })

    }

// types
export type TaskStateType = {
    [key: string]: Array<TaskType>
}

// type ActionsType =
//     | ReturnType<typeof setTasksAC>
//     | ReturnType<typeof addTaskAC>
//     | ReturnType<typeof removeTaskAC>
//     | ReturnType<typeof updateTaskAC>
//     | ReturnType<typeof changeTaskEntityStatusAC>
//     | AddTodolistType
//     | SetTodolistsActionType
//     | RemoveTodolistType

// создаем тип, для универсальной санки с необязательными полями, для подстановки нужного поля в санку
type UpdateDomainTaskModelType = {
    title?: string
    description?: string
    status?: number
    priority?: number
    startDate?: string
    deadline?: string
    entityStatus?: RequestStatusType
}