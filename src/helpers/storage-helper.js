export const pullLikesFromStorage = (array) => {
  const items = JSON.parse(localStorage.getItem('likes')) || [];
  const isLiked = id => !!items.find(item => item === id);

  return array.map(item => ({ ...item, isLiked: isLiked(item.id) }));
};
