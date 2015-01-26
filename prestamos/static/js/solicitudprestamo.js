(function (_) {

  angular.module('cooperativa.solicitudprestamo', ['ngAnimate'])

    .factory('SolicitudPrestamoService', ['$http', '$q', '$filter', function ($http, $q, $filter) {

      //Guardar Solicitud de Prestamo
      function guardaSolicitudPrestamo(solicitante, solicitud, fechaSolicitud, fechaDescuento) {
        var deferred = $q.defer();

        $http.post('/prestamos/solicitudP/', JSON.stringify({'solicitante': solicitante, 
                                                              'solicitud': solicitud, 
                                                              'fechaSolicitud': fechaSolicitud,
                                                              'fechaDescuento': fechaDescuento})).
          success(function (data) {
            deferred.resolve(data);
          }).
          error(function (data) {
            deferred.resolve(data);
          });

        return deferred.promise;
      }

      //Llenar el listado de Solicitudes
      function solicitudesprestamos(noSolicitud) {
        var deferred = $q.defer();
        var url = "/api/prestamos/solicitudes/prestamos/?format=json";

        if (noSolicitud != undefined) {
            url = "/api/prestamos/solicitudes/prestamos/noSolicitud/?format=json".replace('noSolicitud', noSolicitud);
        }

        $http.get(url)
          .success(function (data) {
            deferred.resolve(data);
          });

        return deferred.promise;
      }

      //Filtrar el listado de Solicitudes por Socio
      function solicitudesprestamosBySocio(dato) {
        var deferred = $q.defer();
        var url = "";

        if(!isNaN(dato)) {
          url = "/api/prestamos/solicitudes/prestamos/codigo/dato/?format=json".replace("dato", dato);
        } else {
          url = "/api/prestamos/solicitudes/prestamos/nombre/dato/?format=json".replace("dato", dato);
        }

        $http.get(url)
          .success(function (data) {
            deferred.resolve(data);
          });

        return deferred.promise;
      }

      //Filtrar el listado de Solicitudes por estatus
      function solicitudesprestamosByEstatus(estatus) {
        var deferred = $q.defer();

        solicitudesprestamos(undefined).then(function (data) {
          var results = data.filter(function (registros) {
            if(estatus == 'T') {
              return registros;
            } else {
              return registros.estatus == estatus;
            }
          });
          
          if(results.length > 0) {
            deferred.resolve(results);
          } else {
            deferred.reject();
          }

        });

        return deferred.promise;
      }

      //Socio por Codigo de Empleado
      function SocioByCodigoEmpleado(codigo) {
        var deferred = $q.defer();

        if(codigo != undefined) {
          url = '/api/socio/idempleado/codigo/?format=json'.replace('codigo', codigo);
        } else {
          url = '/api/socio/idempleado/?format=json'
        }

        http.get(url)
          .success(function (data) {
            deferred.resolve(data);
          });

        return deferred.promise;
      }

      //Categorias de prestamos.
      function categoriasPrestamos(id) {
        var deferred = $q.defer();

        $http.get('/api/categoriasPrestamos/?format=json')
          .success(function (data) {
            if (id != undefined) {
              deferred.resolve(data.filter(function (item) {
                return item.id == id;

              }));
            } else {
              deferred.resolve(data.filter(function (registros) {
                return registros.tipo == 'PR';
              }));
            }
          });

        return deferred.promise;
      }

      //Cantidad de Cuotas de Prestamo (parametro: monto)
      function cantidadCuotasPrestamoByMonto(monto) {
        var deferred = $q.defer();
        var url = "/api/cantidadCuotasPrestamos/monto/?format=json".replace("monto", monto.toString().replace(',',''));

        $http.get(url)
          .success(function (data) {
            deferred.resolve(data);
          });

        return deferred.promise;
      }

      //Buscar una solicitud en especifico (Desglose)
      function SolicitudPById(NoSolicitud) {
        var deferred = $q.defer();
        var doc = NoSolicitud != undefined? NoSolicitud : 0;

        $http.get('/solicitudPjson/?nosolicitud={solicitud}&format=json'.replace('{solicitud}', doc))
          .success(function (data) {
            deferred.resolve(data);
          });

        return deferred.promise;
      }


      return {
        solicitudesprestamos: solicitudesprestamos,
        solicitudesprestamosBySocio: solicitudesprestamosBySocio,
        solicitudesprestamosByEstatus: solicitudesprestamosByEstatus,
        SocioByCodigoEmpleado: SocioByCodigoEmpleado,
        categoriasPrestamos: categoriasPrestamos,
        cantidadCuotasPrestamoByMonto: cantidadCuotasPrestamoByMonto,
        guardaSolicitudPrestamo: guardaSolicitudPrestamo
      };

    }])


    //****************************************************
    //CONTROLLERS                                        *
    //****************************************************
    .controller('SolicitudPrestamoCtrl', ['$scope', '$filter', 'SolicitudPrestamoService', 'FacturacionService',
                                        function ($scope, $filter, SolicitudPrestamoService, FacturacionService) {
      
      //Inicializacion de variables
      $scope.showCP = false; //Mostrar tabla que contiene las categorias de prestamos
      $scope.tableSocio = false; //Mostrar tabla que contiene los socios
      $scope.showLSP = true; //Mostrar el listado de solicitudes

      $scope.regAll = false;
      $scope.estatus = 'T';

      $scope.item = {};
      $scope.solicitudes = {};

      $scope.solicitudesSeleccionadas = [];
      $scope.reg = [];
      $scope.valoresChk = [];

      $scope.fecha = $filter('date')(Date.now(),'dd/MM/yyyy');
      $scope.ArrowLD = 'UpArrow';

      
      // Mostrar/Ocultar panel de Listado de Desembolsos
      $scope.toggleLSP = function() {
        $scope.showLSP = !$scope.showLSP;

        if($scope.showLSP === true) {
          $scope.ArrowLSP = 'UpArrow';
        } else {
          $scope.ArrowLSP = 'DownArrow';
        }
      }

      // Mostrar/Ocultar error
      $scope.toggleError = function() {
        $scope.errorShow = !$scope.errorShow;
      }


      //Listado de todas las solicitudes de prestamos
      $scope.listadoSolicitudes = function(noSolicitud) {
        $scope.solicitudesSeleccionadas = [];
        $scope.valoresChk = [];
        $scope.estatus = 'T';

        SolicitudPrestamoService.solicitudesprestamos(noSolicitud).then(function (data) {
          $scope.solicitudes = data;
          $scope.regAll = false;


          if(data.length > 0) {
            $scope.verTodos = 'ver-todos-ei';

            var i = 0;
            data.forEach(function (data) {
              $scope.valoresChk[i] = false;
              i++;
            });
          }
        });
      }

      $scope.solicitudesprestamosBySocio = function($event, socio) {

        if($event.keyCode == 13) {

          SolicitudPrestamoService.solicitudesprestamosBySocio(socio).then(function (data) {

            if(data.length > 0) {
              $scope.solicitudes = data;
              $scope.verTodos = '';
              $scope.NoFoundDoc = '';
            } else {
              $scope.NoFoundDoc = 'No se encontró el socio : ' + socio;
            }

          },
            function() {
              $scope.NoFoundDoc = 'No se encontró el socio : ' + socio;

            }
          );
        }
      }

      $scope.solicitudesprestamosEstatus = function(estatus) {

        try {
          SolicitudPrestamoService.solicitudesprestamosByEstatus(estatus).then(function (data) {

            if(data.length > 0) {
              $scope.solicitudes = data;

              $scope.verTodos = '';
              $scope.NoFoundDoc = '';
            } else {
              throw "No existen solicitudes con el estatus : " + estatus;
            }
          },
            function() {
              $scope.NoFoundDoc = "No existen solicitudes con el estatus : " + estatus;
            }
          );
        } catch (e) {
          $scope.mostrarError(e);
        }
      }

      //Traer todas las categorias de prestamos (de tipo PRESTAMO)
      $scope.categoriasPrestamos = function(id) {
        try {
          SolicitudPrestamoService.categoriasPrestamos(id).then(function (data) {
            if(data.length > 0) {
              $scope.categoriasP = data;
            }
          });
        } catch (e) {
          $scope.mostrarError(e);
        }
      }

      //Cantidad de cuotas (parametro: monto)
      $scope.getCantidadCuotasPrestamo = function(monto) {
        try {
          SolicitudPrestamoService.cantidadCuotasPrestamoByMonto(monto).then(function (data) {
            if(data.length > 0) {
              $scope.solicitud.cantidadCuotas = data[0].cantidadQuincenas;
              $scope.solicitud.valorCuotas = $filter('number')(monto / data[0].cantidadQuincenas,2);
            }
          },
          function() {
            $scope.mostrarError("No existe un rango para el monto neto a desembolsar.");
            throw "No existe un rango para el monto neto a desembolsar."
          });
        } catch (e) {
          $scope.mostrarError(e);
        }
      }

      //Monto Neto a Desembolsar
      $scope.montoNeto = function() {
        var montoSolicitado = $scope.solicitud.montoSolicitado != undefined && $scope.solicitud.montoSolicitado != ''? parseFloat($scope.solicitud.montoSolicitado.replace(',','')) : 0;
        var ahorros = $scope.solicitud.ahorrosCapitalizados != undefined && $scope.solicitud.ahorrosCapitalizados != ''? $scope.solicitud.ahorrosCapitalizados : 0;
        var deudas = $scope.solicitud.deudasPrestamos != undefined && $scope.solicitud.deudasPrestamos != ''? $scope.solicitud.deudasPrestamos : 0;
        var garantizado = $scope.solicitud.valorGarantizado != undefined && $scope.solicitud.valorGarantizado != ''? parseFloat($scope.solicitud.valorGarantizado.replace(',','')) : 0;
        var prestaciones = $scope.solicitud.prestacionesLaborales != undefined && $scope.solicitud.prestacionesLaborales != ''? parseFloat($scope.solicitud.prestacionesLaborales.replace(',','')) : 0;

        var disponible = ahorros + garantizado + prestaciones - deudas;
        $scope.solicitud.montoDisponible = $filter('number')(disponible,2);

console.log(disponible);

        if(montoSolicitado > disponible) {
          $scope.solicitud.netoDesembolsar = '';
          $scope.mostrarError("El monto solicitado no puede ser mayor a lo que tiene disponible.");
          throw "no disponible";
        } else {
          $scope.solicitud.netoDesembolsar = $filter('number')(montoSolicitado, 2);
          $scope.getCantidadCuotasPrestamo($scope.solicitud.netoDesembolsar);

          $scope.errorShow = false;
        }

      }

      //Traer Socios
      $scope.getSocio = function($event) {
        $event.preventDefault();

        $scope.tableSocio = true;

        if($scope.solicitante.codigoEmpleado != undefined) {
          FacturacionService.socios().then(function (data) {
            $scope.socios = data.filter(function (registro) {
              return registro.codigo.toString().substring(0, $scope.solicitante.codigoEmpleado.length) == $scope.solicitante.codigoEmpleado;
            });

            if($scope.socios.length > 0){
              $scope.tableSocio = true;
              $scope.socioNoExiste = '';
            } else {
              $scope.tableSocio = false;
              $scope.socioNoExiste = 'No existe el socio';
            }

          });
        } else {
          FacturacionService.socios().then(function (data) {
            $scope.socios = data;
            $scope.socioCodigo = '';
          });
        }
      }

       //Seleccionar Socio
      $scope.selSocio = function($event, s) {
        $event.preventDefault();

        $scope.solicitante.codigoEmpleado = s.codigo;
        $scope.solicitante.nombreEmpleado = s.nombreCompleto;
        $scope.solicitante.cedula = s.cedula;
        $scope.solicitante.salario = $filter('number')(s.salario,2);
        $scope.tableSocio = false;
      }

      //Seleccionar Socio
      $scope.selCP = function($event, cp) {
        $event.preventDefault();

        $scope.solicitud.categoriaPrestamoId = cp.id;
        $scope.solicitud.categoriaPrestamo = cp.descripcion;
        $scope.solicitud.tasaInteresAnual = cp.interesAnualSocio;
        $scope.solicitud.tasaInteresMensual = cp.interesAnualSocio / 12;
        $scope.showCP = false;
      }

      //Cuando se le de click al checkbox del header.
      $scope.seleccionAll = function() {

        $scope.solicitudes.forEach(function (data) {
          if (data.estatus != 'A' && data.estatus != 'R' && data.estatus != 'C') {
            if ($scope.regAll === true){

              $scope.valoresChk[data.id] = true;
              $scope.solicitudesSeleccionadas.push(data);
            }
            else{

              $scope.valoresChk[data.id] = false;
              $scope.solicitudesSeleccionadas.splice(data);
            }
          }
        });
      }

      //Cuando se le de click a un checkbox de la lista
      $scope.selectedReg = function(iReg) {
        
        index = $scope.solicitudes.indexOf(iReg);

        if ($scope.reg[$scope.solicitudes[index].id] === true){
          $scope.solicitudesSeleccionadas.push($scope.solicitudes[index]);
        }
        else{

          $scope.solicitudesSeleccionadas.splice($scope.solicitudesSeleccionadas[index],1);
        }
      }

      // $scope.formatoNumber = function($event) {
      //   // $event.preventDefault();

      //   $scope.solicitud.montoSolicitado += $filter('number')($scope.solicitud.montoSolicitado,2).toString();
      // }

      //Nueva Entrada de Factura
      $scope.nuevaEntrada = function(usuario) {
        $scope.solicitante = {};
        $scope.solicitud = {};

        $scope.solicitante.representanteCodigo = 16; //CAMBIAR ESTO
        $scope.solicitante.representanteNombre = 'EMPRESA'; //CAMBIAR ESTO
        $scope.solicitante.auxiliar = usuario;
        $scope.solicitante.cobrador = usuario;
        $scope.solicitante.autorizadoPor = usuario;

        $scope.solicitud.solicitudNo = 0;
        $scope.solicitud.valorGarantizado = '';
        $scope.solicitud.prestacionesLaborales = '';
        $scope.solicitud.nota = '';
        $scope.solicitud.deudasPrestamos = '';
        $scope.solicitud.fechaAprobacion = '';
        $scope.solicitud.fechaRechazo = '';
        $scope.solicitud.prestamo = '';

        $scope.solicitud.fechaSolicitud = $filter('date')(Date.now(),'dd/MM/yyyy');
        $scope.solicitud.ahorrosCapitalizados = 500;
        $scope.solicitud.deudasPrestamos = 100;

        $scope.showLSP = false;
        $scope.ArrowLSP = 'DownArrow';

        $scope.disabledButton = 'Boton';
        $scope.disabledButtonBool = false;
      }

      // Funcion para mostrar error por pantalla
      $scope.mostrarError = function(error) {
        $scope.errorMsg = error;
        $scope.errorShow = true;
      }


      //Guardar Factura
      $scope.guardarSolicitud = function($event) {
        $event.preventDefault();

        try {
          if (!$scope.SolicitudForm.$valid) {
            throw "Verifique que todos los campos esten completados correctamente.";
          }

          var fechaS = $scope.solicitud.fechaSolicitud.split('/');
          var fechaSolicitudFormatted = fechaS[2] + '-' + fechaS[1] + '-' + fechaS[0];

          var fechaP = $scope.solicitud.fechaDescuento.split('/');
          var fechaDescuentoFormatted = fechaP[2] + '-' + fechaP[1] + '-' + fechaP[0];

          SolicitudPrestamoService.guardaSolicitudPrestamo($scope.solicitante,$scope.solicitud, fechaSolicitudFormatted, fechaDescuentoFormatted).then(function (data) {
            if(isNaN(parseInt(data))) {
              $scope.mostrarError(data);
              throw data;
            }
            $scope.solicitud.solicitudNo = $filter('numberFixedLen')(data, 8)

            $scope.errorShow = false;
            $scope.listadoSolicitudes();
          },
          (function () {
            $scope.mostrarError('Hubo un error. Contacte al administrador del sistema.');
          }
          ));

        }
        catch (e) {
          $scope.mostrarError(e);
        }
      }

      // // Visualizar Documento (Factura Existente - desglose)
      // $scope.FactFullById = function(NoFact, usuario) {
      //   try {
      //     FacturacionService.DocumentoById(NoFact).then(function (data) {

      //       if(data.length > 0) {
      //         $scope.errorMsg = '';
      //         $scope.errorShow = false;

      //         //completar los campos
      //         $scope.nuevaEntrada();

      //         $scope.dataH.factura = $filter('numberFixedLen')(NoFact, 8);
      //         $scope.dataH.fecha = $filter('date')(data[0]['fecha'], 'dd/MM/yyyy');
      //         $scope.socioCodigo = data[0]['socioCodigo'];
      //         $scope.socioNombre = data[0]['socioNombre'];
      //         $scope.dataH.orden = $filter('numberFixedLen')(data[0]['orden'], 8);
      //         $scope.dataH.terminos = data[0]['terminos'];
      //         $scope.dataH.vendedor = data[0]['vendedor'];
      //         $scope.dataH.posteo = data[0]['posteo'];

      //         data[0]['productos'].forEach(function (item) {
      //           $scope.dataD.push(item);
      //           $scope.dataH.almacen = item['almacen'];
      //         })
      //         $scope.calculaTotales();

      //         if(data[0]['orden'] > 0) {
      //           $rootScope.clearOrden();
      //           $rootScope.FullOrden(data[0]['ordenDetalle']);
      //         }
      //       }

      //     }, 
      //       (function () {
      //         $rootScope.mostrarError('No pudo encontrar el desglose del documento #' + NoFact);
      //       }
      //     ));
      //   }
      //   catch (e) {
      //     $rootScope.mostrarError(e);
      //   }

      //   $scope.toggleLF();
      // }

    }]);

})(_);