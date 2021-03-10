import {TaskStateType} from "../App";
import {v1} from "uuid";
import {AddTodolistType, ID_1, ID_2, RemoveTodolistType} from "./todolistReducer";

export type RemoveTaskActionType = {
    type: 'REMOVE_TASK'
    taskId: string
    todolistId: string
}

export type AddTaskType = {
    type: 'ADD_TASK'
    value: string
    todolistId: string
}

export type ChangeStatusType = {
    type: 'CHANGE_STATUS'
    taskId: string
    isDone: boolean
    todolistId: string
}

export type ChangeTaskTitleType = {
    type: 'CHANGE_TITLE'
    taskId: string
    newTitle: string
    todolistId: string
}

type ActionTypeS = RemoveTaskActionType
    | AddTaskType
    | ChangeStatusType
    | ChangeTaskTitleType
    | AddTodolistType
    | RemoveTodolistType


let initialState_1 = [
    {id: v1(), title: "HTML&CSS", isDone: true},
    {id: v1(), title: "JS", isDone: true},
    {id: v1(), title: "ReactJS", isDone: false},
    {id: v1(), title: "Rest API", isDone: false},
    {id: v1(), title: "GraphQL", isDone: false},
]
let initialState_2 = [
    {id: v1(), title: "HTML&CSS", isDone: true},
    {id: v1(), title: "JS", isDone: true},
    {id: v1(), title: "ReactJS", isDone: false},
    {id: v1(), title: "Rest API", isDone: false},
    {id: v1(), title: "GraphQL", isDone: false},
]

const initialState: TaskStateType = {
    [ID_1]: initialState_1,
    [ID_2]: initialState_2
}
export const tasksReducer = (state: TaskStateType = initialState, action: ActionTypeS):TaskStateType => {
    switch (action.type) {
        case 'REMOVE_TASK':
            return {
                ...state,
                [action.todolistId]: state[action.todolistId].filter(t => t.id !== action.taskId)
            }
        case 'ADD_TASK':
            const task = {id: v1(), title: action.value, isDone: false};
            return {
                ...state,
                [action.todolistId]: [task, ...state[action.todolistId]]
            }
        case 'CHANGE_STATUS':
            return {
                ...state,
                [action.todolistId]: state[action.todolistId].map(t => t.id === action.taskId ? {
                    ...t,
                    isDone: action.isDone
                } : t)
            }
        case 'CHANGE_TITLE':
            return {
                ...state,
                [action.todolistId]: state[action.todolistId].map(t => t.id === action.taskId ? {
                    ...t,
                    title: action.newTitle
                } : t)
            }
        case 'ADD-TODOLIST':
            return {
                ...state,
                [action.todolistId]: []
            }
        case 'REMOVE-TODOLIST':
            let copyState = {...state}
            delete copyState[action.id]
            return copyState
        default:
            return state
    }
}

export const removeTaskAC = (taskId: string, todolistId: string): RemoveTaskActionType => ({
    type: 'REMOVE_TASK',
    taskId,
    todolistId
})
export const addTaskAC = (value: string, todolistId: string): AddTaskType => ({type: 'ADD_TASK', value, todolistId})
export const changeTaskStatusAC = (taskId: string, isDone: boolean, todolistId: string): ChangeStatusType =>
    ({type: 'CHANGE_STATUS', taskId, isDone, todolistId})
export const changeTaskTitleAC = (taskId: string, newTitle: string, todolistId: string): ChangeTaskTitleType =>
    ({type: 'CHANGE_TITLE', taskId, newTitle, todolistId})

