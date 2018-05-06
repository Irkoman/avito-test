import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Router, Route } from 'react-router';
import { createBrowserHistory } from 'history';
import { syncHistoryWithStore } from 'react-router-redux';
import store from './store';

import ProductsPage from './pages/products-page';

import './styles/main.styl';

if (module.hot) module.hot.accept();

const history = syncHistoryWithStore(createBrowserHistory(), store);

ReactDOM.render(
  <Provider store={store}>
    <Router history={history}>
      <Route path="/" component={ProductsPage} />
    </Router>
  </Provider>,
  document.getElementById('root')
);
