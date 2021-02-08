interface tasks {
    id: string
    title: string
    isDone: boolean
}

type filterType = 'All' | 'Active' | 'Completed';

type todoList = {
    id: string
    title: string
    tasks: tasks[]
    removeTask: (id: string,todoID: string) => void
    filterTasks: (value: filterType, todoID: string) => void
    addTask: (title: string, todoID: string) => void
    filter: string
    changeStatus: (taskId: string, isDone: boolean,todoID: string) => void
    removeTodolist: (todoID: string) => void
}