import { createStore, applyMiddleware } from 'redux';
import reducers from './reducers';
import createLogger from 'redux-logger';

const createStoreWithMiddleware = applyMiddleware(
    createLogger() // must be last
)(createStore);

export default createStoreWithMiddleware(reducers);
