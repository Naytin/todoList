import React, {useCallback, useEffect, useState} from 'react';
import './App.scss';
import {
    AppBar,
    Button,
    CircularProgress,
    Container,
    IconButton,
    LinearProgress,
    makeStyles, Menu, MenuItem,
    Toolbar,
    Typography
} from "@material-ui/core";
import MenuIcon from '@material-ui/icons/Menu';
import {TodolistsList} from "../features/Todolists/TotolistsList";
import ErrorSnackBar from "../Components/ErrorSnackBar/ErrorSnackBar";
import {Redirect, Route, Switch, useHistory} from 'react-router-dom';
import {Login} from "../features/Login/Login";
import {useAppSelector} from "../utils/hooks/useAppSelector";
import {useActions} from "../utils/hooks/useActions";
import {appAsyncActions, authAsyncActions} from "../store/actionCreators";

const useStyles = makeStyles((theme) => ({
    root: {
        overflow: 'auto',
        minHeight: 'calc(100vh - 64px)'

    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        flexGrow: 1,
    },
    menu: {
        top: '50px',
    },
    progress: {
        position: 'fixed',
        top: '30%',
        textAlign: 'center',
        width: '100%'
    }
}));

function App() {
    const isLoggedIn = useAppSelector(state => state.auth.isLoggedIn)
    const isInitialized = useAppSelector(state => state.app.isInitialized)
    const status = useAppSelector(state => state.app.status)
    const {initializeApp} = useActions(appAsyncActions)
    const {logout} = useActions(authAsyncActions)

    const [anchor, setAnchor] = useState<null | HTMLElement>(null)

    const classes = useStyles();
    const history = useHistory()

    const handleLogout = useCallback(() => {
       logout()
    }, [])

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchor(event.currentTarget);
    };
    const handleClose = () => {
        setAnchor(null);
    };

    useEffect(() => {
        initializeApp()
    }, [])

    if (!isInitialized) {
        return <div
            className={classes.progress}>
            <CircularProgress/>
        </div>
    }
    return (
        <div className="App">
            <ErrorSnackBar/>
            <AppBar position="static">
                <Toolbar>
                    <IconButton aria-controls='menu'
                                aria-haspopup={true}
                                edge="start"
                                className={classes.menuButton}
                                color="inherit"
                                aria-label="menu"
                                onClick={handleClick}
                    >
                        <MenuIcon/>
                    </IconButton>
                    <Menu id='menu'
                          anchorEl={anchor}
                          keepMounted
                          open={Boolean(anchor)}
                          onClose={handleClose}
                    >
                        <MenuItem >Settings</MenuItem>
                        {
                            !isLoggedIn ?
                                <MenuItem disabled={history.location.pathname === '/login'}
                                        onClick={() => history.push('/login')}>Login</MenuItem> :
                                <MenuItem  onClick={handleLogout}>Log out</MenuItem>
                        }
                    </Menu>
                    <Typography variant="h6" className={classes.title}>
                        TODOS
                    </Typography>
                </Toolbar>
            </AppBar>
            {status === 'loading' && <LinearProgress color={"primary"}/> }
            <Container maxWidth='xl' className={classes.root} >
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


