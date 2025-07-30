pipeline {
    agent any

    environment {
        IMAGE_NAME = 'nodeapp'
        CONTAINER_NAME = 'nodeapp-container'
    }

    stages {
        stage('Clone') {
            steps {
                git 'https://github.com/Gipsydh/tictactoe-pvai'
            }
        }

        stage('Build Docker Image') {
            steps {
                sh 'docker build -t $IMAGE_NAME .'
            }
        }

        stage('Deploy Docker Container') {
            steps {
                sh '''
                docker stop $CONTAINER_NAME || true
                docker rm $CONTAINER_NAME || true
                docker run -d -p 3000:3000 --name $CONTAINER_NAME $IMAGE_NAME
                '''
            }
        }
    }
}
