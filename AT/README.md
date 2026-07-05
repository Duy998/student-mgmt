# AT Student Management – Automation Test Suite

Playwright + TypeScript test suite cho ứng dụng Student Management.

## Setup

```bash
npm install
cp .env.example .env   # rồi điền giá trị thật vào .env
npx playwright install --with-deps
```

## Chạy test

```bash
npm test                 # chạy toàn bộ test (headless)
npm run test:headed      # chạy có hiện trình duyệt
npm run test:ui          # chạy với Playwright UI mode
npm run test:auth        # chỉ chạy tests/auth.spec.ts
npm run test:student     # chỉ chạy tests/create_student.spec.ts
npm run report           # mở report HTML lần chạy gần nhất
```

## Cấu trúc project

```
pages/      Page Object Model (BasePage, LoginPage, RegisterPage, StudentPage)
tests/      Test spec files
utils/      env.ts (đọc biến môi trường), constants.ts (giá trị cố định),
            test-data.ts (factory sinh dữ liệu test động)
```

## Quy ước

- Không hardcode secret/dữ liệu test cố định trong source — dùng `.env` (xem `.env.example`).
- Mỗi test tự sinh dữ liệu riêng qua `utils/test-data.ts` và tự cleanup ở `afterAll`/`afterEach`,
  để test idempotent và chạy song song an toàn.
- Mọi tương tác UI đi qua Page Object trong `pages/`, không viết locator trực tiếp trong file test.
