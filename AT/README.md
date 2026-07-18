# AT Student Management – Automation Test Suite

Playwright + TypeScript test suite for the Student Management application.

## Setup

```bash
npm install
cp .env.example .env   # Then fill in the real values in .env (DO NOT commit .env)
npx playwright install --with-deps
```

## Chạy test

```bash
npm test                 # run all tests (headless)
npm run test:headed      # run with browser visible
npm run test:ui          # run with Playwright UI mode
npm run test:auth        # tests/auth (login + register)
npm run test:register    # only tests/auth/register.spec.ts
npm run test:login       # only tests/auth/login.spec.ts
npm run test:student     # only tests/student/create-student.spec.ts
npm run test:import      # only tests/student/import-student.spec.ts
npm run test:export      # tests/student/export-excel.spec.ts + export-pdf.spec.ts
npm run report           # open the HTML report from the latest run
```

## Cấu trúc project

```
pages/        Page Object Model (BasePage, LoginPage, RegisterPage, StudentPage)
tests/        Test spec files, chia theo domain (auth/, student/)
constants/    env.ts (đọc biến môi trường), url.ts (API endpoint), messages.ts (message cố định)
test-data/    Factory sinh dữ liệu test động theo domain (register.data.ts, student.data.ts, login.data.ts)
              + file mẫu tĩnh (excel/student-import.xlsx)
utils/        Helper kỹ thuật thuần tuý, không gắn business domain
              (excel.ts đọc file .xlsx, download.ts xử lý file tải về, random.ts sinh giá trị ngẫu nhiên)
```

## Quy ước

- Không hardcode secret trong source — luôn đọc qua `.env` (xem `.env.example`).
  `constants/env.ts` sẽ throw lỗi ngay khi thiếu biến bắt buộc (fail-fast) thay vì
  âm thầm chạy với giá trị mặc định sai.
- Mỗi test tự sinh dữ liệu riêng qua `test-data/*.data.ts` và tự cleanup ở
  `afterAll` (xoá đúng user/dữ liệu mà chính test đó tạo ra), để test idempotent
  và chạy song song an toàn.
- Mọi tương tác UI đi qua Page Object trong `pages/`, không viết locator trực
  tiếp trong file test.
- Endpoint API dùng cho setup/teardown tập trung ở `constants/url.ts`, không rải
  string `'/api/...'` trong từng spec.
