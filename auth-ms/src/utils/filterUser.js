export const filterUser = (user) => {
  const { id, username, name, age, email } = user;
  return { id, username, name, age, email };
};