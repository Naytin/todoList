import React, {useCallback, useEffect} from "react";
import {Grid, makeStyles, Paper} from "@material-ui/core";
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

    const classes = useStyles()

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

    if (!isLoggedIn) {
        return <Redirect to={'/login'}/>
    }
    return <>
        <Grid container className={classes.container}
              justify="center"
              alignItems="center"
              direction="column">
            <h3 className={classes.title}>Add new task</h3>
            <AddItemForm addItem={addTodoList}/>
        </Grid>
        <Grid container wrap={'nowrap'} className={classes.todosContainer}>
            {todolists.map(t => {
                let allTodoLists = tasks[t.id];
                return (
                    <Grid key={t.id} item className={classes.container}>
                        <Paper elevation={4} className={classes.container}>
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

const useStyles = makeStyles(() => ({
    container: {
        padding: '20px',
    },
    todosContainer: {
        padding: '0  20px 200px',
    },
    title: {
        fontSize: '2rem',
        textDecoration: 'upperCase'
    }
}));
