import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { formatPrice, formatDate } from '../../helpers/format-helper';

import './item.styl';

class Item extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    item: PropTypes.object.isRequired,
    showModal: PropTypes.func.isRequired,
    toggleLiked: PropTypes.func.isRequired
  }

  showDetails = () => {
    const {
      item: { id },
      location: { search },
      history,
      showModal
    } = this.props;

    showModal(id);
    history.push(`#${id}${search}`);
  }

  render() {
    const {
      item: {
        id,
        title,
        price,
        isLiked,
        pictures,
        textualAddress
      },
      toggleLiked
    } = this.props;

    const likedMod = isLiked ? 'item__like_active' : '';

    return (
      <article className="item">
        { pictures.length > 0 &&
          <picture className="item__pic">
            <a role="button" tabIndex={0} className="item__pic-number" onClick={this.showDetails}>
              {pictures.length}
            </a>
            <img alt="" src={pictures[0]} width="130" height="130" />
          </picture>
        }
        <div className="item__description">
          <button className={`item__like ${likedMod}`} onClick={() => toggleLiked(id)}>
            Добавить в избранное
          </button>
          <h3 className="item__title">
            <a role="button" tabIndex={0} onClick={this.showDetails}>{title}</a>
          </h3>
          <p className="item__price">{price ? `${formatPrice(price)} ₽` : 'Цена не указана'}</p>
          <p className="item__address">{textualAddress}</p>
          <p className="item__date">{formatDate()}</p>
        </div>
      </article>
    );
  }
}

export default withRouter(Item);
