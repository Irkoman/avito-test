export const sortProducts = (array, tag) => {
  switch (tag) {
    case 'cheap':
      return array.sort((a, b) => (
        !isFinite(a.price)
          ? 1
          : !isFinite(b.price)
            ? -1
            : a.price - b.price
      ));
    case 'expensive':
      return array.sort((a, b) => (
        !isFinite(a.price)
          ? 1
          : !isFinite(b.price)
            ? -1
            : b.price - a.price
      ));
    case 'popular':
    default:
      return array;
  }
};
