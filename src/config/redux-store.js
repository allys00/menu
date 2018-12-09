import { createStore, applyMiddleware } from 'redux';
import { combineReducers } from 'redux';
import promiseMiddleware from 'redux-promise-middleware';
import createSagaMiddleware from 'redux-saga';
import menu from '../menu/menu.reducer';


import mySaga from './main-saga';

const sagaMiddleware = createSagaMiddleware()

const RootReducer = combineReducers({
    menu
});


const devTools = window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__();

const Store = applyMiddleware(promiseMiddleware(), sagaMiddleware)(createStore)(RootReducer, devTools);

sagaMiddleware.run(mySaga)

export default Store;
