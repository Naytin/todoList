import React, {useCallback, useEffect} from "react";
import {Grid, Paper} from "@material-ui/core";
import {AddItemForm} from "../../Components/AddItemForm/AddItemForm";
import {Todolist} from "./Todolist/TodoList";
import {Redirect} from "react-router-dom";
import {useAppSelector} from "../../hooks/useAppSelector";
import {useActions} from "../../hooks/useActions";


export const TodolistsList: React.FC = () => {
    const isLoggedIn = useAppSelector(state => state.auth.isLoggedIn)
    const todolists = useAppSelector(state => state.todolists)
    const tasks = useAppSelector(state => state.tasks);
    const {fetchTodolists, addTodolists} = useActions()

    useEffect(() => {
        if(!isLoggedIn) {
            return
        }
        fetchTodolists()
    }, [])

    const addTodoList = useCallback((title: string) => {
        addTodolists(title)
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