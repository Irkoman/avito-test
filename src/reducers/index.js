import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import productsReducer from './products-reducer';

export default combineReducers({
  products: productsReducer,
  routing: routerReducer
});
