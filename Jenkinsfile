pipeline {
    agent any

    environment {
        NODE_VERSION = '20.x'
    }

    stages {
        stage('Install Dependencies') {
            steps {
                script {
                    sh 'yarn install'
                }
            }
        }

        stage('Build') {
            steps {
                script {
                    sh 'yarn build:production'
                }
            }
        }

        stage('Check Cloudflared and Run Tunnel') {
            steps {
                script {
                    def portOpen = sh(script: "netstat -an | grep 666 | grep LISTEN", returnStatus: true) == 0
                    if (!portOpen) {
                        sh 'cloudflared access ssh --hostname ssh-api-smart-shop-server.nhungchangtrainhaycam.site --url 127.0.0.1:666 &'
                        sleep 10
                        portOpen = sh(script: "netstat -an | grep 666 | grep LISTEN", returnStatus: true) == 0
                        if (!portOpen) {
                            error 'Failed to open port 666 after running cloudflared'
                        }
                    } else {
                        echo 'Port 666 is already open, skipping Cloudflared tunnel setup.'
                    }
                }
            }
        }

        stage('Copy Files and run pm2') {
            steps {
                script {
                    sshagent(['ssh-smart-shop']) {
                        sh 'scp -o StrictHostKeyChecking=no -P 666 -r build/* quangthe@127.0.0.1:/home/smart-shop'
                        sh 'ssh -o StrictHostKeyChecking=no -p 666 quangthe@127.0.0.1 "cd /home/smart-shop && ls -la"'
                    }
                }
            }
        }
    }
}