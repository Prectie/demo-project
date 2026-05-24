pipeline {
  agent any

  environment {
    CI = 'true'
    IMAGE_NAME = 'demo-project-app'
    TEST_CONTAINER = 'demo-project-test'
    TEST_PORT = '18080'
  }

  stages {
    stage('Environment Check') {
      steps {
        sh '''
          whoami
          git --version
          node --version
          npm --version
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

    stage('Build Docker Image') {
      steps {
        sh '''
          docker build \
            -t "$IMAGE_NAME:$BUILD_NUMBER" \
            -t "$IMAGE_NAME:latest" \
            .
        '''
      }
    }

    stage('Deploy Test Environment') {
      steps {
        sh '''
          docker rm -f "$TEST_CONTAINER" || true
          docker run -d \
            --name "$TEST_CONTAINER" \
            --restart unless-stopped \
            -p "$TEST_PORT:80" \
            "$IMAGE_NAME:$BUILD_NUMBER"
        '''
      }
    }

    stage('Health Check') {
      steps {
        sh '''
          for i in $(seq 1 20); do
            if curl -fsS "http://127.0.0.1:$TEST_PORT/health"; then
              echo "Test environment is healthy"
              exit 0
            fi
            sleep 2
          done

          echo "Health check failed"
          docker logs "$TEST_CONTAINER"
          exit 1
        '''
      }
    }
  }
}