import { createStore, applyMiddleware } from 'redux';
import { createLogger } from 'redux-logger';
import rootReducer from './reducers';
import { configurePusher } from 'pusher-redux';

const loggerMiddleware = createLogger();

const store = createStore(
    rootReducer,
    applyMiddleware(loggerMiddleware)
);

configurePusher(store, process.env.REACT_APP_PUSHER_KEY, {
    cluster: process.env.REACT_APP_PUSHER_CLUSTER
})

export default store
