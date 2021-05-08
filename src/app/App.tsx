import React from 'react';
import './App.scss';
import {
    AppBar,
    Button,
    Container,
    IconButton,
    LinearProgress,
    makeStyles,
    Toolbar,
    Typography
} from "@material-ui/core";
import MenuIcon from '@material-ui/icons/Menu';
import {TodolistsList} from "../features/Todolists/TotolistsList";
import {useSelector} from "react-redux";
import {AppRootStateType} from "./store";
import {RequestStatusType} from "./app.Reducer";
import ErrorSnackBar from "../Components/ErrorSnackBar/ErrorSnackBar";

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
    const status = useSelector<AppRootStateType, RequestStatusType>(state => state.app.status)
    const classes = useStyles();
    return (
        <div className="App">
            <ErrorSnackBar/>
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
            {status === 'loading' && <LinearProgress color={"primary"}/>}
            <Container fixed>
                <TodolistsList/>
            </Container>
        </div>
    );
}

export default App;


