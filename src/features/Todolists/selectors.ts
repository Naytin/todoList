import {AppRootStateType} from "../../app/store";
import {TodolistDomainType} from "./todolistReducer";

export const selectorTodolists = (state: AppRootStateType):Array<TodolistDomainType> => state.todolists