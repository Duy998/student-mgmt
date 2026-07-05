FROM python:3.12-slim

WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc libpq-dev curl \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Không COPY code ở đây — code sẽ được mount qua volume trong docker-compose.dev.yml
# để sửa file .py là tự reload ngay, không cần build lại image.

EXPOSE 8000

# --reload theo dõi thay đổi file trong ./app và tự khởi động lại server
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
