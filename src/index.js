import React from 'react';
import ReactDOM from 'react-dom';
import store from './redux/store'
import { createBrowserHistory } from 'history';
import { Provider } from 'react-redux';
import { Router, Route, Switch, Redirect } from 'react-router-dom';
import App from './App';

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <Router history={createBrowserHistory()}>
        <Switch>
          <Route path="/:clientId?" component={App} />
          <Redirect from="*" to="/" />
        </Switch>
      </Router>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);
