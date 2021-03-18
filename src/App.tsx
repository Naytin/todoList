import React, {useCallback} from 'react';
import './App.scss';
import {AppBar, Button, Container, Grid, IconButton, makeStyles, Paper, Toolbar, Typography} from "@material-ui/core";
import MenuIcon from '@material-ui/icons/Menu';
import {AddItemForm} from "./Components/AddItemForm";
import {TaskType, Todolist} from "./TodoList";
import {useDispatch, useSelector} from "react-redux";
import {AppRootStateType} from "./state/store";
import {addTodolistAC} from "./state/todolistReducer";

export type FilterValuesType = "all" | "active" | "completed";

export type TodolistType = {
    id: string
    title: string
    filter: FilterValuesType
}

export type TaskStateType = {
    [key: string]: Array<TaskType>
}

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        flexGrow: 1,
    },
}));

function App() {
    const classes = useStyles();
    const todolists = useSelector<AppRootStateType,Array<TodolistType>>(state => state.todolists)
    const tasks = useSelector<AppRootStateType,TaskStateType>(state => state.tasks);
    const dispatch = useDispatch()

    const addTodoList = useCallback((title: string) => {
        dispatch(addTodolistAC(title))
    },[])

    return (
        <div className="App">
            <AppBar position="static">
                <Toolbar>
                    <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" className={classes.title}>
                        My TODO
                    </Typography>
                    <Button color="inherit">Login</Button>
                </Toolbar>
            </AppBar>
            <Container fixed>
                <Grid container style={{padding: '20px'}} justify="center" alignItems="center"
                      direction="column">
                    <div style={{marginRight: '20px'}}>Add new task</div>
                    <AddItemForm  addItem={addTodoList}/>
                </Grid>
                <Grid container spacing={3} >
                    {todolists.map(t => {
                        let allTodoLists = tasks[t.id];
                        return (
                            <Grid item style={{padding: '20px'}}>
                                <Paper style={{padding: '10px'}}>
                                    <Todolist key={t.id}
                                              title={t.title}
                                              tasks={allTodoLists}
                                              filter={t.filter}
                                              id={t.id}
                                    />
                                </Paper>
                            </Grid>
                        )
                    })}
                </Grid>
            </Container>
        </div>
    );
}

export default App;
