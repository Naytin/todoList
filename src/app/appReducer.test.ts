import {appReducer, setAppErrorAC, setAppStatusAC} from "./appReducer";


type AppStateType = {
    status: string,
    error: string | null,
    isInitialized: boolean
}

let startState: AppStateType
beforeEach(() => {
    startState = {
        status: 'idle',
        error: null,
        isInitialized: false
    }
})

test('correct status should be set', () => {
    const endState = appReducer(startState, setAppStatusAC({status: 'loading'}))

    expect(endState.status).toBe('loading')
})

test('correct error message should be set', () => {
    const endState = appReducer(startState, setAppErrorAC({error: 'error'}))
    expect(endState.error).toBe('error')
})

