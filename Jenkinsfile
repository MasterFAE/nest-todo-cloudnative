pipeline {
    agent any

    stages {
        stage("checkout") {
            steps {
                checkout scm
            }
        }
        
        
        stage("Dependency"){
            steps {
                sh "sudo apt npm install"
                sh 'npx prisma generate'
            }
        }
        
        stage("Build") {
            steps {
                sh "npm run build"
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

                        // Build the Docker image
                        docker.build("${imageName}", "${imageDir}")

                        // Push the Docker image to a registry if needed
                        docker.withRegistry('https://hub.docker.com/', 'dockerhub') {
                            docker.image("${imageName}").push()
                        }
                    }
                }
            }
        }
    }
}