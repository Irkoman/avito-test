import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';

import Item from '../item/item';
import Modal from '../modal/modal';
import Filters from '../filters/filters';
import Details from '../details/details';

import './products.styl';

class Products extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    products: PropTypes.object.isRequired,
    filterProducts: PropTypes.func.isRequired,
    loadProduct: PropTypes.func.isRequired,
    toggleLiked: PropTypes.func.isRequired
  }

  state = {
    isModalShown: false
  }

  componentDidMount() {
    const { location: { hash } } = this.props;

    if (hash) {
      this.showModal(hash.substr(1));
    }
  }

  showModal = (id) => {
    this.setState({ isModalShown: true });
    this.props.loadProduct(id);
  }

  hideModal = () => {
    this.setState({ isModalShown: false });

    const {
      history,
      location: {
        pathname,
        search
      }
    } = this.props;

    history.push(`${pathname}${search}`);
  }

  renderItem(item) {
    return (
      <Item
        key={item.id}
        item={item}
        showModal={this.showModal}
        toggleLiked={this.props.toggleLiked}
      />
    );
  }

  render() {
    const { isModalShown } = this.state;

    const {
      products: {
        items,
        minPrice,
        maxPrice,
        isFiltering,
        item: { details }
      },
      filterProducts
    } = this.props;

    return (
      <main className="products">
        <section className="products__list">
          { items.length > 0
            ? items.map(item => this.renderItem(item))
            : <span>Не нашлось подходящих товаров. 👀<br />Попробуйте задать менее строгие условия фильтра.</span>
          }
        </section>
        <aside className="products__filters">
          <Filters
            minPrice={minPrice}
            maxPrice={maxPrice}
            isFiltering={isFiltering}
            filterProducts={filterProducts}
          />
        </aside>
        <Modal isShown={isModalShown} onHide={this.hideModal}>
          <Details details={details} />
        </Modal>
      </main>
    );
  }
}

export default withRouter(Products);
