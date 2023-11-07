import { combineReducers, createStore } from 'redux'

export type RootState = {
  roomId: string
  userId: string
  email: string
  randomness: number
  maxTokens: number
  comment: string
  script: string
  scripts: string[]
}

const initialState: RootState = {
  roomId: '',
  userId: '',
  email: '',
  randomness: 1,
  maxTokens: 200,
  comment: '',
  script: '',
  scripts: [],
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
  keys: createReducer('keys', initialState.email),
  randomness: createReducer('randomness', initialState.randomness),
  maxTokens: createReducer('maxTokens', initialState.maxTokens),
  comment: createReducer('comment', initialState.comment),
  script: createReducer('script', initialState.script),
  scripts: createReducer('scripts', initialState.scripts),
})

const store = createStore(rootReducer)
export default store
