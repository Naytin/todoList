import {addTaskAC, removeTaskAC, setTasksAC, tasksReducer, TaskStateType, updateTaskAC} from "./tasksReducer";
import {addTodolistAC, removeTodolistAC, setTodolistsAC} from './todolistReducer'
import {TaskPriorities, TaskStatuses} from "../../api/task-api";

let startState: TaskStateType

beforeEach(() => {
    startState = {
        "todolistId1": [
            {
                id: "1", title: "CSS",
                status: TaskStatuses.New, todoListId: 'todolistId1', description: '', startDate: '',
                deadline: '', addedDate: '', order: 0,
                priority: TaskPriorities.Low
            },
            {
                id: "2", title: "JS",
                status: TaskStatuses.Completed, todoListId: 'todolistId1', description: '', startDate: '',
                deadline: '', addedDate: '', order: 0,
                priority: TaskPriorities.Low
            },
            {
                id: "3", title: "REACT",
                status: TaskStatuses.New, todoListId: 'todolistId1', description: '', startDate: '',
                deadline: '', addedDate: '', order: 0,
                priority: TaskPriorities.Low
            },
        ],
        "todolistId2": [
            {
                id: "1", title: "book",
                status: TaskStatuses.New, todoListId: 'todolistId1', description: '', startDate: '',
                deadline: '', addedDate: '', order: 0,
                priority: TaskPriorities.Low
            },
            {
                id: "2", title: "book2",
                status: TaskStatuses.New, todoListId: 'todolistId1', description: '', startDate: '',
                deadline: '', addedDate: '', order: 0,
                priority: TaskPriorities.Low
            },
            {
                id: "3", title: "book3",
                status: TaskStatuses.New, todoListId: 'todolistId1', description: '', startDate: '',
                deadline: '', addedDate: '', order: 0,
                priority: TaskPriorities.Low
            },

        ]
    };
})


test('correct task should be deleted from correct array', () => {
    const action = removeTaskAC("2", "todolistId2");
    const endState = tasksReducer(startState, action)

    expect(endState['todolistId2'].length).toEqual(2);
});

test('correct task should be added to correct array', () => {
    const action = addTaskAC({
        todoListId: 'todolistId2',
        title: 'juice',
        status: TaskStatuses.New,
        addedDate: '',
        deadline: '',
        description: '',
        order: 0,
        priority: 0,
        startDate: '',
        id: '2'
    });
    const endState = tasksReducer(startState, action)

    expect(endState["todolistId1"].length).toBe(3);
    expect(endState["todolistId2"].length).toBe(4);
    expect(endState["todolistId2"][0].id).toBeDefined();
    expect(endState["todolistId2"][0].title).toBe('juice');
    expect(endState["todolistId2"][0].status).toBe(0);
})

test('status of specified task should be changed', () => {
    const status = 0
    const action = updateTaskAC("2", {status}, "todolistId2");
    const endState = tasksReducer(startState, action)

    expect(endState['todolistId2'][1].status).toBe(0);
    expect(endState['todolistId1'][1].status).toBe(2);
});


test('title of specified task should be changed', () => {
    const title = 'Hello'
    const action = updateTaskAC("2", {title}, "todolistId2");
    const endState = tasksReducer(startState, action)

    expect(endState['todolistId2'][1].title).toBe('Hello');
    expect(endState['todolistId2'][0].title).toBe("book");
});

test('new array should be added when new todolist is added', () => {
    const action = addTodolistAC({
        id: 'todolistId3',
        addedDate: '',
        order:0,
        title: 'new todolist'
    });
    const endState = tasksReducer(startState, action)
    const keys = Object.keys(endState);
    const newKey = keys.find(k => k !== "todolistId1" && k !== "todolistId2");
    if (!newKey) {
        throw Error("new key should be added")
    }

    expect(keys.length).toBe(3);
    expect(endState[newKey]).toEqual([]);
});

test('property with todolistId should be deleted', () => {
    const action = removeTodolistAC("todolistId2");
    const endState = tasksReducer(startState, action)
    const keys = Object.keys(endState);

    expect(keys.length).toBe(1);
    expect(endState["todolistId2"]).not.toBeDefined();
});

test('empty arrays should be added when we set todolists', () => {
    const action = setTodolistsAC([
        {id: "1", title: "title_1", order: 0, addedDate: ''},
        {id: "2", title: "title_2", order: 1, addedDate: ''},
    ]);
    const endState = tasksReducer({}, action)
    const keys = Object.keys(endState);

    expect(keys.length).toBe(2);
    expect(endState['1']).toStrictEqual([])
    expect(endState['2']).toStrictEqual([])
});

test('tasks should be added for todolists', () => {
    const action = setTasksAC(startState["todolistId1"], 'todolistId1');
    const endState = tasksReducer({
        'todolistId1': [],
        'todolistId2': []
    }, action)

    expect(endState['todolistId1'].length).toBe(3)
    expect(endState['todolistId2'].length).toBe(0)
});





