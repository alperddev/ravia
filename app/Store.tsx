import { combineReducers, createStore } from 'redux'

export type RootState = {
  roomId: string
  userId: string
  email: string
}

const initialState: RootState = {
  roomId: '',
  userId: '',
  email: '',
}

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
  userId: createReducer('userId', initialState.userId),
  email: createReducer('keys', initialState.email),
})

const store = createStore(rootReducer)
export default store
