## Chạy bằng Docker Compose (Khuyến nghị)

### 1. Chuẩn bị

Đảm bảo đã cài đặt:

- Docker Desktop 4.x trở lên
- Docker Compose (đi kèm Docker Desktop)

Kiểm tra:

```bash
docker --version
docker compose version
```

---

### 2. Cấu hình môi trường

Copy file môi trường:

```bash
cp .env.example .env
```

> **Windows (PowerShell)**

```powershell
copy .env.example .env
```

Mở file `.env` và cập nhật các thông tin cần thiết.

Ví dụ:

```env
SECRET_KEY=your-secret-key

POSTGRES_USER=postgres
POSTGRES_PASSWORD=123456
POSTGRES_DB=student_db

DATABASE_URL=postgresql://postgres:123456@db:5432/student_db
```

> **Lưu ý**
>
> Khi sử dụng Docker Compose, Backend kết nối PostgreSQL thông qua tên service `db`, **không sử dụng** `localhost` hoặc `host.docker.internal`.

---

### 3. Build và khởi động hệ thống

Tại thư mục gốc của project:

```bash
docker compose up --build
```

Hoặc chạy dưới nền:

```bash
docker compose up -d --build
```

Docker Compose sẽ tự động:

- Build Backend Image
- Build Frontend Image
- Khởi tạo PostgreSQL
- Tạo Docker Network
- Khởi động Database
- Khởi động Backend
- Khởi động Frontend

---

### 4. Truy cập hệ thống

| Service | URL |
|----------|-----|
| Frontend | http://localhost:8080 |
| Backend API | http://localhost:8000 |
| Swagger UI | http://localhost:8000/api/docs |

---

### 5. Đăng nhập

Tài khoản Admin mặc định:

| Username | Password |
|----------|----------|
| `admin` | `Admin@123` |

> **Khuyến nghị:** Đổi mật khẩu ngay sau lần đăng nhập đầu tiên.

---

### 6. Một số lệnh Docker Compose hữu ích

Khởi động hệ thống:

```bash
docker compose up -d
```

Build lại Image:

```bash
docker compose up -d --build
```

Xem trạng thái:

```bash
docker compose ps
```

Xem log toàn bộ hệ thống:

```bash
docker compose logs
```

Theo dõi log realtime:

```bash
docker compose logs -f
```

Theo dõi Backend:

```bash
docker compose logs -f backend
```

Theo dõi Frontend:

```bash
docker compose logs -f frontend
```

Theo dõi Database:

```bash
docker compose logs -f db
```

---

### 7. Truy cập vào Container

Backend:

```bash
docker compose exec backend sh
```

Frontend:

```bash
docker compose exec frontend sh
```

Database:

```bash
docker compose exec db bash
```

---

### 8. Dừng hệ thống

```bash
docker compose down
```

Dừng và xóa luôn Volume (xóa dữ liệu PostgreSQL):

```bash
docker compose down -v
```

---

### 9. Cập nhật source code

Trong môi trường Development, Backend và Frontend được mount bằng Docker Volume.

- **Backend**: tự động reload khi thay đổi source code (`uvicorn --reload`).
- **Frontend**: các thay đổi HTML/CSS/JS sẽ có hiệu lực sau khi refresh trình duyệt. Nếu sử dụng Live Server hoặc Vite sẽ hỗ trợ Hot Reload.

Thông thường **không cần build lại image** khi chỉ sửa source code.

Chỉ cần build lại khi:

- Dockerfile thay đổi.
- requirements.txt thay đổi.
- Thêm package hệ thống.