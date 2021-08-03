import React, {useCallback, useEffect} from 'react';
import './App.scss';
import {
    AppBar,
    Button,
    CircularProgress,
    Container,
    IconButton,
    LinearProgress,
    makeStyles,
    Toolbar,
    Typography
} from "@material-ui/core";
import MenuIcon from '@material-ui/icons/Menu';
import {TodolistsList} from "../features/Todolists/TotolistsList";
import ErrorSnackBar from "../Components/ErrorSnackBar/ErrorSnackBar";
import {Redirect, Route, Switch, useHistory} from 'react-router-dom';
import {Login} from "../features/Login/Login";
import {useAppSelector} from "../hooks/useAppSelector";
import {useActions} from "../hooks/useActions";
import {appAsyncActions, authAsyncActions} from "../store/actionCreators";

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
    const isLoggedIn = useAppSelector(state => state.auth.isLoggedIn)
    const isInitialized = useAppSelector(state => state.app.isInitialized)
    const status = useAppSelector(state => state.app.status)
    const {initializeApp} = useActions(appAsyncActions)
    const {logout} = useActions(authAsyncActions)

    const classes = useStyles();
    const history = useHistory()

    const handleLogout = useCallback(() => {
       logout()
    }, [])

    useEffect(() => {
        initializeApp()
    }, [])

    if (!isInitialized) {
        return <div
            style={{position: 'fixed', top: '30%', textAlign: 'center', width: '100%'}}>
            <CircularProgress/>
        </div>
    }
    return (
        <div className="App">
            <ErrorSnackBar/>
            <AppBar position="static">
                <Toolbar>
                    <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
                        <MenuIcon/>
                    </IconButton>
                    <Typography variant="h6" className={classes.title}>
                        My TODO
                    </Typography>
                    {
                        !isLoggedIn ?
                            <Button disabled={history.location.pathname === '/login'}
                                    variant='outlined' color="secondary"
                                    onClick={() => history.push('/login')}>Login</Button> :
                            <Button variant='outlined' color="secondary" onClick={handleLogout}>Log out</Button>
                    }
                </Toolbar>
            </AppBar>
            {status === 'loading' && <LinearProgress color={"primary"}/>}
            <Container fixed>
                    <Switch>
                        <Route exact path={'/'} render={() => <TodolistsList/>}/>
                        <Route path={'/login'} render={() => <Login/>}/>
                        <Route path={'/404'} render={() => <h1>404: PAGE NOT FOUND</h1>}/>
                        <Redirect from={'*'} to={'/404'}/>
                    </Switch>
            </Container>
        </div>
    );
}

export default App;


