from django.shortcuts import render

from rest_framework import viewsets, serializers

from .serializers import ProductoSerializer, SuplidorTipoSerializer, SuplidorSerializer, \
						SocioSerializer, DepartamentoSerializer

from .models import Producto, Suplidor, TipoSuplidor, Socio, Departamento


class ProductoViewSet(viewsets.ModelViewSet):
	queryset=Producto.objects.all()
	serializer_class=ProductoSerializer


class SuplidorTipoViewSet(viewsets.ModelViewSet):
	queryset=TipoSuplidor.objects.all()
	serializer_class=SuplidorTipoSerializer


class SuplidorViewSet(viewsets.ModelViewSet):
	queryset=Suplidor.objects.all()
	serializer_class=SuplidorSerializer


class SocioViewSet(viewsets.ModelViewSet):
	queryset=Socio.objects.all()
	serializer_class=SocioSerializer


class DepartamentoViewSet(viewsets.ModelViewSet):
	queryset=Departamento.objects.all()
	serializer_class=DepartamentoSerializer

class DepartamentoViewSet(viewsets.ModelViewSet):
	queryset=Departamento.objects.all()
	serializer_class=DepartamentoSerializer

