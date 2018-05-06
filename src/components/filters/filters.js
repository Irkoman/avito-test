import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import qs from 'query-string';
import { formatPrice, inRange } from '../../helpers/format-helper';

import './filters.styl';

class Filters extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    minPrice: PropTypes.number.isRequired,
    maxPrice: PropTypes.number.isRequired,
    isFiltering: PropTypes.bool.isRequired,
    filterProducts: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props);

    const {
      location: { search },
      minPrice,
      maxPrice
    } = props;

    const {
      category,
      sort,
      price,
      favorite
    } = qs.parse(search);

    this.state = {
      category: category || 'all',
      sort: sort || 'popular',
      price: inRange(price, minPrice, maxPrice) ? +price : maxPrice || 5000,
      minPrice: minPrice || 1000,
      maxPrice: maxPrice || 5000,
      favorite: favorite === 'true'
    };
  }

  componentDidMount() {
    const { location: { search } } = this.props;

    const {
      category,
      sort,
      price,
      favorite
    } = this.state;

    if (search) {
      this.props.filterProducts({ category, sort, price, favorite });
    }
  }

  changeSort(sort) {
    this.setState({ sort });
  }

  changeCategory = (e) => {
    this.setState({ category: e.target.value });
  }

  changePrice = (e) => {
    this.setState({ price: e.target.value });
  }

  toggleFavorite = () => {
    this.setState({ favorite: !this.state.favorite });
  }

  submitForm = (e) => {
    e.preventDefault();

    const {
      category,
      sort,
      price,
      favorite
    } = this.state;

    const {
      history,
      location: { pathname },
      filterProducts
    } = this.props;

    filterProducts({ category, sort, price, favorite });
    history.push(`${pathname}?category=${category}&sort=${sort}&price=${price}&favorite=${favorite}`);
  }

  render() {
    const {
      category,
      sort,
      price,
      minPrice,
      maxPrice,
      favorite
    } = this.state;

    const { isFiltering } = this.props;

    return (
      <form className="filters" onSubmit={this.submitForm}>
        <fieldset className="filters__group filters__group_favorite">
          <input
            type="checkbox"
            name="favorite"
            id="favorite"
            value={favorite}
            checked={favorite}
            disabled={isFiltering}
            onChange={this.toggleFavorite}
          />
          <label className="filters__item" htmlFor="favorite">Показывать избранные</label>
        </fieldset>

        <fieldset className="filters__group">
          <label htmlFor="category">Категория</label><br />
          <select name="category" id="category" value={category} onChange={this.changeCategory}>
            <option value="all">Все объявления</option>
            <option value="auto">Авто</option>
            <option value="immovable">Недвижимость</option>
            <option value="laptops">Ноутбуки</option>
            <option value="cameras">Фотоаппараты</option>
          </select>
        </fieldset>

        <fieldset className="filters__group">
          Сначала:
          <input
            type="radio"
            name="popular"
            value="popular"
            id="popular"
            checked={sort === 'popular'}
            disabled={isFiltering}
            onChange={() => this.changeSort('popular')}
          />
          <label className="filters__item" htmlFor="popular">популярные</label>
          <input
            type="radio"
            name="cheap"
            value="cheap"
            id="cheap"
            checked={sort === 'cheap'}
            disabled={isFiltering}
            onChange={() => this.changeSort('cheap')}
          />
          <label className="filters__item" htmlFor="cheap">дешевые</label>
          <input
            type="radio"
            name="expensive"
            value="expensive"
            id="expensive"
            checked={sort === 'expensive'}
            disabled={isFiltering}
            onChange={() => this.changeSort('expensive')}
          />
          <label className="filters__item" htmlFor="expensive">дорогие</label>
        </fieldset>

        <fieldset className="filters__group">
          <label htmlFor="price">Максимальная цена: {formatPrice(price)}</label><br />
          <span>{formatPrice(minPrice)}</span>
          <input
            type="range"
            name="price"
            id="price"
            min={minPrice}
            max={maxPrice}
            step="500"
            value={price}
            disabled={isFiltering}
            onChange={this.changePrice}
          />
          <span>{formatPrice(maxPrice)}</span>
        </fieldset>

        <button className="filters__submit" type="submit" disabled={isFiltering}>
          Показать
        </button>
      </form>
    );
  }
}

export default withRouter(Filters);
