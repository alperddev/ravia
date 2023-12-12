import { combineReducers, createStore } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

export interface RootState {
  roomId: string;
  friendId: string;
  chatId: string;
  userId: string;
  email: string;
  user: any | null;
}

const initialState: RootState = {
  roomId: '',
  friendId: '',
  chatId: '',
  userId: '',
  email: '',
  user: null,
};

const createReducer =
  (key, defaultValue) =>
  (state = defaultValue, action) => {
    if (action.type === `SET_${key.toUpperCase()}`) {
      return action[key]
    }

    return state
  }

const rootReducer = combineReducers({
  roomId: createReducer('roomId', initialState.roomId),
  friendId: createReducer('friendId', initialState.friendId),
  chatId: createReducer('chatId', initialState.chatId),
  userId: createReducer('userId', initialState.userId),
  email: createReducer('email', initialState.email),
  user: createReducer('user', initialState.user),
});

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['user'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = createStore(persistedReducer);
export const persistor = persistStore(store);
