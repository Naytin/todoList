import React, {useState} from 'react';
import './App.scss';
import {v1} from 'uuid';
import {AppBar, Button, Container, Grid, IconButton, makeStyles, Paper, Toolbar, Typography} from "@material-ui/core";
import MenuIcon from '@material-ui/icons/Menu';
import {AddItemForm} from "./Components/EditableSpan";
import {TaskType, Todolist} from "./TodoList";

export type FilterValuesType = "all" | "active" | "completed";

export type TodolistType = {
    id: string
    title: string
    filter: FilterValuesType
}

type TaksStateType = {
    [key: string]: Array<TaskType>
}

let initialState_1 = [
    {id: v1(), title: "HTML&CSS", isDone: true},
    {id: v1(), title: "JS", isDone: true},
    {id: v1(), title: "ReactJS", isDone: false},
    {id: v1(), title: "Rest API", isDone: false},
    {id: v1(), title: "GraphQL", isDone: false},
]
let initialState_2 = [
    {id: v1(), title: "HTML&CSS", isDone: true},
    {id: v1(), title: "JS", isDone: true},
    {id: v1(), title: "ReactJS", isDone: false},
    {id: v1(), title: "Rest API", isDone: false},
    {id: v1(), title: "GraphQL", isDone: false},
]

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
    const ID_1 = v1()
    const ID_2 = v1()

    const [todolists, setTodolists] = useState<Array<TodolistType>>([
        {id: ID_1, title: "What to learn?", filter: 'all'},
        {id: ID_2, title: "What to buy?", filter: 'all'},
    ])
    const [tasks, setTasks] = useState<TaksStateType>({
        [ID_1]: initialState_1,
        [ID_2]: initialState_2
    });

    function removeTask(id: string, taskId: string) {
        let todolistTasks = tasks[taskId]
        tasks[taskId] = todolistTasks.filter(t => t.id !== id);
        setTasks({...tasks});
    }
    function addTask(title: string, taskId: string) {
        let task = {id: v1(), title: title, isDone: false};
        let todolistTasks = tasks[taskId]
        tasks[taskId] = [task, ...todolistTasks];
        setTasks({...tasks});
    }
    function changeStatus(id: string, isDone: boolean, taskId: string) {
        let todolistTasks = tasks[taskId]
        let task = todolistTasks.find(t => t.id === id);
        if (task) {
            task.isDone = isDone;
        }
        setTasks({...tasks});
    }
    function changeFilter(value: FilterValuesType, taskId: string) {
        let todolist = todolists.find(t => t.id === taskId)
        if (todolist) {
            todolist.filter = value
            setTodolists([...todolists])
        }
    }


    function addTodoList(title: string) {
        let newTodoListId = v1();
        let newTodoList: TodolistType = {id: newTodoListId, title: title, filter: 'all'}
        setTodolists([newTodoList, ...todolists])
        setTasks({
            ...tasks,
            [newTodoListId]: []
        })
    }
    function removeTodolist(id: string) {
        setTodolists(todolists.filter(l => l.id !== id))
        delete tasks[id]
        setTasks({...tasks})
    }
    function changeTaskTitle(taskID: string, newTitle: string, todoID: string) {
        let todolistTasks = tasks[todoID]
        let task = todolistTasks.find(t => t.id === taskID);
        if (task) {
            task.title = newTitle;
        }
        setTasks({...tasks});
    }
    function changeTodoTitle(newTodoTitle: string, todoID: string) {
        console.log(newTodoTitle)
        let todolist = todolists.find(t => t.id === todoID);
        if (todolist) {
            todolist.title = newTodoTitle;
            setTodolists([...todolists]);
        }

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
