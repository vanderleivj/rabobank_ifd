import { Action } from '@ngrx/store'

class Logado implements Action {
  readonly type = 'LOGADO'
}

const INITIAL_STATE = {
  isLogado: false
}

export const reducer = (state = INITIAL_STATE, action: Action) => {
  switch(action.type) {
    case 'LOGADO':
      return {
        ...state,isLogado: true
      }
    default:
      return state
  }
}
