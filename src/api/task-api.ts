import axios from 'axios'
import {RequestStatusType} from "../app/app.Reducer";

const instance = axios.create({
    baseURL: 'https://social-network.samuraijs.com/api/1.1/',
    withCredentials: true,
    headers: {
        'API-KEY': 'a409a2ec-60ad-4ff6-9051-8f6025edc2fd'
    }
})

// api
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

// types
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







