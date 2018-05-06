import moment from 'moment';

export const formatPrice = number =>
  number.toString().replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ');

export const formatDate = (date) => {
  const diff = new Date() - date;

  if (diff < 1000) {
    return 'только что';
  }

  const seconds = Math.floor(diff / 1000);

  if (seconds < 60) {
    return `${seconds} секунд назад`;
  }

  const minutes = Math.floor(diff / 60000);

  if (minutes < 60) {
    return `${minutes} минут назад`;
  }

  return moment(date).locale('ru').format('DD MMMM YYYY');
};

export const inRange = (number, from, to) =>
  !!number && number >= from && number <= to;
