pipeline {
    agent any

    environment {
        // Deploy Hook URL (sẽ thêm sau)
        RENDER_DEPLOY_HOOK = credentials('render-deploy-hook')
    }

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
                // Nếu dùng pytest
                sh 'docker run --rm student-mgmt:${BUILD_NUMBER} pytest'
                // Nếu dùng unittest:
                // sh 'docker run --rm student-mgmt:${BUILD_NUMBER} python -m unittest discover tests'
            }
        }

        stage('Deploy to Render') {
            steps {
                echo '🚀 Deploying to Render...'
                sh "curl -X POST ${RENDER_DEPLOY_HOOK}"
            }
        }
    }

    post {
        success {
            echo '✅ Pipeline completed successfully!'
        }
        failure {
            echo '❌ Pipeline failed! Check the logs.'
        }
    }
}