
 
pipeline {
   
   stages {
     stage('Checkout SCM') {
  steps {
    checkout([
      $class: 'GitSCM',
      branches: [[name: 'master']],
      userRemoteConfigs: [[
        url: 'git@github.com:Nitin2910/angular-app.git',
        credentialsId: '',
      ]]
     ])
   }
}
   }     
}
