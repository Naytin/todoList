import React, {DetailedHTMLProps, HTMLAttributes, useCallback, useEffect, useState} from 'react';
import {TodolistsList} from "../features/Todolists/TotolistsList";
import ErrorSnackBar from "../Components/ErrorSnackBar/ErrorSnackBar";
import {Link, Redirect, Route, Switch} from 'react-router-dom';
import {Login} from "../features/Login/Login";
import {useAppSelector} from "../utils/hooks/useAppSelector";
import {useActions} from "../utils/hooks/useActions";
import {appAsyncActions, authAsyncActions} from "../store/actionCreators";
import {Spinner} from "../Components/Spinner/Spinner";
import {icons} from "../assets/icons";


function App() {
    const isLoggedIn = useAppSelector(state => state.auth.isLoggedIn)
    const isInitialized = useAppSelector(state => state.app.isInitialized)
    const status = useAppSelector(state => state.app.status)
    const {initializeApp} = useActions(appAsyncActions)
    const {logout} = useActions(authAsyncActions)

    const [menu, setMenu] = useState<boolean>(false)


    const handleLogout = useCallback(() => {
        logout()
        setMenu(false);
    }, [])

    const handleClick = () => {
        setMenu(!menu);
    };

    useEffect(() => {
        initializeApp()
    }, [])

    if (!isInitialized) {
        return <div className='text-center h-16 pt-4'>
            {status === 'loading' && <Spinner color={'white'}/>}
        </div>
    }

    return (
        <div className="App">
            <div className='p-2 bg-blue-400 shadow-xl relative z-10'>
                <button
                    className='cursor-pointer p-2'
                    onClick={handleClick}>
                    {menu ? icons.closeMenu : icons.openMenu}
                </button>
                <nav className='mt-2  absolute -bottom-22 left-0 z-0'>
                    <ul className={`text-lg cursor-pointer transition duration-500 transform 
                    ${menu ? '-translate-x-0' : '-translate-x-20'}`}>

                        {!isLoggedIn && <ItemMenu text='Login'>{icons.login}</ItemMenu>}
                        <ItemMenu text='Logout' onclick={handleLogout}>
                            {icons.logout}
                        </ItemMenu>
                        <ItemMenu text='Settings'>
                            {icons.settings}
                        </ItemMenu>
                    </ul>
                </nav>
            </div>
            <ErrorSnackBar/>
            <div className='text-center h-16 pt-4'>
                {status === 'loading' && <Spinner color={'white'}/>}
            </div>
            <main className='px-2 h-full'>
                <div className='w-full'>
                    <div className='w-72 m-auto bg-blue-200 rounded-lg shadow-md p-2'>
                        <h2 className='text-red-300 text-2xl text-center'>Functionality:</h2>
                        <p>• You can create/remove boards and tasks<br/>
                            • You can update the title of a task or board - double-click the name you want to change.<br/>
                        </p>
                    </div>
                </div>
                <>
                    <Switch>
                        <Route exact path={'/'} render={() => <TodolistsList/>}/>
                        <Route path={'/login'} render={() => <Login/>}/>
                        <Route path={'/404'} render={() => <h1 className='text-center'>404: PAGE NOT FOUND</h1>}/>
                        <Redirect from={'*'} to={'/404'}/>
                    </Switch>
                </>
            </main>
        </div>
    );
}

export default App;


type DefaultPropsType = DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>;
type ItemMenuType = DefaultPropsType & {
    text: string
    onclick?: () => void
}
const ItemMenu = ({text, onclick, children, ...props}: ItemMenuType) => {
    return (
        <li onClick={onclick} className='flex justify-between items-center pl-2
        hover:text-white bg-blue-100 hover:bg-blue-200 transition
        duration-500 transform hover:translate-x-2'>{text}
            <div className='pl-2 ml-1 p-1 bg-blue-400 text-white'>
                {children}
            </div>
        </li>
    )
}

