pipeline {
  agent any

  stages {
    stage('Webhook Trigger Check') {
      steps {
        sh '''
          echo "GitHub webhook triggered Jenkins successfully"
          echo "Current user:"
          whoami
          echo "Git version:"
          git --version
          echo "Docker version:"
          docker --version
          echo "Running Docker containers visible to Jenkins:"
          docker ps
        '''
      }
    }
  }
}
