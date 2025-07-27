interface State {
  isJoiningRoom?: boolean;
}

type Listener = (state: State) => void;

let currentState: State = {
  isJoiningRoom: true,
};
const listeners = new Set<Listener>();

export function getState(): State {
  return currentState;
}

export function setState(newState: Partial<State>) {
  currentState = { ...currentState, ...newState };
  listeners.forEach((listener) => listener(currentState));
}

export function subscribe(listener: Listener): () => void {
  listeners.add(listener);
  listener(currentState);
  return () => listeners.delete(listener);
}
