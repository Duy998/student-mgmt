pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                echo '📦 Pulling code from GitHub...'
                checkout scm
            }
        }

        stage('Build Docker Image') {
            steps {
                echo '🐳 Building Docker image...'
                sh 'docker build -t student-mgmt:${BUILD_NUMBER} .'
            }
        }

        stage('Run Tests') {
            steps {
                echo '🧪 Running tests...'
                sh 'docker run --rm student-mgmt:${BUILD_NUMBER} npm test'
                // Hoặc Python: sh 'docker run --rm student-mgmt:${BUILD_NUMBER} pytest'
            }
        }
    }

    post {
        success {
            echo '✅ Build and tests passed!'
        }
        failure {
            echo '❌ Build or tests failed!'
        }
    }
}