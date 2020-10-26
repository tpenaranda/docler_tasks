import { CONNECTED, DISCONNECTED } from 'pusher-redux'

const initialState = {
    connected: null,
    tasks: [],
}

export function main(state = initialState, action) {
  switch (action.type) {
    case CONNECTED:
      return { ...state, connected: true }

    case DISCONNECTED:
      return { ...state, connected: false }

    case 'STATE_CHANGED':
      return { ...state, ...action.data }

    default:
      return { ...state }
  }
}