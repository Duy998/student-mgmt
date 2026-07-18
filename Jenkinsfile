pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                echo '📦 Pulling code from GitHub...'
                checkout scm
            }
        }

        stage('Install Dependencies & Run Playwright Tests') {
            steps {
                echo '🧪 Running Playwright tests...'
                script {
                    // Di chuyển vào thư mục AT
                    dir('AT') {
                        // Cài dependencies (dùng bat thay vì sh)
                        bat 'npm install'
                        // Chạy test
                        bat 'npm test'
                    }
                }
            }
        }

        stage('Build with Docker Compose') {
            steps {
                echo '🐳 Building Docker images...'
                // Dùng bat cho Windows
                bat 'docker-compose build'
            }
        }

        stage('Start Services') {
            steps {
                echo '🚀 Starting services...'
                bat 'docker-compose up -d'
                // Đợi services khởi động
                sleep time: 15, unit: 'SECONDS'
            }
        }

        stage('Verify Services') {
            steps {
                echo '🏥 Checking if services are running...'
                script {
                    // Kiểm tra containers đang chạy
                    bat 'docker ps | findstr student-db'
                    bat 'docker ps | findstr student-be'
                    bat 'docker ps | findstr student-fe'
                    echo '✅ All services are running!'
                }
            }
        }
    }

    post {
        always {
            echo '🧹 Cleaning up...'
            bat 'docker-compose down || exit 0'
        }
        success {
            echo '✅ All tests passed and services built successfully!'
        }
        failure {
            echo '❌ Pipeline failed! Check the logs.'
        }
    }
}
