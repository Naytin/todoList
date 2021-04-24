import {tasksAPI, TaskType, UpdateTaskModelType} from "../../api/task-api";
import {AddTodolistType, RemoveTodolistType, SetTodolistsActionType} from "./todolistReducer";
import {ThunkAction} from "redux-thunk";
import {AppRootStateType} from "../../app/store";

const initialState: TaskStateType = {}

export const tasksReducer = (state: TaskStateType = initialState, action: ActionsType): TaskStateType => {
    switch (action.type) {
        case 'SET-TASKS':
            return {...state, [action.todolistId]: action.tasks}
        case 'ADD_TASK':
            return {...state, [action.task.todoListId]: [action.task, ...state[action.task.todoListId]]}
        case 'REMOVE_TASK':
            return {...state, [action.todolistId]: state[action.todolistId].filter(t => t.id !== action.taskId)}
        case 'UPDATE_TASK':
            return {...state, [action.todolistId]: state[action.todolistId]
                    .map(t => t.id === action.taskId ? {...t, ...action.model}: t)}
        case 'SET-TODOS':
            const stateCopy = {...state}
            action.todos.forEach((tl) => {
                stateCopy[tl.id] = []})
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


// thunks
export const fetchTasksTC = (todolistId: string): ThunkType =>
    (dispatch) => {
    tasksAPI.getTasks(todolistId)
        .then(res => {
            const tasks = res.data.items
            const action = setTasksAC(tasks, todolistId)
            dispatch(action)
        })
}

export const removeTaskTC = (taskId: string, todolistId: string): ThunkType =>
    (dispatch) => {
    tasksAPI.deleteTask(taskId, todolistId)
        .then(res => {
            const action = removeTaskAC(taskId, todolistId)
            dispatch(action)
        })
}

export const addTaskTC = (title: string, todolistId: string): ThunkType =>
    (dispatch) => {
    tasksAPI.createTask(todolistId, title)
        .then(res => {
            const action = addTaskAC(res.data.data.item)
            dispatch(action)
        })
}

// универсальная санка, которая помимо taskId и todolistId принимает необходимое поле для изменения status|title
export const updateTask = (taskId: string, todolistId: string, domainModel: UpdateDomainTaskModelType): ThunkType =>
    (dispatch, getState: () => AppRootStateType) => {
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
        tasksAPI.updateTask(todolistId, taskId, apiModel).then(res => {
            const action = updateTaskAC(taskId, domainModel, todolistId)
            dispatch(action)
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
    | AddTodolistType
    | SetTodolistsActionType
    | RemoveTodolistType

type ThunkType = ThunkAction<void, AppRootStateType, unknown, ActionsType>
// создаем тип, для универсальной санки с необязательными полями, для подстановки нужного поля в санку
type UpdateDomainTaskModelType = {
    title?: string
    description?: string
    status?: number
    priority?: number
    startDate?: string
    deadline?: string
}