# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
from django.conf import settings


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('administracion', '0003_auto_20150129_2057'),
        ('facturacion', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Cheque',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('chequeNo', models.IntegerField()),
                ('estatus', models.CharField(default=b'A', max_length=1, choices=[(b'A', b'Aprobado'), (b'R', b'Rechazado')])),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='CuotasPrestamo',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('valorCapital', models.DecimalField(max_digits=18, decimal_places=2)),
                ('valorInteres', models.DecimalField(null=True, max_digits=18, decimal_places=2)),
                ('fechaPago', models.DateField(auto_now_add=True)),
                ('estatus', models.CharField(default=b'P', max_length=1, choices=[(b'P', b'Pendiente'), (b'A', b'Aprobado'), (b'R', b'Rechazado'), (b'N', b'Nota de Credito')])),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='DesembolsoElectronico',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('fecha', models.DateField(auto_now_add=True)),
                ('monto', models.DecimalField(max_digits=18, decimal_places=2)),
                ('estatus', models.CharField(default=b'P', max_length=1, choices=[(b'P', b'Pendiente'), (b'A', b'Aprobado'), (b'R', b'Rechazado')])),
                ('datetimeServer', models.DateTimeField(auto_now_add=True)),
                ('banco', models.ForeignKey(to='administracion.Banco')),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='DistribucionExcedente',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('agno', models.CharField(max_length=4)),
                ('fecha', models.DateField(auto_now_add=True)),
                ('porcentaje', models.DecimalField(max_digits=6, decimal_places=2)),
                ('fechaPosteo', models.DateField(auto_now=True, null=True)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='MaestraPrestamo',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('noPrestamo', models.PositiveIntegerField(unique=True)),
                ('montoInicial', models.DecimalField(max_digits=12, decimal_places=2)),
                ('tasaInteresAnual', models.DecimalField(max_digits=12, decimal_places=2)),
                ('tasaInteresMensual', models.DecimalField(max_digits=12, decimal_places=2)),
                ('pagoPrestamoAnterior', models.DecimalField(null=True, max_digits=12, decimal_places=2, blank=True)),
                ('cantidadCuotas', models.PositiveIntegerField()),
                ('montoCuotaQ1', models.DecimalField(null=True, max_digits=12, decimal_places=2, blank=True)),
                ('montoCuotaQ2', models.DecimalField(null=True, max_digits=12, decimal_places=2, blank=True)),
                ('fechaDesembolso', models.DateField(null=True)),
                ('fechaEntrega', models.DateField(null=True)),
                ('valorGarantizado', models.DecimalField(null=True, max_digits=12, decimal_places=2, blank=True)),
                ('balance', models.DecimalField(max_digits=12, decimal_places=2, blank=True)),
                ('posteado', models.CharField(default=b'N', max_length=1)),
                ('posteadoFecha', models.DateField(auto_now=True, null=True)),
                ('datetimeServer', models.DateTimeField(auto_now_add=True)),
                ('categoriaPrestamo', models.ForeignKey(to='administracion.CategoriaPrestamo')),
                ('chequeNo', models.ForeignKey(to='prestamos.Cheque', null=True)),
                ('distrito', models.ForeignKey(to='administracion.Distrito')),
                ('factura', models.ForeignKey(to='facturacion.Factura', null=True)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='NotaDeCreditoEspecial',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('fecha', models.DateField(auto_now=True)),
                ('totalMontoOrden', models.DecimalField(max_digits=18, decimal_places=2)),
                ('montoConsumido', models.DecimalField(max_digits=18, decimal_places=2)),
                ('nota', models.TextField()),
                ('estatus', models.CharField(default=b'P', max_length=1, choices=[(b'P', b'Pendiente'), (b'A', b'Aprobado'), (b'R', b'Rechazado')])),
                ('posteado', models.BooleanField(default=False)),
                ('fechaPosteo', models.DateField(auto_now=True, null=True)),
                ('datetimeServer', models.DateTimeField(auto_now_add=True)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='NotaDeCreditoPrestamo',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('fecha', models.DateField(auto_now=True)),
                ('valorCapital', models.DecimalField(max_digits=18, decimal_places=2)),
                ('valorInteres', models.DecimalField(null=True, max_digits=18, decimal_places=2)),
                ('concepto', models.TextField()),
                ('posteado', models.BooleanField(default=False)),
                ('fechaPosteo', models.DateField(auto_now=True, null=True)),
                ('datetimeServer', models.DateTimeField(auto_now_add=True)),
                ('aplicadoACuota', models.ForeignKey(to='prestamos.CuotasPrestamo')),
                ('noPrestamo', models.ForeignKey(to='prestamos.MaestraPrestamo')),
                ('userLog', models.ForeignKey(related_name='+', to=settings.AUTH_USER_MODEL)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='NotaDeDebitoPrestamo',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('fecha', models.DateField(auto_now=True)),
                ('valorCapital', models.DecimalField(max_digits=18, decimal_places=2)),
                ('valorInteres', models.DecimalField(null=True, max_digits=18, decimal_places=2)),
                ('concepto', models.TextField()),
                ('estatus', models.CharField(default=b'P', max_length=1, choices=[(b'P', b'Pendiente'), (b'A', b'Aprobado'), (b'R', b'Rechazado')])),
                ('posteado', models.BooleanField(default=False)),
                ('fechaPosteo', models.DateField(auto_now=True, null=True)),
                ('datetimeServer', models.DateTimeField(auto_now_add=True)),
                ('noPrestamo', models.ForeignKey(to='prestamos.MaestraPrestamo')),
                ('userLog', models.ForeignKey(related_name='+', to=settings.AUTH_USER_MODEL)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='PrestamoUnificado',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('capitalUnificado', models.DecimalField(max_digits=12, decimal_places=2)),
                ('estatus', models.CharField(default=b'P', max_length=1, choices=[(b'P', b'En Proceso'), (b'A', b'Aprobado'), (b'R', b'Rechazado')])),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='SolicitudOrdenDespachoD',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('articulo', models.CharField(default=b'No especificado', max_length=80)),
                ('cantidad', models.DecimalField(max_digits=12, decimal_places=2)),
                ('precio', models.DecimalField(max_digits=12, decimal_places=2)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='SolicitudOrdenDespachoH',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('noSolicitud', models.IntegerField(unique=True)),
                ('fechaSolicitud', models.DateField(auto_now=True)),
                ('salarioSocio', models.DecimalField(max_digits=12, decimal_places=2)),
                ('montoSolicitado', models.DecimalField(max_digits=12, decimal_places=2)),
                ('valorGarantizdo', models.DecimalField(null=True, max_digits=12, decimal_places=2, blank=True)),
                ('netoDesembolsar', models.DecimalField(max_digits=12, decimal_places=2)),
                ('observacion', models.TextField()),
                ('fechaParaDescuento', models.DateField()),
                ('unificarPrestamos', models.BooleanField(default=False)),
                ('tasaInteresAnual', models.DecimalField(max_digits=6, decimal_places=2)),
                ('tasaInteresMensual', models.DecimalField(max_digits=6, decimal_places=2)),
                ('cantidadCuotas', models.IntegerField()),
                ('valorCuotasCapital', models.DecimalField(max_digits=12, decimal_places=2)),
                ('fechaAprobacion', models.DateField(null=True, blank=True)),
                ('fechaRechazo', models.DateField(null=True, blank=True)),
                ('estatus', models.CharField(default=b'P', max_length=1, choices=[(b'P', b'En Proceso'), (b'A', b'Aprobado'), (b'R', b'Rechazado'), (b'C', b'Cancelado')])),
                ('prestamo', models.PositiveIntegerField(null=True)),
                ('datetimeServer', models.DateTimeField(auto_now_add=True)),
                ('autorizadoPor', models.ForeignKey(to=settings.AUTH_USER_MODEL)),
                ('categoriaPrestamo', models.ForeignKey(to='administracion.CategoriaPrestamo')),
                ('cobrador', models.ForeignKey(to='administracion.Cobrador')),
                ('representante', models.ForeignKey(to='administracion.Representante')),
                ('socio', models.ForeignKey(to='administracion.Socio')),
                ('suplidor', models.ForeignKey(to='administracion.Suplidor')),
                ('userLog', models.ForeignKey(related_name='+', to=settings.AUTH_USER_MODEL)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='SolicitudPrestamo',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('noSolicitud', models.PositiveIntegerField(unique=True)),
                ('fechaSolicitud', models.DateField(auto_now=True)),
                ('salarioSocio', models.DecimalField(null=True, max_digits=12, decimal_places=2)),
                ('montoSolicitado', models.DecimalField(max_digits=12, decimal_places=2)),
                ('ahorrosCapitalizados', models.DecimalField(default=0, max_digits=12, decimal_places=2)),
                ('deudasPrestamos', models.DecimalField(default=0, max_digits=12, decimal_places=2)),
                ('prestacionesLaborales', models.DecimalField(default=0, max_digits=12, decimal_places=2)),
                ('valorGarantizado', models.DecimalField(null=True, max_digits=12, decimal_places=2, blank=True)),
                ('netoDesembolsar', models.DecimalField(max_digits=12, decimal_places=2)),
                ('observacion', models.TextField(max_length=100)),
                ('fechaParaDescuento', models.DateField()),
                ('unificarPrestamos', models.BooleanField(default=False)),
                ('tasaInteresAnual', models.DecimalField(max_digits=6, decimal_places=2)),
                ('tasaInteresMensual', models.DecimalField(max_digits=6, decimal_places=2)),
                ('cantidadCuotas', models.IntegerField()),
                ('valorCuotasCapital', models.DecimalField(max_digits=12, decimal_places=2)),
                ('fechaAprobacion', models.DateField(null=True, blank=True)),
                ('fechaRechazo', models.DateField(null=True, blank=True)),
                ('estatus', models.CharField(default=b'P', max_length=1, choices=[(b'P', b'En Proceso'), (b'A', b'Aprobado'), (b'R', b'Rechazado'), (b'C', b'Cancelado')])),
                ('prestamo', models.PositiveIntegerField(null=True)),
                ('datetimeServer', models.DateTimeField(auto_now_add=True)),
                ('autorizadoPor', models.ForeignKey(to=settings.AUTH_USER_MODEL, null=True)),
                ('categoriaPrestamo', models.ForeignKey(to='administracion.CategoriaPrestamo')),
                ('cobrador', models.ForeignKey(to='administracion.Cobrador')),
                ('representante', models.ForeignKey(to='administracion.Representante')),
                ('socio', models.ForeignKey(to='administracion.Socio')),
                ('userLog', models.ForeignKey(related_name='+', to=settings.AUTH_USER_MODEL)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.AddField(
            model_name='solicitudordendespachod',
            name='ordenDespacho',
            field=models.ForeignKey(to='prestamos.SolicitudOrdenDespachoH'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='prestamounificado',
            name='prestamoPrincipal',
            field=models.ForeignKey(related_name='+', to='prestamos.SolicitudPrestamo'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='prestamounificado',
            name='prestamoUnificado',
            field=models.ForeignKey(related_name='+', to='prestamos.MaestraPrestamo'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='notadecreditoespecial',
            name='ordenDespacho',
            field=models.ForeignKey(to='prestamos.SolicitudOrdenDespachoH'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='notadecreditoespecial',
            name='userLog',
            field=models.ForeignKey(related_name='+', to=settings.AUTH_USER_MODEL),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='maestraprestamo',
            name='noSolicitudOD',
            field=models.ForeignKey(blank=True, to='prestamos.SolicitudOrdenDespachoH', null=True),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='maestraprestamo',
            name='noSolicitudPrestamo',
            field=models.ForeignKey(blank=True, to='prestamos.SolicitudPrestamo', null=True),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='maestraprestamo',
            name='oficial',
            field=models.ForeignKey(to=settings.AUTH_USER_MODEL),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='maestraprestamo',
            name='representante',
            field=models.ForeignKey(to='administracion.Representante'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='maestraprestamo',
            name='socio',
            field=models.ForeignKey(to='administracion.Socio'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='maestraprestamo',
            name='userLog',
            field=models.ForeignKey(related_name='+', to=settings.AUTH_USER_MODEL),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='distribucionexcedente',
            name='noPrestamo',
            field=models.ForeignKey(to='prestamos.MaestraPrestamo'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='desembolsoelectronico',
            name='noPrestamo',
            field=models.ForeignKey(to='prestamos.MaestraPrestamo'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='desembolsoelectronico',
            name='userLog',
            field=models.ForeignKey(related_name='+', to=settings.AUTH_USER_MODEL),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='cuotasprestamo',
            name='noPrestamo',
            field=models.ForeignKey(to='prestamos.MaestraPrestamo'),
            preserve_default=True,
        ),
    ]
