import {authReducer, setIsLoggedIn} from "./authReducer";

let startState: any

beforeEach(() => {
    startState = {
        isLoggedIn: false
    }

})

test('is logged must be correct', () => {
    const action = setIsLoggedIn({isLoggedIn: true});
    const endState = authReducer(startState, action)
    expect(endState.isLoggedIn).toBe(true);
})


export {}