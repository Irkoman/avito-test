import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import {
  loadProducts,
  filterProducts,
  loadProduct,
  toggleLiked
} from '../reducers/products-reducer';

import Loader from '../components/loader/loader';
import Products from '../components/products/products';

class ProductsPage extends Component {
  static propTypes = {
    products: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired
  }

  componentDidMount() {
    this.props.dispatch(loadProducts());
  }

  filterProducts = (params) => {
    this.props.dispatch(filterProducts(params));
  }

  loadProduct = (id) => {
    this.props.dispatch(loadProduct(id));
  }

  toggleLiked = (id) => {
    this.props.dispatch(toggleLiked(id));
  }

  render() {
    const { products } = this.props;

    return products.isLoading
      ? <Loader />
      : <Products
        products={products}
        filterProducts={this.filterProducts}
        loadProduct={this.loadProduct}
        toggleLiked={this.toggleLiked}
      />;
  }
}

export default connect(
  state => ({
    products: state.products
  })
)(ProductsPage);
