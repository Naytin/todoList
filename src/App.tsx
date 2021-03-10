import React from 'react';
import './App.scss';
import {AppBar, Button, Container, Grid, IconButton, makeStyles, Paper, Toolbar, Typography} from "@material-ui/core";
import MenuIcon from '@material-ui/icons/Menu';
import {AddItemForm} from "./Components/EditableSpan";
import {TaskType, Todolist} from "./TodoList";
import {useDispatch, useSelector} from "react-redux";
import {AppRootStateType} from "./state/store";
import {addTaskAC, changeTaskStatusAC, changeTaskTitleAC, removeTaskAC} from "./state/tasksReducer";
import {addTodolistAC, changeFilterAC, changeTitleAC, removeTodolistAC} from "./state/todolistReducer";

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

    function removeTask(id: string, taskId: string) {
        dispatch(removeTaskAC(id, taskId));
    }
    function addTask(title: string, taskId: string) {
        dispatch(addTaskAC(title,taskId));
    }
    function changeStatus(id: string, isDone: boolean, taskId: string) {
        dispatch(changeTaskStatusAC(id, isDone,taskId));
    }
    function changeFilter(value: FilterValuesType, taskId: string) {
        dispatch(changeFilterAC(value, taskId));
    }

    function addTodoList(title: string) {
        dispatch(addTodolistAC(title))
    }
    function removeTodolist(id: string) {
        dispatch(removeTodolistAC(id))
    }
    function changeTaskTitle(taskID: string, newTitle: string, todoID: string) {
        dispatch(changeTaskTitleAC(taskID,newTitle,todoID))
    }
    function changeTodoTitle(newTodoTitle: string, todoID: string) {
        dispatch(changeTitleAC(newTodoTitle,todoID))
    }

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
                        let tasksForTodolist = allTodoLists
                        if (t.filter === "active") {
                            tasksForTodolist = allTodoLists.filter(t => !t.isDone);
                        }
                        if (t.filter === "completed") {
                            tasksForTodolist = allTodoLists.filter(t => t.isDone);
                        }
                        return (
                            <Grid item style={{padding: '20px'}}>
                                <Paper style={{padding: '10px'}}>
                                    <Todolist key={t.id} title={t.title}
                                              tasks={tasksForTodolist}
                                              removeTask={removeTask}
                                              changeFilter={changeFilter}
                                              addTask={addTask}
                                              changeTaskStatus={changeStatus}
                                              filter={t.filter}
                                              id={t.id}
                                              removeTodolist={removeTodolist}
                                              changeTaskTitle={changeTaskTitle}
                                              changeTodoTitle={changeTodoTitle}
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
