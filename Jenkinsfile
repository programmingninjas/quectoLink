pipeline {
    agent {
        label 'docker-agent'
    }

    environment {
        MONGO_URI = 'mongodb://mongo:27017/quectolink'
        PORT = '5000'
        JWT_SECRET = 'Hello'
        REMOTE = '103.189.173.46'
        API = "http://103.189.173.46"
    }

    stages {
        stage('Initialize Docker') {
            steps {
                script {
                    def dockerHome = tool 'docker'
                    env.PATH = "${dockerHome}/bin:${env.PATH}"
                }
            }
        }

        stage('Get Version') {
            steps {
                script {
                    def backend = readJSON file: 'backend/package.json'
                    env.BACKEND_VERSION = backend.version
                    echo "Backend Version from package.json: ${env.BACKEND_VERSION}"

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
                                sh "IP=${API} docker build -t programmingninjas/quectolink:${env.FRONTEND_VERSION} ."
                            }
                        }
                    }
                }
            }
        }

        stage('Deploy') {
            steps {
                withCredentials([sshUserPrivateKey(credentialsId: 'ssh-agent', keyFileVariable: 'SSH_KEY', usernameVariable: 'SSH_USER')]) {
                    script {
                        def remoteCommands = """
                            cd quectoLink
                            git pull origin master
                            sudo MONGO_URI='${MONGO_URI}' PORT='${PORT}' JWT_SECRET='${JWT_SECRET}' BACKEND_VERSION='${BACKEND_VERSION}' FRONTEND_VERSION='${FRONTEND_VERSION}' docker compose up -d --build
                        """
                        sh "ssh -o StrictHostKeyChecking=no -i ${SSH_KEY} ${SSH_USER}@${env.REMOTE} '${remoteCommands}'"
                        echo 'Deployed!'
                    }
                }
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
