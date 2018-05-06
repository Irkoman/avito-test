import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Slider from 'react-slick';
import { Map, Marker } from 'yandex-map-react';
import { formatPrice, formatDate } from '../../helpers/format-helper';

import './details.styl';

const sliderSettings = {
  dots: false,
  arrows: false,
  infinite: true,
  speed: 3000,
  autoplay: true,
  autoplaySpeed: 4000,
  slidesToShow: 1,
  draggable: false
};

class Details extends Component {
  static propTypes = {
    details: PropTypes.object.isRequired
  }

  getRatingMod() {
    const { details: { seller: { rating } } } = this.props;

    return rating > 4.8
      ? 'good'
      : rating < 4
        ? 'bad'
        : 'average';
  }

  render() {
    const {
      details: {
        title,
        price,
        pictures,
        textualAddress,
        address: { lat, lng },
        seller: { name, rating }
      }
    } = this.props;

    return (
      <article className="details">
        <h2 className="details__title">{title}</h2>

        <section className="details__main">
          <p className="details__date">{formatDate()}</p>
          <p className="details__price">
            { price ? `${formatPrice(price)} ₽` : 'Цена не указана' }
          </p>

          <section className="details__gallery">
            <div className="details__gallery-preview">
              <Slider {...sliderSettings}>
                { pictures.map(picture => (
                  <img
                    key={picture}
                    src={picture}
                    width="205"
                    height="205"
                    alt=""
                  />
                ))}
              </Slider>
            </div>
            <div className="details__gallery-thumbnails">
              { pictures.map((picture, index) => (
                <img
                  key={`${index}-${picture}`}
                  className="details__gallery-item"
                  src={picture}
                  width="100"
                  height="100"
                  alt=""
                />
              ))}
            </div>
          </section>

          <p className="details__description">
            Просторная трехкомнатная квартира. Окна на восток. 15 минут пешком до метро. В собственности более трех лет. Согласованная перепланировка. Подходит под ипотеку
          </p>
        </section>

        <aside className="details__aside">
          <section className="details__address">
            <p className="details__address-text">{textualAddress}</p>
            <div className="details__address-map">
              { lat && lng &&
                <Map center={[lat, lng]} width={230} height={150} zoom={16}>
                  <Marker lat={lat} lon={lng} />
                </Map>
              }
            </div>
          </section>

          <section className="details__seller">
            { name &&
              <a href={`https://yandex.ru/search?text=${name}`} target="_blank">
                <h3 className="details__seller-name">{name}</h3>
              </a>
            }
            { rating &&
              <p className={`details__seller-rating details__seller-rating_${this.getRatingMod()}`}>
                рейтинг <span className="details__seller-rating-value">{rating}</span>
              </p>
            }
          </section>
        </aside>
      </article>
    );
  }
}

export default Details;
