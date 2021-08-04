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

export type GetTasksResponse = {
    error: string | null
    totalCount: number
    items: TaskType[]
}

export type FieldError = {
    field: string
    error: string
}
export type ResponseType<T = {}> = {
    resultCode: number
    messages: Array<string>
    fieldsErrors?: Array<FieldError>
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
}
export type UpdateTaskModelType = {
    title: string
    description: string
    status: number
    priority: number
    startDate: string
    deadline: string
}
