import React, {ChangeEvent, KeyboardEvent} from "react";

export const TodoList: React.FC<todoList> = ({
                                                 id,
                                                 title,
                                                 tasks,
                                                 removeTask,
                                                 filterTasks,
                                                 addTask,
                                                 filter,
                                                 changeStatus,
                                                 removeTodolist
                                             }) => {
    const [taskTitle, setTaskTitle] = React.useState('')
    const [error, setError] = React.useState<string | null>(null)

    const changeTitleHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setError(null)
        setTaskTitle(e.currentTarget.value)
    }
    const setTitleHandler = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') addNewTask()
    }

    const addNewTask = () => {
        if (taskTitle.trim() !== '') {
            addTask(taskTitle.trim(), id)
            setTaskTitle('')
        } else {
            setTaskTitle('')
            setError('You need to write new task')
        }
    }

    const removeTodo = () => {
        removeTodolist(id)
    }

    const all = () => filterTasks('All', id)
    const active = () => filterTasks('Active', id)
    const completed = () => filterTasks('Completed', id)

    const task = tasks.map(t => {
        const onRemoveHandler = () => removeTask(t.id, id)
        const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
            let isDone = e.currentTarget.checked
            changeStatus(t.id, isDone, id)
        }
        return (
            <li key={t.id} className={t.isDone ? 'is__done' : ''}>
                <input type="checkbox" onChange={onChangeHandler} checked={t.isDone}/>
                <span>{t.title}</span>
                <button onClick={onRemoveHandler}>+</button>
            </li>
        )
    })

    return (
        <div>
            <div className={'title__wrapper'}>
                <h1>{title}</h1>
                <button onClick={removeTodo}>+</button>
            </div>
            <div>
                <input className={error ? 'error__input' : 'default__input'} value={taskTitle}
                       onChange={changeTitleHandler} onKeyPress={setTitleHandler}/>
                <button onClick={addNewTask}>+</button>
                {error && <div className='error'>{error}</div>}
            </div>
            <ul className="list">
                {task}
            </ul>
            <div>
                <button className={filter === 'All' ? 'active' : ''} onClick={all}>All</button>
                <button className={filter === 'Active' ? 'active' : ''} onClick={active}>Active</button>
                <button className={filter === 'Completed' ? 'active' : ''} onClick={completed}>Completed</button>
            </div>
        </div>
    )
}