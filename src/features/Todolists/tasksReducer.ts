import {TaskPriorities, tasksAPI, TaskStatuses, TaskType, UpdateTaskModelType} from "../../api/API";
import {AddTodolistType, RemoveTodolistType, SetTodolistsActionType} from "./todolistReducer";
import {AppRootStateType} from "../../app/store";
import {Dispatch} from "redux";
import {RequestStatusType, setAppStatusAC} from "../../app/appReducer";
import {handleServerAppError, handleServerNetworkError} from "../../utils/error-utils";

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

export const tasksReducer = (state: TaskStateType = initialState, action: ActionsType): TaskStateType => {
    switch (action.type) {
        case 'SET-TASKS':
            return {...state, [action.todolistId]: action.tasks}
        case 'ADD_TASK':
            return {...state, [action.task.todoListId]: [action.task, ...state[action.task.todoListId]]}
        case 'REMOVE_TASK':
            return {...state, [action.todolistId]: state[action.todolistId].filter(t => t.id !== action.taskId)}
        case 'UPDATE_TASK':
            return {
                ...state, [action.todolistId]: state[action.todolistId]
                    .map(t => t.id === action.taskId ? {...t, ...action.model} : t)
            }
        case 'CHANGE-TASK-ENTITY-STATUS':
            return {
                ...state, [action.todolistId]: state[action.todolistId]
                    .map(t => t.id === action.taskId ? {...t, entityStatus: action.entityStatus} : t)
            }
        case 'SET-TODOS':
            const stateCopy = {...state}
            action.todos.forEach((tl) => {
                stateCopy[tl.id] = []
            })
            return stateCopy;
        case 'ADD-TODOLIST':
            return {...state, [action.todo.id]: []}
        case 'REMOVE-TODOLIST':
            let copyState = {...state}
            delete copyState[action.id]
            return copyState
        default:
            return state
    }
}
// actions
export const setTasksAC = (tasks: Array<TaskType>, todolistId: string) => ({
    type: 'SET-TASKS',
    tasks,
    todolistId
}) as const
export const addTaskAC = (task: TaskType) =>
    ({type: 'ADD_TASK', task}) as const
export const removeTaskAC = (taskId: string, todolistId: string) =>
    ({type: 'REMOVE_TASK', taskId, todolistId}) as const
export const updateTaskAC = (taskId: string, model: UpdateDomainTaskModelType, todolistId: string) =>
    ({type: 'UPDATE_TASK', taskId, model, todolistId}) as const
export const changeTaskEntityStatusAC = (taskId: string, todolistId: string, entityStatus: RequestStatusType) =>
    ({type: 'CHANGE-TASK-ENTITY-STATUS', taskId, todolistId, entityStatus}) as const


// thunks
export const fetchTasksTC = (todolistId: string) =>
    (dispatch: Dispatch) => {
        dispatch(setAppStatusAC({status: 'loading'}))
        tasksAPI.getTasks(todolistId)
            .then(res => {
                const tasks = res.data.items
                const action = setTasksAC(tasks, todolistId)
                dispatch(action)
                dispatch(setAppStatusAC({status: 'succeeded'}))
            }).catch(error => {
            handleServerNetworkError(error, dispatch)
        })
    }

export const removeTaskTC = (taskId: string, todolistId: string) =>
    (dispatch: Dispatch) => {
        dispatch(setAppStatusAC({status: 'loading'}))
        dispatch(changeTaskEntityStatusAC(taskId, todolistId, 'loading'))
        tasksAPI.deleteTask(taskId, todolistId)
            .then(res => {
                if (res.data.resultCode === 0) {
                    const action = removeTaskAC(taskId, todolistId)
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
                    const action = addTaskAC(res.data.data.item)
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
        dispatch(changeTaskEntityStatusAC(taskId, todolistId, 'loading'))
        tasksAPI.updateTask(todolistId, taskId, apiModel)
            .then(res => {
                if (res.data.resultCode === 0) {
                    const action = updateTaskAC(taskId, domainModel, todolistId)
                    dispatch(action)
                    dispatch(setAppStatusAC({status: 'succeeded'}))
                    dispatch(changeTaskEntityStatusAC(taskId, todolistId, 'succeeded'))
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

type ActionsType =
    | ReturnType<typeof setTasksAC>
    | ReturnType<typeof addTaskAC>
    | ReturnType<typeof removeTaskAC>
    | ReturnType<typeof updateTaskAC>
    | ReturnType<typeof changeTaskEntityStatusAC>
    | AddTodolistType
    | SetTodolistsActionType
    | RemoveTodolistType

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