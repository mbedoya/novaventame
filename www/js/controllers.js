angular.module('starter.controllers', [])

    .controller('AppCtrl', function($scope, $rootScope, $state, $ionicModal, $timeout, $ionicHistory, $location) {
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

// Cerrar Sesión
        $scope.cerrarSesion = function() {
            console.log("closing session");
            $rootScope.myDbUsers.delete();
            $ionicHistory.clearHistory();
            $ionicHistory.nextViewOptions({
                disableBack: true
            });
            //window.location.replace('/#/app/login');
            //$state.go('app.login', {}, {reload: true});
            $location.path( "/app/login" );
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

    .controller('InicializacionCtrl', function($scope, $rootScope, $state, $ionicLoading, $ionicViewService, $http) {

        $scope.loading =  $ionicLoading.show({
            template: 'Inicializando Aplicación...'
        });

        $rootScope.datos = {};
        $rootScope.db = new database_js();
        $rootScope.db.initialize();

        //Verificar si el componente de base de datos está disponible
        if (!$rootScope.db.dbSupport){

            $ionicLoading.hide();
            console.log($rootScope.db.supportError);
            $state.go('app.login');

        }else{

            //Crear objeto de usuarios
            $rootScope.myDbUsers = new db_user_js($rootScope.db);

            console.log("db users");
            console.log($rootScope.myDbUsers);

            //Buscar si hay sesión iniciada
            $rootScope.myDbUsers.getAll(function(tx, rs){

                //Hay registros en la tabla?
                if (rs.rows.length){

                    $ionicLoading.hide();

                    $scope.loading =  $ionicLoading.show({
                        template: 'Iniciando sesión...'
                    });

                    $rootScope.datos.cedula = rs.rows.item(0)['id'];

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

                                $rootScope.campana = {numero: '-', fechaMontajePedido:'-'};

                                $http.get("http://200.47.173.68:9081/AntaresWebServices/interfaceAntares/getRecordatoriosAntares/" + data.getElementsByTagName("codigoZona")[0].textContent).
                                    success(function(data, status, headers, config) {
                                        console.log(data);
                                        $rootScope.campana = {numero: data.listaRecordatorios[0].campagna, fechaMontajePedido:data.listaRecordatorios[0].fecha};
                                    }).
                                    error(function(data, status, headers, config) {
                                        //$rootScope.campana = {numero: '', fechaMontajePedido:''};
                                    });

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

                                $rootScope.myDbUsers.delete();
                                $rootScope.myDbUsers.insert($rootScope.datos.cedula);

                                $ionicViewService.nextViewOptions({
                                    disableBack: true
                                });

                                $rootScope.updateUI = true;
                                $state.go('app.home');

                            }else{


                                console.log(razonRechazo);
                                alert("Usuario no valido");

                                //$.mobile.activePage.find("#mensajeError").html(razonRechazo);
                                //$.mobile.activePage.find("#botonError").trigger("click");
                            }
                        }
                    );


                }else{

                    $ionicLoading.hide();
                    $state.go('app.login');
                }
            });
        }

        //Verificar si se tiene sesion creada o si es posible crearla

        $scope.iniciar = function() {
            $state.go('app.login');
        };
    })

    .controller('BienvenidaCtrl', function($scope, $state) {

        $scope.iniciar = function() {
            $state.go('app.login');
        };
    })

    .controller('LoginCtrl', function($scope, $rootScope, $location, $state, $ionicLoading, $ionicViewService, $http) {

        console.log('LoginCtrl iniciando');

        //Inicializar los datos de inicio
        $scope.datosInicio = { cedula: '' };

        $scope.capturarCedula = function() {
            console.log('Doing login ', $scope.datosInicio);
            $rootScope.datos = $scope.datosInicio;

            if(!$rootScope.datos.cedula){
                alert("Debes ingresar la cédula");
                return;
            }

            if(String($rootScope.datos.cedula).length < 6 || String($rootScope.datos.cedula).length > 10){
                alert("Debes ingresar entre 6 y 10 dígitos");
                return;
            }

            $scope.loading =  $ionicLoading.show({
                template: 'Iniciando sesión...'
            });

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
                    alert("Por favor revisa tu conexión a internet");

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

                        $rootScope.campana = {numero: '-', fechaMontajePedido:'-'};

                        $http.get("http://200.47.173.68:9081/AntaresWebServices/interfaceAntares/getRecordatoriosAntares/" + data.getElementsByTagName("codigoZona")[0].textContent).
                            success(function(data, status, headers, config) {
                                console.log(data);
                                $rootScope.campana = {numero: data.listaRecordatorios[0].campagna, fechaMontajePedido:data.listaRecordatorios[0].fecha};
                            }).
                            error(function(data, status, headers, config) {
                                //$rootScope.campana = {numero: '', fechaMontajePedido:''};
                            });

                        var tipoUsuario = data.getElementsByTagName("tipoUsuarioList")[0].textContent;

                        var rolValido = false;


                        switch(tipoUsuario) {
                            case '1':
                                rolValido = true;
                                break;
                            case '3':
                                rolValido = true;
                                break;
                        }

                        if(rolValido){

                            $rootScope.myDbUsers.delete();
                            $rootScope.myDbUsers.insert($rootScope.datos.cedula);

                            $ionicViewService.nextViewOptions({
                                disableBack: true
                            });

                            $state.go('app.home');

                        }else{
                            alert("Tu rol no es válido para nuestra Aplicación");
                        }

                    }else{

                        razonRechazo = data.getElementsByTagName("razonRechazo")[0].textContent;

                        console.log(razonRechazo);
                        if(razonRechazo == "El usuario no se encuentra registrado en Antares."){
                            alert("Lo sentimos no existe información para la cédula ingresada. Comunícate con tu Mamá Líder o la línea de atención", "Error");
                        }else {
                            alert(razonRechazo);
                        }

                    }
                }
            );


        };

        $scope.$on('$routeChangeSuccess', function () {
            console.log("Route changed");
        });

        $scope.$on('$viewContentLoaded', function readyToTrick() {
            console.log("Login view loaded");
        });
    })

    .controller('RecordarCtrl', function($scope, $rootScope, $location, $state, $ionicLoading, $ionicViewService, $location) {

        //Inicializar los datos de inicio
        $scope.datosInicio = {};

        $scope.capturarRecordar = function() {

            $scope.loading =  $ionicLoading.show({
                template: 'Iniciando sesión...'
            });

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

            console.log("cedula:" + $rootScope.datos.cedula);
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

                        $rootScope.campana.numero = '01';
                        $rootScope.campana.fechaMontajePedido = 'Feb 23';

                        console.log("Nombre:" + $rootScope.datos.nombre);

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

                        $rootScope.myDbUsers.delete();
                        $rootScope.myDbUsers.insert($rootScope.datos.cedula);

                        $ionicViewService.nextViewOptions({
                            disableBack: true
                        });

                        //$location.path( "/app/home" );
                        $rootScope.updateUI = true;
                        $state.go('app.home', {}, {reload:true});
                        /*setTimeout(function(){
                         console.log("about to reload");
                         $state.reload();
                         console.log("reloaded");
                         }, 200);*/

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

    .controller('HomeCtrl', function($state, $scope, $rootScope) {

        console.log("HOME INITIALIZAZING.." + $rootScope.datos.nombre);

        $scope.nombre = function(){
            return $rootScope.datos.nombre;
        }

        $scope.segmento = function(){
            return $rootScope.datos.segmento;
        }

        $scope.saldo = function(){
            return $rootScope.datos.saldo;
        }

        $scope.cupo = function(){
            return $rootScope.datos.cupo;
        }

        $scope.numeroCampana = function(){
            return $rootScope.campana.numero;
        }

        $scope.fechaMontajePedidoCampana = function(){
            return $rootScope.campana.fechaMontajePedido;
        }

        console.log("HomeCtrl iniciando..." + $rootScope.datos.nombre);

        //$scope.init();

        //setInterval($scope.init, 1000);

    })

    .controller('PlaylistCtrl', function($scope, $stateParams) {
    });