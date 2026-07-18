pipeline {
    agent any

    environment {
        // Đường dẫn tuyệt đối để tránh lỗi
        WORKSPACE = pwd()
        // Database
        POSTGRES_USER=postgres
        POSTGRES_PASSWORD=123456
        POSTGRES_DB=student_db
        DATABASE_URL=postgresql://postgres:123456@host.docker.internal:5432/student_db
    
        // JWT — generate a strong key: openssl rand -hex 32
        SECRET_KEY=8f6e5d3c0a2e7b4d6f9a8c1e5b7d3a1c2f4e6d8b9c0a1e2d3f4b5c6d7e8f9a0
        ACCESS_TOKEN_EXPIRE_MINUTES=60
        API_SECRET_KEY=1f6e5d3c0a2e7b4d6f9a8c1e5b7d3a1c2f4e6d8b9c0a1e2d3f4b5c6d7e8f9bo
        // CORS — comma separated origins allowed to call the API
        ALLOWED_ORIGINS=http://localhost:8080,http://localhost:5500,http://127.0.0.1:5500,http://localhost:8000,http://localhost:3000,http://127.0.0.1:3000

        
    }

    stages {
        stage('Checkout') {
            steps {
                echo '📦 Pulling code from GitHub...'
                checkout scm
            }
        }

        stage('Build Docker Images') {
            steps {
                echo '🐳 Building Docker images...'
                bat 'docker-compose build'
            }
        }

        stage('Start Services') {
            steps {
                echo '🚀 Starting all services...'
                bat 'docker-compose up -d'
                echo '⏳ Waiting for services to be ready...'
                // Đợi services khởi động
                sleep time: 30, unit: 'SECONDS'
            }
        }

        stage('Verify Services Running') {
            steps {
                echo '🏥 Checking if services are running...'
                script {
                    bat 'docker ps | findstr student-db'
                    bat 'docker ps | findstr student-be'
                    bat 'docker ps | findstr student-fe'
                    echo '✅ All services are running!'
                }
            }
        }

        stage('Install Playwright & Run Tests') {
            steps {
                echo '🧪 Setting up and running Playwright tests...'
                script {
                    dir('AT') {
                        // 1. Cài dependencies
                        bat 'npm install'
                        // 2. Cài browsers cho Playwright
                        bat 'npx playwright install'
                        // 3. Chạy test (backend và frontend đã chạy)
                        bat 'npm test'
                    }
                }
            }
        }

        stage('Generate Test Report') {
            steps {
                echo '📊 Generating test report...'
                dir('AT') {
                    bat 'npx playwright show-report || echo "Report generation skipped"'
                }
            }
        }
    }

    post {
        always {
            echo '🧹 Cleaning up...'
            bat 'docker-compose down -v || exit 0'
        }
        success {
            echo '✅ Pipeline completed successfully!'
        }
        failure {
            echo '❌ Pipeline failed! Check the logs.'
        }
    }
}
