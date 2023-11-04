import { combineReducers, createStore } from 'redux'

export type RootState = {
  category: string
  topic: string
  keys: string[]
  randomness: number
  maxTokens: number
  comment: string
  script: string
  scripts: string[]
}

const initialState: RootState = {
  category: '',
  topic: '',
  keys: [],
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
  category: createReducer('category', initialState.category),
  topic: createReducer('topic', initialState.topic),
  keys: createReducer('keys', initialState.keys),
  randomness: createReducer('randomness', initialState.randomness),
  maxTokens: createReducer('maxTokens', initialState.maxTokens),
  comment: createReducer('comment', initialState.comment),
  script: createReducer('script', initialState.script),
  scripts: createReducer('scripts', initialState.scripts),
})

const store = createStore(rootReducer)
export default store
