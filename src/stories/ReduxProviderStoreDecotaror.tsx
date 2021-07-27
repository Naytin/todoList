import React from 'react'
import {Provider} from 'react-redux'
import {applyMiddleware, createStore} from 'redux'
import { rootReducer} from '../store/store'
import thunk from "redux-thunk";

export const storyBookStore = createStore(rootReducer,applyMiddleware(thunk));

export const ReduxStoreProviderDecorator = (storyFn: any) => (
    <Provider store={storyBookStore}>{storyFn()}</Provider>
)