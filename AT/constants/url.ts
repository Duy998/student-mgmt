
export const API = {
  auth: {
    login: '/api/auth/login',
    register: '/api/auth/register',
  },
  admin: {
    deleteUserByUsername: (username: string) => `/api/users/by-username/${username}`,
    createUser: `api/auth/register`,
  },
};
