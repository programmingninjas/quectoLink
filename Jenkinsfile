pipeline {
    agent {
        label 'docker-agent'
    }

    environment {
        DOCKERHUB_CREDENTIALS= credentials('dockerhubcredentials')
        GITHUB_CREDENTIALS= credentials('githubcredentials')
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

        stage('Login to Docker Hub') {      	
            steps{                       	
            	sh 'echo $DOCKERHUB_CREDENTIALS_PSW | docker login -u $DOCKERHUB_CREDENTIALS_USR --password-stdin'                		
            	echo 'Login Completed'      
            }           
        }

        stage('Build') {
            parallel {
                stage('Build Backend') {
                    steps {
                        script {
                            dir('backend') {
                                sh "docker build -t programmingninjas/argolink-backend:${BACKEND_VERSION} ."
                                sh 'docker push programmingninjas/argolink-backend:${BACKEND_VERSION}'
                            }
                        }
                    }
                }
                stage('Build Frontend') {
                    steps {
                        script {
                            dir('frontend') {
                                sh "docker build -t programmingninjas/argolink-frontend:${FRONTEND_VERSION} ."
                                sh 'docker push programmingninjas/argolink-frontend:${FRONTEND_VERSION}'
                            }
                        }
                    }
                }
            }
        }

        stage('Deploy') {
            steps {
                    script {
                        sh 'git config --global credential.helper store'
                        sh "echo \"https://${GITHUB_CREDENTIALS_USR}:${GITHUB_CREDENTIALS_PSW}@github.com\" > ~/.git-credentials"
                        sh "git clone https://github.com/programmingninjas/quectoCharts.git"
                        sh "cd quectoCharts"
                        sh "sed -i 's/^version: .*/version: ${BACKEND_VERSION}/' Chart.yaml"
                        sh "git add Chart.yaml"
                        sh "git commit -m 'Update Helm chart version to ${BACKEND_VERSION}'"
                        sh "git push origin main"
                    }
            }
        }
    }

    post {
        always {  
    	    sh 'docker logout'     
        }  
        success {
            echo 'Deployment successful!'
        }
        failure {
            echo 'Deployment failed!'
        }
    }
}
