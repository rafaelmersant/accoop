from django.contrib import admin

from .models import Almacen, InventarioH, InventarioD, Movimiento, Existencia, AjusteInventarioH, AjusteInventarioD


@admin.register(InventarioH)
class InventarioHAdmin(admin.ModelAdmin):
	list_display = ['id','fecha','suplidor','orden','factura','diasPlazo','ncf','posteo','nota','descripcionSalida','totalGeneral']
	# readonly_fields = ('total',)

@admin.register(InventarioD)
class InventarioDAdmin(admin.ModelAdmin):
	list_display = ['id','inventario','producto','almacen','cantidadTeorico','cantidadFisico','costo','tipoAccion']

@admin.register(Existencia)
class ExistenciaAdmin(admin.ModelAdmin):
	list_display = ['producto', 'cantidad', 'cantidadAnterior', 'almacen', 'fecha']
	search_fields = ('producto', 'almacen')

@admin.register(Almacen)
class AlmacenAdmin(admin.ModelAdmin):
	list_display = ['id', 'descripcion']

@admin.register(AjusteInventarioH)
class AjusteInventarioHAdmin(admin.ModelAdmin):
	list_display = ('id','fecha', 'notaAjuste')

@admin.register(AjusteInventarioD)
class AjusteInventarioDAdmin(admin.ModelAdmin):
	list_display = ('ajusteInvH', 'producto', 'almacen', 'cantidadFisico', 'cantidadTeorico')
	
admin.site.register(Movimiento)

