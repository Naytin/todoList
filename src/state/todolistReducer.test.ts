import {addTodolistAC, changeFilterAC, changeTitleAC, removeTodolistAC, todolistReducer} from './todolistReducer';
import {v1} from 'uuid'
import {TodolistType} from "../App";

let todolistId: string
let todolistId2: string
let startState: Array<TodolistType> = []

beforeEach(() => {
    todolistId = v1()
    todolistId2 = v1()
    startState = [
        { id: todolistId, title: "What to learn?", filter: 'all' },
        { id: todolistId2, title: "What to buy?", filter: 'all' },
    ]
})


test('correct todolist should be removed', () => {
    const endState = todolistReducer(startState, removeTodolistAC(todolistId2))
    expect(endState.length).toBe(1)
    expect(endState[0].id).toBe(todolistId)
    expect(endState === startState).toBeFalsy();
})

test('new todolist should be added', () => {
    const newTodolistTitle = 'New TodoList'
    const endState = todolistReducer(startState, addTodolistAC(newTodolistTitle))

    expect(endState.length).toBe(3)
    expect(endState[2].title).toBe(newTodolistTitle)
})

test('correct filter of todolist should be changed', () => {
    const endState = todolistReducer(startState, changeFilterAC('completed',todolistId))

    expect(endState[0].filter).toBe('completed')
    expect(endState[1].filter).toBe('all')
})

test('correct todolist should change its name', () => {
    const newTodoTitle = 'How to learn?'
    const endState = todolistReducer(startState, changeTitleAC(newTodoTitle,todolistId))

    expect(endState[0].title).toBe(newTodoTitle)
    expect(endState[1].title).toBe("What to buy?")
    expect(endState[1].id).toBe(todolistId2)
})