/**
 * Data cho các case login KHÔNG hợp lệ (sai mật khẩu, tài khoản không tồn tại...).
 * Case login hợp lệ dùng chung buildRegisterData() ở register.data.ts vì phải
 * đăng ký user thật trước mới login được — không có "user cố định" hardcode ở đây.
 */
export const INVALID_LOGIN_CASES = [
  { description: 'sai mật khẩu', username: 'qa_not_exist_user', password: 'wrong_password' },
  { description: 'tài khoản không tồn tại', username: 'no_such_user_999', password: '123456' },
];
