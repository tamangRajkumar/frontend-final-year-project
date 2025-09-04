import { createStore, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import rootReducer from "./reducers";
// import { composeWithDevTools } from "redux-devtools-extension";
import { composeWithDevTools } from "redux-devtools-extension/developmentOnly";

const initialState = {};

const store = createStore(
  rootReducer,
  initialState,
  composeWithDevTools(
    applyMiddleware(thunk),

    // window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  )
);

export default store;
