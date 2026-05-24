pipeline {
  agent any

  environment {
    CI = 'true'
  }

  stages {
    stage('Environment Check') {
      steps {
        sh '''
          echo "Current user:"
          whoami
          echo "Git version:"
          git --version
          echo "Node version:"
          node --version
          echo "npm version:"
          npm --version
          echo "Docker version:"
          docker --version
        '''
      }
    }

    stage('Install Dependencies') {
      steps {
        sh 'npm ci'
      }
    }

    stage('Lint') {
      steps {
        sh 'npm run lint'
      }
    }

    stage('Build') {
      steps {
        sh 'npm run build'
      }
    }

    stage('Archive Build Artifact') {
      steps {
        archiveArtifacts artifacts: 'dist/**', fingerprint: true
      }
    }
  }
}
