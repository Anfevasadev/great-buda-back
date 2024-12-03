export const filterUser = (user) => {
  const { user_id, username, name, age, email } = user;
  return { id:user_id, username, name, age, email };
};