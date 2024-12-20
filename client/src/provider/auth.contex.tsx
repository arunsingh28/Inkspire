import * as React from "react";

import storage from "@/utils/storage";

import useUpdatedEffect from "@/hooks/useUpdateEffect";

export interface DispatchAction<T> {
  type: string;
  payload?: T;
}

export interface Token {
  token?: string;
}

export interface User {
  email?: string;
  name?: string;
  _id?: string;
}

const INITIAL_TOKEN: Token = {};
const INITIAL_USER: User = {};
const TOKENS_KEY = "token";
const USER_KEY = "user";

export const AuthActions = {
  setToken: "SET_TOKEN",
  setUser: "SET_USER",
  logout: "LOGOUT",
};

export interface AuthState {
  token: Token;
  user: User;
}

const INITIAL_STATE: AuthState = {
  token: INITIAL_TOKEN,
  user: INITIAL_USER,
};

// reducer
const reducer = (
  state: AuthState,
  action: DispatchAction<Partial<AuthState>>
): AuthState => {
  switch (action.type) {
    case AuthActions.setToken:
      return { ...state, token: { ...action.payload?.token }};
    case AuthActions.setUser:
      return { ...state, ...action.payload };
    case AuthActions.logout:
      storage.remove(TOKENS_KEY);
      storage.remove(USER_KEY);
      return { token: INITIAL_TOKEN, user: INITIAL_USER };
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
};

// context
const AuthStateContext = React.createContext<AuthState | undefined>(undefined);
const AuthDispatchContext = React.createContext<
  React.Dispatch<DispatchAction<Partial<AuthState>>>
>(() => {});

AuthStateContext.displayName = "AuthStateContext";
AuthDispatchContext.displayName = "AuthDispatchContext";

const initializeAuthState = (): AuthState => {
  const storedToken = storage.get<string>(TOKENS_KEY);
  const storedUser = storage.get<User>(USER_KEY);

  return {
    token: storedToken || "",  // Use an empty string if token doesn't exist or is invalid
    user: storedUser || INITIAL_USER,  // Use initial user object if no valid user is found
  };
};

// provider
export default function AuthProvider(props: React.PropsWithChildren<{}>) {
  const { children } = props;

  const [state, dispatch] = React.useReducer(
    reducer,
    INITIAL_STATE,
    initializeAuthState
  );

  useUpdatedEffect(() => {
    storage.set(TOKENS_KEY, state.token);
    storage.set(USER_KEY, state.user);
  }, [state]);

  return (
    <AuthStateContext.Provider value={state}>
      <AuthDispatchContext.Provider value={dispatch}>
        {children}
      </AuthDispatchContext.Provider>
    </AuthStateContext.Provider>
  );
}

export function useAuthState() {
  const context = React.useContext(AuthStateContext);
  if (context === undefined) {
    throw new Error("useAuthState must be used within a AuthProvider");
  }
  return context;
}

export function useAuthDispatch() {
  const context = React.useContext(AuthDispatchContext);
  if (context === undefined) {
    throw new Error("useAuthDispatch must be used within a AuthProvider");
  }
  return context;
}
