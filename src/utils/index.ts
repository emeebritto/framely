export const splitData = (data:any[]):any[] => {
  const medium = Math.floor(data.length / 2);
  const first_column = [...data].splice(0, medium);
  const second_column = [...data].splice(medium, medium * 2);
  return [first_column, second_column];
};
