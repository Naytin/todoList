import React, {useCallback, useEffect} from "react";
import {Grid, Paper} from "@material-ui/core";
import {AddItemForm} from "../../Components/AddItemForm/AddItemForm";
import {Todolist} from "./Todolist/TodoList";
import {Redirect} from "react-router-dom";
import {useAppSelector} from "../../utils/hooks/useAppSelector";
import {useActions, useAppDispatch} from "../../utils/hooks/useActions";
import {todolistAsyncActions} from "../../store/actionCreators";


export const TodolistsList: React.FC = () => {
    const isLoggedIn = useAppSelector(state => state.auth.isLoggedIn)
    const todolists = useAppSelector(state => state.todolists)
    const tasks = useAppSelector(state => state.tasks);
    const {fetchTodolists} = useActions(todolistAsyncActions)
    const {addTodolists} = todolistAsyncActions

    const dispatch = useAppDispatch()

    useEffect(() => {
        if(!isLoggedIn) {
            return
        }
        fetchTodolists()
    }, [])

    const addTodoList = useCallback(async (title: string) => {
        const action = await dispatch(addTodolists(title))

        //@ts-ignore
        if (addTodolists.rejected.match(action)) {
            if (action.payload?.fieldsErrors?.length) {
                const error = action.payload?.fieldsErrors[0]
                throw new Error(error.error)
            }else {
                throw new Error('Some error occurred')
            }
        }
    }, [])

    if(!isLoggedIn) {
        return <Redirect to={'/login'}/>
    }
    return <>
        <Grid container  style={{padding: '20px'}}
              justify="center"
              alignItems="center"
              direction="column">
            <div style={{marginRight: '20px'}}>Add new task</div>
            <AddItemForm addItem={addTodoList}/>
        </Grid>
        <Grid container wrap={'nowrap'} style={{overflowY: 'auto', padding: '0  20px 200px'}}>
            {todolists.map(t => {
                let allTodoLists = tasks[t.id];
                return (
                    <Grid key={t.id} item style={{padding: '20px'}}>
                        <Paper style={{padding: '10px'}}>
                            <Todolist key={t.id}
                                      todolist={t}
                                      title={t.title}
                                      tasks={allTodoLists}
                                      filter={t.filter}
                                      todolistId={t.id}
                            />
                        </Paper>
                    </Grid>
                )
            })}
        </Grid>
    </>
}