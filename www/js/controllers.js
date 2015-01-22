angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {
  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/error.html', {
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

.controller('LoginCtrl', function($scope, $rootScope, $location, $state) {

    //Inicializar los datos de inicio
    $scope.datosInicio = {};

    $scope.capturarCedula = function() {
        console.log('Doing login', $scope.datosInicio);
        $rootScope.datos = $scope.datosInicio;
        $state.go('app.recordar');
    };
})

.controller('RecordarCtrl', function($scope, $rootScope, $location, $state, $ionicLoading) {

    //Inicializar los datos de inicio
    $scope.datosInicio = {};

    $scope.capturarRecordar = function() {

        $scope.loading =  $ionicLoading.show({
            template: 'Iniciando sesión...'
        });

        $scope.datosInicio = { nombre: '', saldo: 0, cupo: 0, flexibilizacion: 0, segmento: "" };

        var url = 'http://190.90.184.23/AntaresWebServices/InterfaceAntaresServiceService';
        var metodo = 'validacionAntares';
        var mensaje =
            '<SOAP-ENV:Envelope > \
            <SOAP-ENV:Body> \
            <ns1:validacionAntares > \
            <arg0> \
            <usuario>{1}</usuario> \
            </arg0> \
            <ns1:validacionAntares > \
            </SOAP-ENV:Body> \
            </SOAP-ENV:Envelope>';
        var soapAction = 'validacionAntares';

        mensaje = mensaje.replace("{1}", $rootScope.datos.cedula);

        var servicioSoap = new soap();

        servicioSoap.invocarMetodo(url, metodo, mensaje, soapAction,
            function(msg) {
                $ionicLoading.hide();
                //$.mobile.loading('hide');
            },function (msg) {

                $ionicLoading.hide();
                //$.mobile.loading('hide');
                //$.mobile.activePage.find("#mensajeError").html("Error en el proceso de autenticación");
                //$.mobile.activePage.find("#botonError").trigger("click");

            },function(data, textStatus, jqXHR) {

                //Obtener texto de rechazo, esto pasa cuando el usuario no es válido
                var razonRechazo = data.getElementsByTagName("razonRechazo");

                console.log(data);
                console.log(razonRechazo);

                //Usuario válido?
                if(razonRechazo != null && razonRechazo.length == 0){

                    $rootScope.datos.nombre = data.getElementsByTagName("nombreCompleto")[0].textContent;
                    $rootScope.datos.segmento = data.getElementsByTagName("clasificacionValor")[0].textContent;
                    $rootScope.datos.cupo = data.getElementsByTagName("cupo")[0].textContent;
                    $rootScope.datos.saldo = data.getElementsByTagName("saldoBalance")[0].textContent;

                    //Obtener los valores necesarios de usuario
                    //usuario.nombre = data.getElementsByTagName("nombreCompleto")[0].textContent;

                    //var tipoUsuario = data.getElementsByTagName("tipoUsuarioList")[0].textContent;

                    var rolValido = false;

                    /*
                     switch(tipoUsuario) {
                     case config.servicios.antares.constantes.comodin:
                     usuario.rol = constantes.comodin;
                     rolValido = true;
                     break;
                     case config.servicios.antares.constantes.interno:
                     usuario.rol = constantes.interno;
                     rolValido = true;
                     break;
                     case config.servicios.antares.constantes.jefeNacional:
                     usuario.division = data.getElementsByTagName("codigoPais")[0].textContent;
                     usuario.region = data.getElementsByTagName("codigoRegion")[0].textContent;
                     usuario.rol = constantes.jefeNacional;
                     rolValido = true;
                     break;
                     case config.servicios.antares.constantes.jefeZonal:
                     usuario.region = data.getElementsByTagName("codigoRegion")[0].textContent;
                     usuario.zona = data.getElementsByTagName("codigoZona")[0].textContent;
                     usuario.rol = constantes.jefeZonal;
                     rolValido = true;
                     break;
                     case config.servicios.antares.constantes.gerenteZona:
                     usuario.region = data.getElementsByTagName("codigoRegion")[0].textContent;
                     usuario.zona = data.getElementsByTagName("codigoZona")[0].textContent;
                     usuario.rol = constantes.gerenteZona;
                     rolValido = true;
                     break;
                     default:
                     $.mobile.activePage.find("#mensajeError").html("Tu Rol no es válido para la aplicación");
                     $.mobile.activePage.find("#botonError").trigger("click");
                     break;
                     }

                     */
                    if(rolValido){
                        //$.mobile.changePage("#paginaHome", {transition: "none"});
                        //inicializarUsuario();
                    }

                    $state.go('app.home');

                }else{


                    console.log(razonRechazo);
                    alert("Usuario no valido");

                    //$.mobile.activePage.find("#mensajeError").html(razonRechazo);
                    //$.mobile.activePage.find("#botonError").trigger("click");
                }
            }
        );



    };
})

.controller('HomeCtrl', function($scope, $rootScope) {

     $scope.datosInicio = { nombre: $rootScope.datos.nombre, saldo: $rootScope.datos.saldo, cupo: $rootScope.datos.cupo,
         flexibilizacion: $rootScope.datos.flexibilizacion, segmento: $rootScope.datos.segmento };

    //Inicializar los datos de campaña
    $scope.campana = { numero: '01', fechaMontajePedido: 'Febrero 15' };

})

.controller('PlaylistCtrl', function($scope, $stateParams) {
});
