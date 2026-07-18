pipeline {

    agent any

    environment {
        POSTGRES_USER = 'postgres'
        POSTGRES_PASSWORD = '123456'
        POSTGRES_DB = 'student_db'
        DATABASE_URL = 'postgresql://postgres:123456@host.docker.internal:5432/student_db'
        SECRET_KEY = '8f6e5d3c0a2e7b4d6f9a8c1e5b7d3a1c2f4e6d8b9c0a1e2d3f4b5c6d7e8f9a0'
        ACCESS_TOKEN_EXPIRE_MINUTES = '60'
        API_SECRET_KEY = '1f6e5d3c0a2e7b4d6f9a8c1e5b7d3a1c2f4e6d8b9c0a1e2d3f4b5c6d7e8f9bo'
        ALLOWED_ORIGINS = 'http://localhost:8080,http://localhost:5500,http://127.0.0.1:5500,http://localhost:8000,http://localhost:3000,http://127.0.0.1:3000'
    }

    stages {

        stage('Checkout Source') {
            steps {
                checkout scm
            }
        }

        stage('Create .env') {
            steps {

                bat '''
                (
                echo POSTGRES_USER=%POSTGRES_USER%
                echo POSTGRES_PASSWORD=%POSTGRES_PASSWORD%
                echo POSTGRES_DB=%POSTGRES_DB%
                echo DATABASE_URL=%DATABASE_URL%
                echo SECRET_KEY=%SECRET_KEY%
                echo ACCESS_TOKEN_EXPIRE_MINUTES=%ACCESS_TOKEN_EXPIRE_MINUTES%
                echo API_SECRET_KEY=%API_SECRET%
                echo ALLOWED_ORIGINS=%ALLOWED_ORIGINS%
                )>.env
                '''
            }
        }

        stage('Build Docker') {
            steps {
                bat 'docker-compose build'
            }
        }

        stage('Start Docker') {
            steps {
                bat 'docker-compose up -d'
            }
        }

        stage('Wait Backend') {
            steps {
                sleep(time:30, unit:'SECONDS')
            }
        }

        stage('Run Playwright Test') {
            steps {

                dir('AT') {

                    bat 'npm install'

                    bat 'npx playwright install'

                    bat 'npx playwright test'

                }

            }
        }

    }

    post {

        always {

            junit allowEmptyResults: true,
                  testResults: 'AT/test-results/results.xml'

            publishHTML(target: [
                    allowMissing: true,
                    alwaysLinkToLastBuild: true,
                    keepAll: true,
                    reportDir: 'AT/playwright-report',
                    reportFiles: 'index.html',
                    reportName: 'Playwright Report'
            ])

            archiveArtifacts artifacts: '''
AT/playwright-report/**
AT/test-results/**
AT/test-results/**/*.png
AT/test-results/**/*.webm
AT/test-results/**/*.zip
''',
            fingerprint: true

            bat 'docker-compose down -v'

            bat 'del .env'

        }

        success {
            echo 'Pipeline SUCCESS'
        }

        failure {
            echo 'Pipeline FAILED'
        }

    }

}