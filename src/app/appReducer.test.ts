import {appReducer, AppStateType, setAppErrorAC, setAppStatusAC} from "./appReducer";


let startState: AppStateType
beforeEach(() => {
    startState = {
        status: 'idle',
        error: null
    }
})

test('correct status should be set', () => {
    const endState = appReducer(startState, setAppStatusAC('loading'))

    expect(endState.status).toBe('loading')
})

test('correct error message should be set', () => {
    const endState = appReducer(startState, setAppErrorAC('error'))

    expect(endState.error).toBe('error')
})