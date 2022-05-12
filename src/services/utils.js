function divideArray(array, size) {
  let count = 0;
  let y = Math.ceil(array.length / size);
  const newArray = [];
  for (let i = 0; i < y; i++) {
    newArray.push(array.slice(count, count + size));
    count += size;
  }
  return newArray;
}
async function asyncFilter(array, callback) {
  const filtered = [];
  for (let i = 0; i < array.length; i++) {
    const current = array[i];
    const condition = await callback(current);
    if (condition) filtered.push(current);
  }
  return filtered;
}
function indexArray(array, byprop) {
  return array.reduce(
    (acc, current) => ({
      ...acc,
      [current[byprop]]: current,
    }),
    {}
  );
}
function filterRepeated(array, byprop) {
  if (!byprop) {
    return Object.values(
      array.reduce((acc, curr) => {
        if (acc[curr]) return acc;
        acc[curr] = curr;
        return acc;
      }, {})
    );
  }
  return Object.values(
    array.reduce((acc, curr) => {
      if (acc[curr[byprop]]) return acc;
      acc[curr[byprop]] = curr;
      return acc;
    }, {})
  );
}
function addAdditionalInfo(related_users, additional_info) {
  let { followers, following } = related_users;
  followers = followers.map((user) => ({
    ...user,
    ...additional_info[user.pk],
  }));
  following = following.map((user) => ({
    ...user,
    ...additional_info[user.pk],
  }));
  return { followers, following };
}
export {
  divideArray,
  indexArray,
  filterRepeated,
  addAdditionalInfo,
  asyncFilter,
};
