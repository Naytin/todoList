import axios from 'axios'
import {GetTasksResponse, ParamsLoginType, TaskType, TodolistType, UpdateTaskModelType, ResponseType} from "./types";

export const instance = axios.create({
    baseURL: 'https://social-network.samuraijs.com/api/1.1/',
    withCredentials: true,
    headers: {
        'API-KEY': '8ae82934-b8b0-4b53-b8a7-45ce7dfdf433'
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








