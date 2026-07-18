pipeline {
    agent any

    environment {
        // Đường dẫn tuyệt đối để tránh lỗi
        WORKSPACE = pwd()
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
