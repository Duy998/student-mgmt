pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                echo '📦 Pulling code from GitHub...'
                checkout scm
            }
        }

        stage('Run Playwright Tests') {
            steps {
                echo '🧪 Running Playwright tests...'
                script {
                    // Cd vào thư mục AT và chạy test
                    dir('AT') {
                        // Cài dependencies nếu chưa có
                        sh 'npm install'
                        // Chạy test
                        sh 'npm test'
                    }
                }
            }
        }

        stage('Build with Docker Compose') {
            steps {
                echo '🐳 Building Docker images...'
                // Build các service (backend, frontend, db)
                sh 'docker-compose build'
            }
        }

        stage('Start Services') {
            steps {
                echo '🚀 Starting services...'
                sh 'docker-compose up -d'
                // Đợi services khởi động
                sleep time: 15, unit: 'SECONDS'
            }
        }

        stage('Verify Services') {
            steps {
                echo '🏥 Checking if services are running...'
                script {
                    // Kiểm tra containers đang chạy
                    sh 'docker ps | grep student-db || exit 1'
                    sh 'docker ps | grep student-be || exit 1'
                    sh 'docker ps | grep student-fe || exit 1'
                    echo '✅ All services are running!'
                }
            }
        }
    }

    post {
        always {
            echo '🧹 Cleaning up...'
            // Dừng và xóa containers
            sh 'docker-compose down || true'
        }
        success {
            echo '✅ All tests passed and services built successfully!'
        }
        failure {
            echo '❌ Pipeline failed! Check the logs.'
        }
    }
}
