import {tasksAPI, TaskStatuses, TaskType, UpdateTaskModelType} from "../api/task-api";
import {TaskStateType} from "../App";
import {AddTodolistType, RemoveTodolistType, SetTodolistsActionType} from "./todolistReducer";
import {ThunkAction} from "redux-thunk";
import {AppRootStateType} from "./store";

export type RemoveTaskActionType = {
    type: 'REMOVE_TASK'
    taskId: string
    todolistId: string
}

export type AddTaskType = {
    type: 'ADD_TASK'
    task: TaskType
}

export type UpdateTaskType = {
    type: 'UPDATE_TASK'
    todolistId: string
    taskId: string
    model: UpdateDomainTaskModelType
}

export type SetTasksActionType = {
    type: 'SET-TASKS'
    tasks: Array<TaskType>
    todolistId: string
}

type ActionsType = RemoveTaskActionType
    | AddTaskType
    | UpdateTaskType
    | AddTodolistType
    | RemoveTodolistType
    | SetTasksActionType
    | SetTodolistsActionType


let initialState_1 = [
    // {id: v1(), title: "HTML&CSS", isDone: true},
    // {id: v1(), title: "JS", isDone: true},
    // {id: v1(), title: "ReactJS", isDone: false},
    // {id: v1(), title: "Rest API", isDone: false},
    // {id: v1(), title: "GraphQL", isDone: false},
]
let initialState_2 = [
    // {id: v1(), title: "HTML&CSS", isDone: true},
    // {id: v1(), title: "JS", isDone: true},
    // {id: v1(), title: "ReactJS", isDone: false},
    // {id: v1(), title: "Rest API", isDone: false},
    // {id: v1(), title: "GraphQL", isDone: false},
]

const initialState: TaskStateType = {
    // [ID_1]: initialState_1,
    // [ID_2]: initialState_2
}
export const tasksReducer = (state: TaskStateType = initialState, action: ActionsType): TaskStateType => {
    switch (action.type) {
        case 'SET-TASKS': {
            const stateCopy = {...state}
            stateCopy[action.todolistId] = action.tasks
            return stateCopy;
        }
        case 'ADD_TASK':
            const stateCopy = {...state}// copy of state
            const tasks = stateCopy[action.task.todoListId];// find todolist by ID
            const newTask = [action.task, ...tasks]//put task a new task from action(server), and ID of todolist
            stateCopy[action.task.todoListId] = newTask //put a new task by key ID
            return stateCopy;
        case 'REMOVE_TASK':
            return {
                ...state,
                [action.todolistId]: state[action.todolistId].filter(t => t.id !== action.taskId)
            }
        case 'UPDATE_TASK':
            let todolistTasks = state[action.todolistId];
            let newTasksArray = todolistTasks
                .map(t => t.id === action.taskId ? {...t, ...action.model} : t);
            state[action.todolistId] = newTasksArray;
            return ({...state});
        case 'SET-TODOS': {
            const stateCopy = {...state}
            action.todos.forEach((tl) => {
                stateCopy[tl.id] = []
            })
            return stateCopy;
        }
        case 'ADD-TODOLIST':
            return {
                ...state,
                [action.todo.id]: []
            }
        case 'REMOVE-TODOLIST':
            let copyState = {...state}
            delete copyState[action.id]
            return copyState
        default:
            return state
    }
}

export const setTasksAC = (tasks: Array<TaskType>, todolistId: string): SetTasksActionType => {
    return {type: 'SET-TASKS', tasks, todolistId}
}
export const addTaskAC = (task: TaskType): AddTaskType => ({type: 'ADD_TASK', task})
export const removeTaskAC = (taskId: string, todolistId: string): RemoveTaskActionType => ({
    type: 'REMOVE_TASK',
    taskId,
    todolistId
})
export const updateTaskAC = (taskId: string, model: UpdateDomainTaskModelType, todolistId: string): UpdateTaskType =>
    ({type: 'UPDATE_TASK', taskId, model, todolistId})

type ThunkType = ThunkAction<void, AppRootStateType, unknown, ActionsType>
export const fetchTasksTC = (todolistId: string): ThunkType => {
    return (dispatch) => {
        tasksAPI.getTasks(todolistId)
            .then(res => {
                const tasks = res.data.items
                const action = setTasksAC(tasks, todolistId)
                dispatch(action)
            })
    }
}

export const removeTaskTC = (taskId: string, todolistId: string): ThunkType => {
    return (dispatch) => {
        tasksAPI.deleteTask(taskId, todolistId)
            .then(res => {
                const action = removeTaskAC(taskId, todolistId)
                dispatch(action)
            })
    }
}

export const addTaskTC = (title: string, todolistId: string): ThunkType => {
    return (dispatch) => {
        tasksAPI.createTask(todolistId, title)
            .then(res => {
                const action = addTaskAC(res.data.data.item)
                dispatch(action)
            })
    }
}
// создаем тип, для универсальной санки с необязательными полями, для подстановки нужного поля в санку
export type UpdateDomainTaskModelType = {
    title?: string
    description?: string
    status?: number
    priority?: number
    startDate?: string
    deadline?: string
}

// универсальная санка, которая помимо taskId и todolistId принимает необходимое поле для изменения status|title
export const updateTask = (taskId: string, todolistId: string, domainModel: UpdateDomainTaskModelType): ThunkType => {
    return (dispatch, getState: () => AppRootStateType) => {
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

}
