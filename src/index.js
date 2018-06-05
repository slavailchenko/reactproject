import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import {createStore, applyMiddleware} from 'redux';
import { Router, browserHistory } from 'react-router';
import { loadState, saveState } from './localstorage';
import Routes from './routes';
import reducers from './reducers';

const persistedState = loadState();


// const createStoreWithMiddleware = applyMiddleware()(createStore);
const store = createStore(
    reducers,
    persistedState
);

store.subscribe(() => {
    saveState({
        questions: store.getState().questions
    });
})

ReactDOM.render(
    <Provider store={store}>
        <Router history={browserHistory} routes={Routes} />
    </Provider>
    , document.querySelector('.container'));
