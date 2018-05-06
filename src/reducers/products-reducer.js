import axios from 'axios';
import { pullLikesFromStorage } from '../helpers/storage-helper';
import { sortProducts } from '../helpers/sort-helper';

export const LOAD_PRODUCTS = 'products/LOAD_PRODUCTS';
export const LOAD_PRODUCTS_SUCCESS = 'products/LOAD_PRODUCTS_SUCCESS';
export const LOAD_PRODUCTS_ERROR = 'products/LOAD_PRODUCTS_ERROR';

export const FILTER_PRODUCTS = 'products/FILTER_PRODUCTS';
export const FILTER_PRODUCTS_SUCCESS = 'products/FILTER_PRODUCTS_SUCCESS';
export const FILTER_PRODUCTS_ERROR = 'products/FILTER_PRODUCTS_ERROR';

export const LOAD_PRODUCT = 'products/LOAD_PRODUCT';
export const LOAD_PRODUCT_SUCCESS = 'products/LOAD_PRODUCT_SUCCESS';
export const LOAD_PRODUCT_ERROR = 'products/LOAD_PRODUCT_ERROR';

export const TOGGLE_LIKED = 'products/TOGGLE_LIKED';

const initialState = {
  isLoading: true,
  isFiltering: false,
  originalItems: [],
  items: [],
  minPrice: 1000,
  maxPrice: 5000,
  item: {
    isLoading: true,
    details: {
      id: null,
      address: {},
      isLiked: false,
      textualAddress: '',
      category: '',
      title: '',
      price: null,
      date: null,
      seller: {},
      pictures: [],
      relationships: null
    }
  }
};

async function decodeAddress(item) {
  try {
    const { data: { response } } = await axios.get(`https://geocode-maps.yandex.ru/1.x/?format=json&geocode=${item.address.lng},${item.address.lat}`);

    return {
      ...item,
      date: new Date(+(new Date()) - Math.floor(Math.random() * 10000000000)),
      textualAddress: response.GeoObjectCollection.featureMember[0].GeoObject.metaDataProperty.GeocoderMetaData.text
    };
  } catch (error) {
    return {
      ...item,
      textualAddress: 'Адрес не найден'
    };
  }
}

export function loadProducts() {
  return async (dispatch) => {
    dispatch({ type: LOAD_PRODUCTS });

    try {
      const { data: { data } } = await axios.get('https://avito.dump.academy/products');
      const composedData = pullLikesFromStorage(data);
      const items = await Promise.all(composedData.map(async item => await decodeAddress(item)));
      const prices = items.map(item => +item.price).filter(item => isFinite(item));

      dispatch({ type: LOAD_PRODUCTS_SUCCESS, data: { items, prices } });
    } catch (error) {
      dispatch({ type: LOAD_PRODUCTS_ERROR });
    }
  };
}

export function filterProducts({ category = 'all', sort = 'popular', price = 5000, favorite = false }) {
  return async (dispatch, getState) => {
    dispatch({ type: FILTER_PRODUCTS });

    try {
      const { originalItems } = getState().products;

      const filteredItems = pullLikesFromStorage(originalItems).filter(item => (
        (item.price <= price || !item.price) &&
        (category === 'all' || item.category === category || !item.category) &&
        (item.isLiked === favorite || item.isLiked === true)
      ));

      const sortedItems = sortProducts(filteredItems, sort);

      dispatch({ type: FILTER_PRODUCTS_SUCCESS, data: sortedItems });
    } catch (error) {
      dispatch({ type: FILTER_PRODUCTS_ERROR });
    }
  };
}

export function loadProduct(id) {
  return async (dispatch) => {
    dispatch({ type: LOAD_PRODUCT });

    try {
      const { data: { data } } = await axios.get(`https://avito.dump.academy/products/${id}`);
      const item = await decodeAddress(data);
      const sellerId = item.relationships.seller;
      const seller = await axios.get(`https://avito.dump.academy/sellers/${sellerId}`);

      dispatch({
        type: LOAD_PRODUCT_SUCCESS,
        data: { ...item, seller: seller.data.data }
      });
    } catch (error) {
      dispatch({ type: LOAD_PRODUCT_ERROR });
    }
  };
}

export function toggleLiked(id) {
  return async (dispatch, getState) => {
    const item = getState().products.items.find(product => product.id === id);
    const storagedValues = JSON.parse(localStorage.getItem('likes'));

    const values = !storagedValues
      ? [id]
      : item.isLiked
        ? storagedValues.filter(value => value !== id)
        : [...storagedValues, id];

    localStorage.setItem('likes', JSON.stringify(values));

    dispatch({ type: TOGGLE_LIKED, data: { ...item, isLiked: !item.isLiked } });
  };
}

export default function products(state = initialState, action = {}) {
  switch (action.type) {
    case LOAD_PRODUCTS:
      return {
        ...state,
        isLoading: true
      };

    case LOAD_PRODUCTS_SUCCESS: {
      const { items, prices } = action.data;

      return {
        ...state,
        isLoading: false,
        items,
        originalItems: items,
        minPrice: Math.ceil(Math.min(...prices) / 1000) * 1000,
        maxPrice: Math.ceil(Math.max(...prices) / 1000) * 1000
      };
    }

    case LOAD_PRODUCTS_ERROR:
      return {
        ...state,
        isLoading: false
      };

    case FILTER_PRODUCTS:
      return {
        ...state,
        isFiltering: true
      };

    case FILTER_PRODUCTS_SUCCESS:
      return {
        ...state,
        isFiltering: false,
        items: action.data
      };

    case FILTER_PRODUCTS_ERROR:
      return {
        ...state,
        isFiltering: false
      };

    case LOAD_PRODUCT:
      return {
        ...state,
        item: {
          ...state.item,
          isLoading: true,
          details: initialState.item.details
        }
      };

    case LOAD_PRODUCT_SUCCESS:
      return {
        ...state,
        item: {
          isLoading: false,
          details: {
            ...state.item.details,
            ...action.data
          }
        }
      };

    case LOAD_PRODUCT_ERROR:
      return {
        ...state,
        item: {
          ...state.item,
          isLoading: false
        }
      };

    case TOGGLE_LIKED: {
      return {
        ...state,
        items: state.items.map(item => (item.id === action.data.id ? action.data : item))
      };
    }

    default:
      return state;
  }
}
