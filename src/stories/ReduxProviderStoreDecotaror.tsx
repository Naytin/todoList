import React from 'react'
import {Provider} from 'react-redux'
import { createStore} from 'redux'
import { rootReducer} from '../state/store'

export const storyBookStore = createStore(rootReducer);

export const ReduxStoreProviderDecorator = (storyFn: any) => (
    <Provider store={storyBookStore}>{storyFn()}</Provider>
)