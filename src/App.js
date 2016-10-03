import React, { Component } from 'react';
import './App.css';
import 'babel-polyfill';

import Puzzle from './Puzzle';

import {Provider, connect} from 'react-redux';
import reducers from './reducers';
import actionCreators from './actions';
import mainSaga from './sagas';
import {createStore, bindActionCreators, applyMiddleware} from 'redux';
import createSagaMiddleware from 'redux-saga';

class App extends Component {
  constructor(props) {
    super(props);
    const sagaMiddleware = createSagaMiddleware();
    this.store = createStore(reducers, applyMiddleware(sagaMiddleware));
    this.Connected = connect(
      reducers,
      dispatch => ({actions: bindActionCreators(actionCreators, dispatch)})
    )(Puzzle);
    this.mainTask = sagaMiddleware.run(mainSaga);
  }
  componentWillUnmount() {
    this.mainTask.cancel();
  }
  render() {
    return (
      <div className='App'>
        <Provider store={this.store}>
          <this.Connected/>
        </Provider>
      </div>
    );
  }
}

export default App;
