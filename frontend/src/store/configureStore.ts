import { createStore, applyMiddleware } from 'redux';
import loggerMiddleware from 'redux-logger';
import createSagaMiddleware from 'redux-saga';
import thunkMiddleware from 'redux-thunk';
import modules from './modules';
import { root } from '../sagas/root';

const sagaMiddleware = createSagaMiddleware();

const middlewares = [
    loggerMiddleware,
    sagaMiddleware,
    thunkMiddleware
];

const configureStore = () => {
    const store = createStore(
        modules,
        (window as any).__REDUX_DEVTOOLS_EXTENSION__ && (window as any).__REDUX_DEVTOOLS_EXTENSION__(),
        applyMiddleware(...middlewares)
    );
   sagaMiddleware.run(root);
   return store;
};

export default configureStore;