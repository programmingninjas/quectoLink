pipeline {
    agent any
 
    environment {
        MONGO_URI = 'mongodb://mongo:27017/quectolink'
        PORT = '5000'
        JWT_SECRET = credentials('JWT')
    }
 
    stages {
        stage('Get Version') {
            steps {
                 script {
                  def backend = readJSON file: 'backend/package.json'
                  env.BACKEND_VERSION = backend.version
                  echo "Backend Version from package.json: ${env.BACKEND_VERSION}"
               }
                 script {
                    def frontend = readJSON file: 'frontend/package.json'
                    env.FRONTEND_VERSION = frontend.version
                    echo "Frontend Version from package.json: ${env.FRONTEND_VERSION}"
                }
            }
        }
 
        stage('Build') {
            parallel {
                stage('Build Backend') {
                    steps {
                        script {
                            dir('backend') {
                                sh "docker build -t programmingninjas/quectolink-backend:${env.BACKEND_VERSION} ."
                            }
                        }
                    }
                }
                stage('Build Frontend') {
                    steps {
                        script {
                            dir('frontend') {
                                sh "docker build -t programmingninjas/quectolink:${env.FRONTEND_VERSION} ."
                            }
                        }
                    }
                }
            }
        }
 
        stage('Deploy') {
            steps {
                script {
                    sh 'docker-compose up -d'
                }
            }
        }
     
    post {
        success {
            echo 'Deployment successful!'
        }
        failure {
            echo 'Deployment failed!'
        }
    }
  }
}
