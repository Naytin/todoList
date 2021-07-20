import React from 'react'
import {Provider} from 'react-redux'
import {applyMiddleware, createStore} from 'redux'
import { rootReducer} from '../app/store'
import thunk from "redux-thunk";
import {TaskPriorities, TaskStatuses} from "../api/API";
import {RequestStatusType} from "../app/appReducer";
import {configureStore} from "@reduxjs/toolkit";

const initialState = {
    todolists: [{
        id: '123',
        addedDate: '',
        order:0,
        title: 'React',
        filter: 'all',
        entityStatus: "idle"
    },],
    tasks: {
        '123': [{
            id: "123", title: "book",
            status: TaskStatuses.New, todoListId: 'todolistId1', description: '', startDate: '',
            deadline: '', addedDate: '', order: 0,
            priority: TaskPriorities.Low,
            entityStatus: 'succeeded' as RequestStatusType,
        }],
    },
    app: {
        error: null,
        status: 'succeeded',
        isInitialized: true
    },
    auth: {
        isLoggedIn: true
    }
}

export const storyBookStore = configureStore({
    reducer:    rootReducer,
    middleware: getDefaultMiddleware => getDefaultMiddleware().prepend(thunk) // add before
});

export const ReduxStoreProviderDecorator = (storyFn: any) => (
    <Provider store={storyBookStore}>{storyFn()}</Provider>
)