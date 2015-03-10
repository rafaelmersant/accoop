from django.contrib import admin

from .models import MaestraAhorro, AhorroSocio, InteresesAhorro, RetiroAhorro


@admin.register(MaestraAhorro)
class MaestraAhorroAdmin(admin.ModelAdmin):
    list_display = ['id', 'fecha', 'ahorro', 'retiro', 'monto', 'interes', 'balance', 'estatus']


@admin.register(AhorroSocio)
class AhorroAdmin(admin.ModelAdmin):
    list_display = ['id', 'socio', 'balance', 'disponible']


@admin.register(InteresesAhorro)
class InteresAdmin(admin.ModelAdmin):
    list_display = ['id', 'descripcion', 'porcentaje']


@admin.register(RetiroAhorro)
class RetiroAdmin(admin.ModelAdmin):
    list_display = ['id', 'socio', 'ahorro', 'tipoRetiro', 'monto' ]