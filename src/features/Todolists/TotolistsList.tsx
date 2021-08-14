import React, {useCallback, useEffect} from "react";
import {AddItemForm} from "../../Components/AddItemForm/AddItemForm";
import {Todolist} from "./Todolist/TodoList";
import {Redirect} from "react-router-dom";
import {useAppSelector} from "../../utils/hooks/useAppSelector";
import {useActions, useAppDispatch} from "../../utils/hooks/useActions";
import {todolistAsyncActions} from "../../store/actionCreators";
import style from './Todolists.module.scss'
import {icons} from "../../assets/icons";


export const TodolistsList: React.FC = () => {
    const isLoggedIn = useAppSelector(state => state.auth.isLoggedIn)
    const todolists = useAppSelector(state => state.todolists)
    const status = useAppSelector(state => state.app.status)
    const tasks = useAppSelector(state => state.tasks);

    const {fetchTodolists} = useActions(todolistAsyncActions)
    const {addTodolists} = todolistAsyncActions

    const dispatch = useAppDispatch()

    useEffect(() => {
        if (!isLoggedIn) {
            return
        }
        fetchTodolists()
    }, [])

    const addTodoList = useCallback(async (title: string) => {
        const action = await dispatch(addTodolists(title))

        if (addTodolists.rejected.match(action)) {
            if (action.payload?.fieldsErrors?.length) {
                const error = action.payload?.fieldsErrors[0]
                throw new Error(error.error)
            } else {
                throw new Error('Some error occurred')
            }
        }
    }, [])

    const statusLoading = status === 'loading'

    if (!isLoggedIn) {
        return <Redirect to={'/login'}/>
    }

    return <>
        <div className="mt-10">
            <AddItemForm addItem={addTodoList} placeholder='Create new todo' disabled={statusLoading} icon={icons.plus}/>
        </div>
        <div className={`flex flex-wrap justify-center md:justify-start `}>

        {todolists.map(t => {
                let allTodoLists = tasks[t.id];
                return (
                    <div key={t.id} className={`${style.todo} p-4 flex justify-center `}>
                        <Todolist key={t.id}
                                  todolist={t}
                                  title={t.title}
                                  tasks={allTodoLists}
                                  filter={t.filter}
                                  todolistId={t.id}
                        />
                    </div>
                )
            })}
        </div>
    </>
}

