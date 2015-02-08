(function (_) {

  angular.module('cooperativa.maestraprestamo', ['ngAnimate'])

    .factory('MaestraPrestamoService', ['$http', '$q', '$filter', function ($http, $q, $filter) {

      // //Guardar Factura
      // function guardarFact(dataH, dataD) {
      //   var deferred = $q.defer();

      //   $http.post('/facturacion/', JSON.stringify({'cabecera': dataH, 'detalle': dataD})).
      //     success(function (data) {
      //       deferred.resolve(data);
      //     }).
      //     error(function (data) {
      //       deferred.resolve(data);
      //     });

      //   return deferred.promise;
      // }

      // //Impresion de Factura (incrementa el campo de IMPRESA)
      // function impresionFact(fact) {
      //   var deferred = $q.defer();

      //   $http.post('/facturacion/print/{factura}/'.replace('{factura}',fact), {'factura': fact}).
      //     success(function (data) {
      //       deferred.resolve(data);
      //     }).
      //     error(function (data) {
      //       deferred.resolve(data);
      //     });
      //   return deferred.promise;
      // }


      // //Guardar Orden de Compra
      // function guardarOrdenSC(Orden) {
      //   var deferred = $q.defer();
      //   $http.post('/ordenSuperCoop/', JSON.stringify({'orden': Orden})).
      //     success(function (data) {
      //       deferred.resolve(data);
      //     }).
      //     error(function (data) {
      //       deferred.resolve(data);
      //     });

      //   return deferred.promise;
      // }

      //Llenar el listado de facturas
      function all() {
        var deferred = $q.defer();

        $http.get('/api/prestamos/maestra/listado/?format=json')
          .success(function (data) {
            deferred.resolve(data);
          });
        return deferred.promise;
      }

      // //Categorias de prestamos, si se pasa el parametro "cp" con valor es filtrada la informacion. 
      // function categoriasPrestamos(cp) {
      //   var deferred = $q.defer();

      //   $http.get('/api/categoriasPrestamos/?format=json')
      //     .success(function (data) {
      //       if (cp != undefined) {
      //         deferred.resolve(data.filter( function(item) {
      //           return item.descripcion == cp;

      //         }));
      //       } else {
      //         deferred.resolve(data);
      //       }
      //     });

      //   return deferred.promise;
      // }

      // //Traer el listado de socios
      // function socios() {
      //   var deferred = $q.defer();

      //   $http.get('/api/socio/?format=json')
      //     .success(function (data) {
      //       deferred.resolve(data.filter( function(socio) {
      //         return socio.estatus == "E" || socio.estatus == "S";

      //       }));
      //     });

      //   return deferred.promise;
      // }


      // //Buscar un documento en especifico (Desglose)
      // function DocumentoById(NoFact) {
      //   var deferred = $q.defer();
      //   var doc = NoFact != undefined? NoFact : 0;

      //   $http.get('/facturajson/?nofact={NoFact}&format=json'.replace('{NoFact}', doc))
      //     .success(function (data) {
      //       deferred.resolve(data);
      //     });

      //   return deferred.promise;
      // }

      //Buscar un numero de prestamo en especifico en listado de prestamos
      function byNoPrestamo(NoPrestamo) {
        var deferred = $q.defer();
        all().then(function (data) {
          var result = data.filter(function (documento) {
            return documento.noPrestamo == NoPrestamo;
          });

          if(result.length > 0) {
            deferred.resolve(result);
          } else {
            deferred.reject();
          }
        });
        return deferred.promise;
      }


      // //Buscar por tipo de posteo
      // function byPosteo(valor){
      //   var deferred = $q.defer();

      //   all().then(function (data) {
      //     var results = data.filter(function (registros) {
      //       return registros.posteo == valor;
      //     });

      //     if(results.length > 0) {
      //       deferred.resolve(results);
      //     } else {
      //       deferred.reject();
      //     }
      //   });

      //   return deferred.promise;
      // }

      return {
        all: all,
        byNoPrestamo: byNoPrestamo
        // byNoFact: byNoFact,
        // socios: socios,
        // guardarFact: guardarFact,
        // DocumentoById: DocumentoById,
        // categoriasPrestamos: categoriasPrestamos,
        // guardarOrdenSC: guardarOrdenSC,
        // impresionFact: impresionFact
      };

    }])


    //****************************************************
    //CONTROLLERS                                        *
    //****************************************************
    .controller('MaestraPrestamosCtrl', ['$scope', '$filter', '$timeout', '$window', 'MaestraPrestamoService', 
                                        function ($scope, $filter, $timeout, $window, MaestraPrestamoService) {
      
      //Inicializacion de variables
      $scope.disabledButton = 'Boton-disabled';
      $scope.disabledButtonBool = true;
      $scope.posteof = '*';
      $scope.errorShow = false;
      $scope.showLP = true;
      $scope.regAll = false;

      $scope.prestamosSeleccionados = [];
      $scope.reg = [];
      $scope.valoresChk = [];

      $scope.fecha = $filter('date')(Date.now(),'dd/MM/yyyy');
      $scope.ArrowLP = 'UpArrow';

      
      // Mostrar/Ocultar panel de Listado de Facturas
      $scope.toggleLP = function() {
        $scope.showLP = !$scope.showLP;

        if($scope.showLP === true) {
          $scope.ArrowLP = 'UpArrow';
        } else {
          $scope.ArrowLP = 'DownArrow';
        }
      }


      //Listado de todos los prestamos
      $scope.listadoPrestamos = function() {
        $scope.NoFoundDoc = '';
        $scope.prestamosSeleccionados = [];
        $scope.valoresChk = [];

        MaestraPrestamoService.all().then(function (data) {
          $scope.prestamos = data;
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

      // //Guardar Factura
      // $scope.guardarFactura = function($event) {
      //   $event.preventDefault();

      //   try {
      //     if (!$scope.FacturaForm.$valid) {
      //       throw "Verifique que todos los campos esten completados correctamente.";
      //     }

      //     var fechaP = $scope.dataH.fecha.split('/');
      //     var fechaFormatted = fechaP[2] + '-' + fechaP[1] + '-' + fechaP[0];

      //     var dataH = new Object();

      //     dataH.factura = $scope.dataH.factura != undefined? $scope.dataH.factura : 0;
      //     dataH.fecha = fechaFormatted;
      //     dataH.terminos = $scope.dataH.terminos;
      //     dataH.vendedor = $scope.dataH.vendedor;
      //     dataH.almacen = $scope.dataH.almacen;
      //     dataH.socio = $scope.socioCodigo != undefined? $scope.socioCodigo : null;
      //     dataH.orden = $scope.orden != undefined? $scope.orden : null;

      //     if ($scope.dataD.length == 0) {
      //       throw "Debe agregar un producto al menos.";
      //     }

      //     FacturacionService.guardarFact(dataH,$scope.dataD).then(function (data) {

      //       if(isNaN(data)) {
      //         $rootScope.mostrarError(data);
      //         throw data;
      //       }

      //       $rootScope.factura = data;
      //       $scope.dataH.factura = $filter('numberFixedLen')(data, 8)

      //       $scope.errorShow = false;
      //       $scope.listadoFacturas();

      //       //SI ES A CREDITO LA FACTURA SE DEBE CREAR UNA ORDEN DE DESPACHO SUPERRCOOP
      //       if($scope.dataH.terminos == "CR") {

      //         $scope.mostrarOrden(true);
      //         $scope.disabledButton = 'Boton-disabled';
      //         $scope.disabledButtonBool = true;

      //         $rootScope.total = $scope.total;
      //         $rootScope.getCategoriaPrestamo($scope.dataH.vendedor);

      //         if ($rootScope.oid > 0) {
      //           $rootScope.guardarOrden($event);
      //         }

      //         } else {              
      //           $scope.nuevaEntrada();
      //           $scope.toggleLF();
      //         }
      //     },
      //     (function () {
      //       $rootScope.mostrarError('Hubo un error. Contacte al administrador del sistema.');
      //     }
      //     ));

      //   }
      //   catch (e) {
      //     $rootScope.mostrarError(e);
      //   }
      // }

      // // Visualizar Documento (Factura Existente - desglose)
      // $scope.FactFullById = function(NoFact, usuario) {
      //   try {

      //     FacturacionService.DocumentoById(NoFact).then(function (data) {

      //       if(data.length > 0) {
      //         //completar los campos
      //         $scope.nuevaEntrada();

      //         $scope.errorMsg = '';
      //         $scope.errorShow = false;

      //         $scope.dataH.factura = $filter('numberFixedLen')(NoFact, 8);
      //         $scope.dataH.fecha = $filter('date')(data[0]['fecha'], 'dd/MM/yyyy');
      //         $scope.socioCodigo = data[0]['socioCodigo'];
      //         $scope.socioNombre = data[0]['socioNombre'];
      //         $scope.dataH.orden = $filter('numberFixedLen')(data[0]['orden'], 8);
      //         $scope.dataH.terminos = data[0]['terminos'];
      //         $scope.dataH.vendedor = data[0]['vendedor'];
      //         $scope.dataH.posteo = data[0]['posteo'];
      //         $scope.dataH.impresa = data[0]['impresa'];

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


      // //Eliminar producto de la lista de entradas
      // $scope.delProducto = function($event, prod) {
      //   $event.preventDefault();
      //   try {
      //     $scope.dataD = _.without($scope.dataD, _.findWhere($scope.dataD, {codigo: prod.codigo}));

      //     $scope.calculaTotales();
          
      //   } catch (e) {
      //     $rootScope.mostrarError(e);
      //   }
      // }

      // //Traer almacenes
      // $scope.getAlmacenes = function() {
      //   InventarioService.almacenes().then(function (data) {
      //     $scope.almacenes = data;
      //   });
      // }

      // //Filtrar las facturas por posteo (SI/NO)
      // $scope.filtrarPosteo = function() {
      //   $scope.facturasSeleccionadas = [];
      //   $scope.valoresChk = [];
      //   $scope.regAll = false;

      //   if($scope.posteof != '*') {
      //     FacturacionService.byPosteo($scope.posteof).then(function (data) {
      //       $scope.facturas = data;

      //       if(data.length > 0){
      //         $scope.verTodos = '';
      //       }
      //   });
      //   } else {
      //     $scope.listadoFacturas();
      //   }        
      // }

       //Buscar un prestamo en especifico
      $scope.filtrarPorNoPrestamo = function(NoPrestamo) {
        try {
          MaestraPrestamoService.byNoPrestamo(NoPrestamo).then(function (data) {
            $scope.prestamos = data;

            if(data.length > 0) {
              $scope.verTodos = '';
              $scope.NoFoundDoc = '';
            }
          }, 
            (function () {
              $scope.NoFoundDoc = 'No se encontró el prestamo #' + NoPrestamo;
            }
          ));          
        } catch (e) {
          console.log(e);
        }
      }

      //Buscar Documento por ENTER
      $scope.buscarPrestamo = function($event, NoPrestamo) {
        if($event.keyCode == 13) {
          $scope.filtrarPorNoPrestamo(NoPrestamo);
        }
      }

      // // Mostrar/Ocultar error
      // $scope.toggleError = function() {
      //   $scope.errorShow = !$scope.errorShow;
      // }

      // // Funcion para mostrar error por pantalla
      // $rootScope.mostrarError = function(error) {
      //   $scope.errorMsg = error;
      //   $scope.errorShow = true;

      //   // $timeout($scope.toggleError(), 3000);
        
      // }

      // //Cuando se le de click al checkbox del header.
      // $scope.seleccionAll = function() {

      //   $scope.facturas.forEach(function (data) {
      //     if (data.posteo == 'N') {
      //       if ($scope.regAll === true){

      //         $scope.valoresChk[data.id] = true;
      //         $scope.facturasSeleccionadas.push(data);
      //       }
      //       else{

      //         $scope.valoresChk[data.id] = false;
      //         $scope.facturasSeleccionadas.splice(data);
      //       }
      //     }

      //   });
      // }

      
      // //Cuando se le de click a un checkbox de la lista
      // $scope.selectedReg = function(iReg) {
        
      //   index = $scope.facturas.indexOf(iReg);

      //   if ($scope.reg[$scope.facturas[index].id] === true){
      //     $scope.facturasSeleccionadas.push($scope.facturas[index]);
      //   }
      //   else{

      //     $scope.facturasSeleccionadas.splice($scope.facturasSeleccionadas[index],1);
      //   }
      // }

      // //Nueva Entrada de Factura
      // $scope.nuevaEntrada = function(usuario) {
      //   $scope.producto = '';
      //   $scope.almacen = '';
      //   $scope.subtotal = '';
      //   $scope.descuento = '';
      //   $scope.total = '';

      //   $scope.socioCodigo = '';
      //   $scope.socioNombre = '';
        
      //   $scope.dataH = {};
      //   $scope.dataD = [];
      //   $scope.productos = [];

      //   $rootScope.mostrarOrden(false);
      //   $scope.showLF = false;
      //   $scope.ArrowLF = 'DownArrow';
      //   $scope.BotonOrden = '';
      //   $scope.dataH.fecha = $filter('date')(Date.now(),'dd/MM/yyyy');
      //   $scope.dataH.vendedor = usuario;
      //   $scope.dataH.terminos = 'CO';
      //   $scope.dataH.posteo = 'N';

      //   $scope.disabledButton = 'Boton';
      //   $scope.disabledButtonBool = false;

      //   $rootScope.clearOrden();
      // }


      // //Traer productos
      // $scope.getProducto = function($event) {
      //   $event.preventDefault();

      //   $scope.tableProducto = true;

      //   if($scope.producto != undefined) {
      //     InventarioService.productos().then(function (data) {
      //       $scope.productos = data.filter(function (registro) {
      //         return $filter('lowercase')(registro.descripcion
      //                             .substring(0,$scope.producto.length)) == $filter('lowercase')($scope.producto);
      //       });

      //       if($scope.productos.length > 0){
      //         $scope.tableProducto = true;
      //         $scope.productoNoExiste = '';
      //       } else {
      //         $scope.tableProducto = false;
      //         $scope.productoNoExiste = 'No existe el producto'
      //       }

      //     });
      //   } else {
      //     InventarioService.productos().then(function (data) {
      //       $scope.productos = data;
      //     });
      //   }
      // }

      // //Traer Socios
      // $scope.getSocio = function($event) {
      //   $event.preventDefault();

      //   $scope.tableSocio = true;

      //   if($scope.socioNombre != undefined) {
      //     FacturacionService.socios().then(function (data) {
      //       $scope.socios = data.filter(function (registro) {
      //         return $filter('lowercase')(registro.nombreCompleto
      //                             .substring(0,$scope.socioNombre.length)) == $filter('lowercase')($scope.socioNombre);
      //       });

      //       if($scope.socios.length > 0){
      //         $scope.tableSocio = true;
      //         $scope.socioNoExiste = '';
      //       } else {
      //         $scope.tableSocio = false;
      //         $scope.socioNoExiste = 'No existe el socio';
      //       }

      //     });
      //   } else {
      //     FacturacionService.socios().then(function (data) {
      //       $scope.socios = data;
      //       $scope.socioCodigo = '';
      //     });
      //   }
      // }

      // //Agregar Producto
      // $scope.addProducto = function($event, Prod) {
      //   $event.preventDefault();
      //   $scope.errorShow = false;

      //   try {

      //     //Debe seleccionar un almacen.
      //     if ($scope.dataH.almacen == undefined || $scope.dataH.almacen == '') {
      //       $scope.mostrarError('Debe seleccionar un almacen');
      //       throw "Debe seleccionar un almacen";
      //     }

      //     //No agregar el producto si ya existe
      //     $scope.dataD.forEach(function (item) {
      //       if(item.codigo == Prod.codigo) {
      //         $scope.mostrarError("No puede agregar mas de una vez el producto : " + item.descripcion);
      //         throw "No puede agregar mas de una vez el producto : " + item.descripcion;
      //       }
      //     });


      //     var existencia = 0;

      //     InventarioService.getExistenciaByProducto(Prod.codigo, $scope.dataH.almacen).then(function (data) {

      //       if(data.length > 0) {
      //         existencia = data[0]['cantidad'];

      //         //Si en algun momento existe un producto con disponibilidad en negativo no puede permitir agregarlo.
      //         if(existencia <= 0) {
      //           $scope.mostrarError('No hay disponibilidad para el producto : ' + Prod.descripcion);
      //           throw 'No hay disponibilidad para el producto : ' + Prod.descripcion;
      //         }

      //         if(existencia < 11 && existencia > 0) {
      //           $scope.mostrarError('El producto ' + Prod.descripcion + ' tiene una existencia de ' + data[0]['cantidad']);
      //         }

      //         Prod.descuento = 0;
      //         Prod.cantidad = 1;
      //         Prod.existencia = existencia;

      //         $scope.dataD.push(Prod);
      //         $scope.tableProducto = false;

      //         $scope.calculaTotales();

      //       } else {
      //         $scope.mostrarError('Este producto (' + Prod.descripcion + ') no tiene existencia.');
      //         throw 'Este producto (' + Prod.descripcion + ') no tiene existencia.';
      //       }
      //     });
      //   } catch(e) {
      //     $scope.mostrarError(e);
      //   }

      // }

      // //Seleccionar Socio
      // $scope.selSocio = function($event, s) {
      //   $event.preventDefault();

      //   $scope.socioNombre = s.nombreCompleto;
      //   $scope.socioCodigo = s.codigo;
      //   $scope.tableSocio = false;
      // }

      // // Calcula los totales para los productos
      // $scope.calculaTotales = function() {
      //   try {          
      //     var total = 0.0;
      //     var subtotal = 0.0;
      //     var total_descuento = 0.0;
      //     var descuento = 0.0;

      //     if($scope.existError == true) {
      //       $scope.errorShow = false;
      //       $scope.existError = false;
      //     } 

      //     $scope.dataD.forEach(function (item) {
      //       if (item.descuento != undefined && item.descuento > 0) {
      //         descuento = parseFloat(item.descuento/100);
      //         descuento = (item.precio * descuento * item.cantidad);
      //       }

      //       //Verificar si la cantidad no excede la existencia disponible
      //       if(parseFloat(item.cantidad) > parseFloat(item.existencia)) {
      //         $scope.existError = true;
      //         $scope.mostrarError('No puede digitar una cantidad mayor a la disponibilidad : ' + item.existencia);
      //         throw 'No puede digitar una cantidad mayor a la disponibilidad : ' + item.existencia;
      //       } 

      //       subtotal += (item.cantidad * item.precio);
      //       total = subtotal - descuento;
      //       total_descuento += descuento;

      //     });

      //     $scope.subtotal = $filter('number')(subtotal, 2);
      //     $scope.total = $filter('number')(total, 2);
      //     $scope.descuento = $filter('number')(total_descuento, 2);

      //   } catch (e) {
      //     $rootScope.mostrarError(e);
      //   }  
      // }

      //   //Imprimir factura
      // $scope.ImprimirFactura = function(factura) {
      //   $window.sessionStorage['factura'] = JSON.stringify(factura);
      //   $window.open('/facturacion/print/{factura}'.replace('{factura}',factura.noFactura), target='_blank'); 
      // }

    }])

  //****************************************************
  //CONTROLLERS PRINT DOCUMENT                         *
  //****************************************************
  .controller('ImprimirFacturaCtrl', ['$scope', '$filter', '$window', 'FacturacionService', function ($scope, $filter, $window, FacturacionService) {
    $scope.factura = JSON.parse($window.sessionStorage['factura']);
    $scope.dataH = {};
    $scope.dataD = [];

    FacturacionService.DocumentoById($scope.factura.noFactura).then(function (data) {

      if(data.length > 0) {
        $scope.dataH.factura = $filter('numberFixedLen')($scope.factura.noFactura, 8);
        $scope.dataH.fecha = $filter('date')(data[0]['fecha'], 'dd/MM/yyyy');
        $scope.socioCodigo = data[0]['socioCodigo'];
        $scope.socioNombre = data[0]['socioNombre'];
        $scope.dataH.orden = $filter('numberFixedLen')(data[0]['orden'], 8);
        $scope.dataH.terminos = data[0]['terminos'].replace('CR', 'CREDITO').replace('CO', 'DE CONTADO');
        $scope.dataH.vendedor = data[0]['vendedor'];
      //   $scope.dataH.posteo = data[0]['posteo'];
        $scope.dataH.impresa = data[0]['impresa'];

        data[0]['productos'].forEach(function (item) {
          item.subtotal = parseFloat(item.descuento) > 0? (item.precio * item.cantidad) - ((item.descuento / 100) * item.cantidad * item.precio) : (item.precio * item.cantidad);
          $scope.dataD.push(item);
          // $scope.dataH.almacen = item['almacen'];
        });

        $scope.totalDescuento_ = $scope.totalDescuento();
        $scope.totalValor_ = $scope.totalValor();
      }
    });

    $scope.imprimirFactura = function() {
      console.log('ENTRO');
      // FacturacionService.impresionFact($scope.factura.noFactura).then(function (data) {
      //   console.log(data);
      // });
      // var doc = jsPDF();
      // doc.text(20,20, 'HOLA MUDO');
      // doc.save('pruebaPDF.pdf');
      // console.log(doc);
      $scope.displayClass = 'displayNone';
      console.log($scope.displayClass);
      
      window.print();
      console.log($scope.displayClass);
    }

    $scope.totalValor = function() {
      var total = 0.0;
      var descuento = 0;

      $scope.dataD.forEach(function (item) {
        if(parseFloat(item.descuento) > 0) {
          descuento = (parseFloat(item.descuento)/100);
          descuento = (parseFloat(item.precio) * parseFloat(descuento) * parseFloat(item.cantidad));
        } else {
          descuento = 0;
        }
        total += (parseFloat(item.precio) * parseFloat(item.cantidad)) - descuento;
      });

      return total;
    }

    $scope.totalDescuento = function() {
      var total = 0.0;
      var descuento = 0.0;

      $scope.dataD.forEach(function (item) {
        if(parseFloat(item.descuento) > 0) {
          descuento = (parseFloat(item.descuento)/100);
          descuento = (parseFloat(item.precio) * parseFloat(descuento) * parseFloat(item.cantidad));
        } else {
          descuento = 0;
        }
        total += descuento;
      });

      return total;
    }

    $scope.hora = function() {
      return Date.now();
    }

  }]);
   

})(_);