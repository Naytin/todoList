import axios from 'axios'
import {RequestStatusType} from "../app/appReducer";

export const instance = axios.create({
    baseURL: 'https://social-network.samuraijs.com/api/1.1/',
    withCredentials: true,
    headers: {
        'API-KEY': 'a409a2ec-60ad-4ff6-9051-8f6025edc2fd'
        // 'API-KEY': 'd700f3f2-767b-4068-ac9d-6d0dcd5ff82d' // test account
    }
})

// tasks API
export const tasksAPI = {
    getTasks(todolistId: string) {
        return  instance.get<GetTasksResponse>(`todo-lists/${todolistId}/tasks`)
    },
    createTask(todolistId: string, title: string) {
        return  instance.post<ResponseType<{item: TaskType}>>(`todo-lists/${todolistId}/tasks`, {title: title})
    },
    deleteTask(taskId: string, todolistId: string) {
        return  instance.delete<ResponseType>(`todo-lists/${todolistId}/tasks/${taskId}`)
    },
    updateTask(todolistId: string, taskId: string, model: UpdateTaskModelType) {
        return  instance.put<ResponseType<TaskType>>(`todo-lists/${todolistId}/tasks/${taskId}`, model)
    }
}
// todolist API
export const todolistAPI = {
    getTodolist() {
        return  instance.get<Array<TodolistType>>(`todo-lists`)
    },
    createTodolist(title: string) {
        return  instance.post<ResponseType<{item: TodolistType}>>(`todo-lists`, {title})
    },
    deleteTodolist(todolistId: string, ) {
        return  instance.delete<ResponseType>(`todo-lists/${todolistId}`)
    },
    updateTodolist(todolistId: string, title: string) {
        return  instance.put<ResponseType>(`todo-lists/${todolistId}`, {title})
    }
}

// auth API
export const authAPI = {
    login(data: ParamsLoginType) {
        return instance.post<ResponseType<{userId: number}>>(`auth/login`, data)
    },
    logout() {
        return instance.delete<ResponseType<{}>>(`auth/login`)
    },
    auth() {
        return instance.get<ResponseType<{id: number, email: string, login: string}>>(`auth/me`)
    }
}


// types
export type ParamsLoginType = {
    email: string
    password: string
    rememberMe: boolean
    captcha?: string
}

export type TodolistType= {
    id: string
    addedDate: string
    order: number
    title: string
}

type GetTasksResponse = {
    error: string | null
    totalCount: number
    items: TaskType[]
}
export type ResponseType<T = {}> = {
    resultCode: number
    messages: Array<string>
    data: T
}
export enum TaskStatuses {
    New = 0,
    InProgress = 1,
    Completed = 2,
    Draft = 3
}
export enum TaskPriorities {
    Low = 0,
    Middle = 1,
    Hi = 2,
    Urgently = 3,
    Later = 4
}
export type TaskType = {
    description: string
    title: string
    status: TaskStatuses
    priority: TaskPriorities
    startDate: string
    deadline: string
    id: string
    todoListId: string
    order: number
    addedDate: string
    entityStatus: RequestStatusType
}
export type UpdateTaskModelType = {
    title: string
    description: string
    status: number
    priority: number
    startDate: string
    deadline: string
}







