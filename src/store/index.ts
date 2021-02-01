import {combineReducers, createStore} from 'redux';
import {bluetoothReducer} from './bluetooth';

let rootReducer = combineReducers({
  bluetooth: bluetoothReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export {rootReducer};

export const store = createStore(rootReducer);
export type AppDispatch = typeof store.dispatch;
