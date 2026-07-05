# Hệ thống Quản lý Học sinh

Ứng dụng quản lý học sinh full-stack: FastAPI + PostgreSQL (backend), HTML/CSS/JS thuần (frontend), đóng gói bằng Docker.

## Cấu trúc project

```
student-mgmt/
├── BE/                     # Backend - FastAPI
│   ├── app/
│   │   ├── core/           # config, database, security (JWT, bcrypt)
│   │   ├── models/         # SQLAlchemy models
│   │   ├── schemas/        # Pydantic schemas
│   │   ├── routers/        # auth, students, users
│   │   ├── services/       # auth dependencies (role checking)
│   │   └── main.py         # entrypoint
│   ├── requirements.txt
│   ├── Dockerfile
│   └── .env.example
├── FE/                      # Frontend - static HTML/CSS/JS
│   ├── css/                 # style.css (design tokens), auth.css, dashboard.css
│   ├── js/                  # config.js (API client), auth.js, students.js, users.js, dashboard.js
│   ├── login.html / register.html / dashboard.html / index.html
│   ├── nginx.conf
│   └── Dockerfile
├── docker-compose.yml
└── .env.example
```

## Chạy bằng Docker (khuyến nghị)

1. Copy file môi trường:
   ```bash
   cp .env.example .env
   ```
2. Mở `.env`, đổi `SECRET_KEY` thành giá trị ngẫu nhiên mạnh:
   ```bash
   openssl rand -hex 32
   ```
3. Build và chạy toàn bộ hệ thống:
   ```bash
   docker compose up --build
   ```
4. Truy cập:
   - Frontend: http://localhost
   - API docs (Swagger): http://localhost:8000/api/docs

5. Đăng nhập với tài khoản admin được tạo sẵn lần đầu chạy:
   - Username: `admin`
   - Password: `Admin@123`
   - **Đổi mật khẩu này ngay sau khi đăng nhập lần đầu** (mục đổi mật khẩu qua API `/api/auth/change-password`, hoặc tạo trang riêng nếu cần).

## Deploy lên Railway (online, miễn phí)

Railway hỗ trợ deploy trực tiếp từ Dockerfile + PostgreSQL built-in, không cần VPS.

1. Tạo tài khoản tại [railway.app](https://railway.app), tạo **New Project**.
2. Add **PostgreSQL** plugin (Railway tự cấp `DATABASE_URL`).
3. Add service **Backend**:
   - Connect repo, chọn root directory `BE/`
   - Railway tự build theo `Dockerfile`
   - Set biến môi trường: `SECRET_KEY`, `ALLOWED_ORIGINS` (domain frontend), `DATABASE_URL` (copy từ PostgreSQL plugin, hoặc dùng reference variable `${{Postgres.DATABASE_URL}}`)
4. Add service **Frontend**:
   - Root directory `FE/`
   - Trong `FE/js/config.js`, sửa lại `API_BASE_URL` thành domain backend Railway cấp (vd: `https://your-backend.up.railway.app/api`)
   - Hoặc sửa `nginx.conf` để proxy `/api/` sang domain backend Railway thay vì `backend:8000`
5. Railway tự cấp domain HTTPS công khai cho cả 2 service.

> Lưu ý: khi deploy online, sửa `FE/js/config.js` để `API_BASE_URL` trỏ đúng domain backend thật, vì khi đó frontend và backend không còn chạy trên cùng `localhost`.

## Tài khoản & phân quyền

| Vai trò | Quyền hạn |
|---|---|
| **User** thường | Xem, thêm, sửa học sinh; xuất Excel/PDF |
| **Admin** | Tất cả quyền của User + xóa học sinh + quản lý tài khoản (cấp quyền admin, khóa/mở khóa, xóa user) |

Tài khoản đăng ký mới qua `/register.html` mặc định là **User** thường. Chỉ Admin có thể cấp quyền Admin cho người khác qua trang **Quản lý người dùng**.

## API chính

| Method | Endpoint | Mô tả |
|---|---|---|
| POST | `/api/auth/register` | Đăng ký |
| POST | `/api/auth/login` | Đăng nhập (trả JWT) |
| GET | `/api/auth/me` | Thông tin user hiện tại |
| PUT | `/api/auth/change-password` | Đổi mật khẩu |
| GET | `/api/students/` | Danh sách học sinh (search, filter, pagination) |
| GET | `/api/students/statistics` | Thống kê tổng quan |
| GET | `/api/students/export/excel` | Xuất Excel |
| GET | `/api/students/export/pdf` | Xuất PDF |
| POST/PUT/DELETE | `/api/students/{id}` | CRUD học sinh (xóa cần quyền Admin) |
| GET/PUT/DELETE | `/api/users/{id}` | Quản lý user (chỉ Admin) |

Toàn bộ API có Swagger UI tại `/api/docs`.

## Chạy local không dùng Docker (phát triển)

**Backend:**
```bash
cd BE
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
# Cần PostgreSQL chạy sẵn, hoặc sửa DATABASE_URL trong .env sang sqlite tạm để test
uvicorn app.main:app --reload
```

**Frontend:** mở `FE/index.html` trực tiếp bằng Live Server hoặc:
```bash
cd FE
python -m http.server 8080
```
