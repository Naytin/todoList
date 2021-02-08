import React from 'react';
import './App.scss';
import {v1} from "uuid";
import {TodoList} from "./TodoList";

const initialData_1: tasks[] = [
    {id: v1(), title: 'HTML', isDone: true},
    {id: v1(), title: 'CSS/SCSS', isDone: true},
    {id: v1(), title: 'React', isDone: false},
    {id: v1(), title: 'Redux', isDone: false},
]

const initialData_2: tasks[] = [
    {id: v1(), title: 'Garry potter', isDone: true},
    {id: v1(), title: 'Game of the tron', isDone: false},
    {id: v1(), title: 'React', isDone: false},
    {id: v1(), title: 'Redux', isDone: false},
]

function App() {
    const ID_1 = v1();
    const ID_2 = v1();

    const [todolists, setTodolist] = React.useState([
        {id: ID_1, title: 'What to learn?', filter: 'All'},
        {id: ID_2, title: 'What to read?', filter: 'All'}
    ])

    const [tasks, setTasks] = React.useState({
        [ID_1]: initialData_1,
        [ID_2]: initialData_2
    })

    const changeStatus = (taskId: string, isDone: boolean, todoID: string) => {
        let task = tasks[todoID].find(t => t.id === taskId)
        if (task) {
            task.isDone = isDone
            setTasks({...tasks})
        }
    }
    const removeTask = (id: string, todoID: string) => {
        tasks[todoID] = tasks[todoID].filter(t => t.id !== id)
        setTasks({...tasks})
    }

    const addTask = (title: string, todoID: string) => {
        let task = {id: v1(), title: title, isDone: false}
        tasks[todoID] = [...tasks[todoID], task]
        setTasks({...tasks})
    }

    const filterTasks = (value: filterType, todoID: string) => {
        let todolist = todolists.find(t => t.id === todoID)
        if (todolist) {
            todolist.filter = value
            setTodolist([...todolists])
        }
    }

    const removeTodolist = (todoID: string) => {
        setTodolist(todolists.filter(t => t.id !== todoID))
        delete tasks[todoID]
        setTasks({...tasks})
    }


    return (
        <div className="App">
            {todolists.map(todo => {
                const task = tasks[todo.id]
                let tasksForTodoList = task
                if (todo.filter === 'Active') {
                    tasksForTodoList = task.filter(t => !t.isDone)
                }
                if (todo.filter === 'Completed') {
                    tasksForTodoList = task.filter(t => t.isDone)
                }
                return <TodoList
                    title={todo.title}
                    id={todo.id}
                    tasks={tasksForTodoList}
                    removeTask={removeTask}
                    filterTasks={filterTasks}
                    addTask={addTask}
                    filter={todo.filter}
                    changeStatus={changeStatus}
                    removeTodolist={removeTodolist}
                />
            })}

        </div>
    );
}

export default App;


