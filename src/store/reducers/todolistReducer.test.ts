import {
    addTodolists,
    changeFilterAC, fetchTodolists, removeTodolist, TodolistDomainType,
    todolistReducer, updateTodolistTitle
} from './todolistReducer';
import {v1} from 'uuid'

let todolistId: string
let todolistId2: string
let startState: TodolistDomainType[] = []

beforeEach(() => {
    todolistId = v1()
    todolistId2 = v1()
    startState = [
        {
            id: todolistId,
            addedDate: '',
            order: 0,
            title: 'React',
            filter: 'all',
            entityStatus: "idle"
        },
        {
            id: todolistId2,
            addedDate: '',
            order: 0,
            title: 'HTML',
            filter: 'all',
            entityStatus: "idle"
        },
    ]
})


test('correct todolist should be removed', () => {
    const action = removeTodolist.fulfilled({todolistId: todolistId2}, '', todolistId2)
    const endState = todolistReducer(startState, action)
    expect(endState.length).toBe(1)
    expect(endState[0].id).toBe(todolistId)
    expect(endState === startState).toBeFalsy();
})

test('new todolist should be added', () => {
    const newTodo = {
        id: '222',
        addedDate: '',
        order: 0,
        title: 'new todo',
        filter: 'all'
    }
    const action = addTodolists.fulfilled({todo: newTodo}, '', newTodo.title)
    const endState = todolistReducer(startState, action)

    expect(endState.length).toBe(3)
    expect(endState[0].title).toBe('React')
    expect(endState[1].title).toBe('HTML')
    expect(endState[2].title).toBe('new todo')

})

test('correct filter of todolist should be changed', () => {
    const endState = todolistReducer(startState, changeFilterAC({filter: 'completed',id: todolistId}))

    expect(endState[0].filter).toBe('completed')
    expect(endState[1].filter).toBe('all')
})

test('correct todolist should change its name', () => {
    const newTodoTitle = 'React'
    const action = updateTodolistTitle.fulfilled({todolistId, title: newTodoTitle}, '',{todolistId, title: newTodoTitle})
    const endState = todolistReducer(startState, action)

    expect(endState[0].title).toBe(newTodoTitle)
    expect(endState[1].title).toBe("HTML")
    expect(endState[1].id).toBe(todolistId2)
})

test('todolist should be set to the state', () => {
    const action = fetchTodolists.fulfilled({todos: startState}, '')
    const endState = todolistReducer([], action)

    expect(endState.length).toBe(2)

})