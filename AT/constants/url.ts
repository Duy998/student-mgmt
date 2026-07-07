/**
 * Tập trung các API endpoint dùng để setup/teardown dữ liệu test qua request context.
 * Không rải string literal '/api/...' trong từng file spec để tránh gõ sai
 * và dễ sửa một chỗ khi backend đổi route.
 */
export const API = {
  auth: {
    login: '/api/auth/login',
    register: '/api/auth/register',
  },
  admin: {
    deleteUser: '/api/admin/delete-user',
  },
};
