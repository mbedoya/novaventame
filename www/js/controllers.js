angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {
  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
})

.controller('PlaylistsCtrl', function($scope) {
  $scope.playlists = [
    { title: 'Reggae', id: 1 },
    { title: 'Chill', id: 2 },
    { title: 'Dubstep', id: 3 },
    { title: 'Indie', id: 4 },
    { title: 'Rap', id: 5 },
    { title: 'Cowbell', id: 6 }
  ];
})

.controller('BienvenidaCtrl', function($scope) {

})

.controller('LoginCtrl', function($scope, $location, $state) {

    //Inicializar los datos de inicio
    $scope.datosInicio = {};

    $scope.capturarCedula = function() {
        console.log('Doing login', $scope.datosInicio);
        $state.go('app.recordar');
    };
})

.controller('RecordarCtrl', function($scope, $location, $state) {

    //Inicializar los datos de inicio
    $scope.datosInicio = {};

    $scope.capturarRecordar = function() {
        console.log('Doing Recordar', $scope.datosInicio);

        $state.go('app.home');
    };
})

.controller('HomeCtrl', function($scope) {

    //Inicializar los datos de inicio
    $scope.datosInicio = { nombre: 'Ana Isabel', saldo: 275000, cupo: 250000, flexibilizacion: 50000, segmento: "Zafiro" };

    //Inicializar los datos de campaña
    $scope.campana = { numero: '01', fechaMontajePedido: 'Febrero 15' };


})

.controller('PlaylistCtrl', function($scope, $stateParams) {
});
