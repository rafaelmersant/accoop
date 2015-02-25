# VIEWS de Maestra de Prestamos
from django.contrib.auth.models import User
from django.contrib.auth.decorators import login_required
from django.shortcuts import render
from django.views.generic import TemplateView, DetailView, View
from django.http import HttpResponse, JsonResponse

from rest_framework import serializers, viewsets
from rest_framework.views import APIView
from rest_framework.response import Response

from .serializers import MaestraPrestamosListadoSerializer

from .models import MaestraPrestamo
from administracion.models import CategoriaPrestamo, Cobrador, Representante, Socio, Autorizador

from acgm.views import LoginRequiredMixin

import json
import math
import decimal
import datetime


#Vista para Maestra de Prestamos
class MaestraPrestamosView(TemplateView):

	template_name = 'maestraprestamos.html'


# Listado de Prestamos en Maestra
class MaestraPrestamosAPIView(APIView):

	serializer_class = MaestraPrestamosListadoSerializer

	def get(self, request, prestamo=None):
		if prestamo != None:
			prestamos = MaestraPrestamo.objects.filter(noPrestamo=prestamo)
		else:
			prestamos = MaestraPrestamo.objects.all().order_by('-noPrestamo')

		response = self.serializer_class(prestamos, many=True)
		return Response(response.data)


# Desglose de Prestamo Aprobado
class PrestamoById(LoginRequiredMixin, DetailView):

	queryset = MaestraPrestamo.objects.all()

	def get(self, request, *args, **kwargs):
		noPrestamo = self.request.GET.get('noprestamo')

		self.object_list = self.get_queryset().filter(noPrestamo=noPrestamo)

		format = self.request.GET.get('format')
		if format == 'json':
			return self.json_to_response()

		context = self.get_context_data()
		return self.render_to_response(context)

	def json_to_response(self):
		data = list()

		for prestamo in self.object_list:
			data.append({
				'noPrestamo': prestamo.noPrestamo,
				'noSolicitudPrestamo': prestamo.noSolicitudPrestamo.noSolicitud if prestamo.noSolicitudPrestamo != None else '',
				'noSolicitudOD': prestamo.noSolicitudOD.noSolicitud if prestamo.noSolicitudOD != None else '',
				'factura': prestamo.factura.noFactura if prestamo.factura != None else '',
				'categoriaPrestamoId': prestamo.categoriaPrestamo.id,
				'categoriaPrestamoDescrp': prestamo.categoriaPrestamo.descripcion,
				'socioCodigo': prestamo.socio.codigo,
				'socioNombre': prestamo.socio.nombreCompleto,
				'socioCedula': prestamo.socio.cedula,
				'representanteCodigo': prestamo.representante.id,
				'representanteNombre': prestamo.representante.nombre,
				'oficial': prestamo.oficial.username,
				'localidad': prestamo.localidad.descripcion,
				'montoInicial': prestamo.montoInicial,
				'tasaInteresAnual': prestamo.tasaInteresAnual,
				'tasaInteresMensual': prestamo.tasaInteresMensual,
				'pagoPrestamoAnterior': prestamo.pagoPrestamoAnterior,
				'cantidadCuotas': prestamo.cantidadCuotas,
				'montoCuotaQ1': prestamo.montoCuotaQ1,
				'montoCuotaQ2': prestamo.montoCuotaQ2,
				'fechaDesembolso': prestamo.fechaDesembolso,
				'fechaEntrega': prestamo.fechaEntrega,
				'chequeNo': prestamo.chequeNo.chequeNo if prestamo.chequeNo != None else '',
				'valorGarantizado': prestamo.valorGarantizado,
				'balance': prestamo.balance,
				'estatus': prestamo.estatus,
				'posteadoFecha': prestamo.posteadoFecha,
				})

		return JsonResponse(data, safe=False)
