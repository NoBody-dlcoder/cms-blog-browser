import { LOGIN } from './actionTypes'

export interface UserLoginState {
  userName ?: string
}

const initialState = {
  userName: ''
};

export default function store(state = initialState, action) {
  const { type, payload } = action

  switch (type) {
    case LOGIN: {
      const { userName } = payload;
      return {
        ...state,
        userName,
      };
    }

    default:
      return state;
  }
}
