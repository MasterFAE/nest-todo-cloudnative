pipeline {
    agent any

    stages {
        stage("checkout") {
            steps {
                checkout scm
            }
        }

        stage('Build Docker Images') {
            steps {
                script {
                    def appsDir = 'apps'

                    // List of image names
                    def imageNames = ['todo', 'auth', 'api', 'canva']

                    // Loop through each image and build
                    imageNames.each { imageName ->
                        def imageDir = "${appsDir}/${imageName}"

                        // Push the Docker image to a registry if needed
                        withDockerRegistry(credentialsId: 'dockerhub') {
                            bat "cd ${imageDir} && docker build -t faemeister/nest_todo-${imageName} -f . ../.."
                            docker.image("faemeister/nest_todo-${imageName}").push()
                        }
                    }
                }
            }
        }
    }
}
