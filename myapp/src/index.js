import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import {Provider} from 'react-redux'
import {createStore, applyMiddleware, compose} from "redux";
import reduxThunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension';

import reducers from './reducers'

// const composeEnhancers = window._REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
const composeEnhancers = composeWithDevTools || compose

const store = createStore(
    reducers,
    composeEnhancers(applyMiddleware(reduxThunk)),
)

ReactDOM.render(
    <Provider store={store}><App/></Provider>,
  // <React.StrictMode>
  //   <App />
  // </React.StrictMode>,
  document.getElementById('root')
);


