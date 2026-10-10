// Finanzas, contabilidad y reclamos (61–68) — Español
(function () {
  var root = window.TR3S_I18N = window.TR3S_I18N || {}; var d = root.es = root.es || {};
  d.fin = {
    shell: { portal:'Finanzas y reclamos', account:'TR3SLOG · Administración interna', signout:'Cerrar sesión', searchPh:'Buscar transacción, factura, reclamo o cliente',
      demo:'Cifras de referencia', section:{finance:'Finanzas y contabilidad',claims:'Reclamos y resolución'},
      roleT:'Rol activo', stateT:'Estado de vista',
      states:{data:'Datos',loading:'Cargando',empty:'Vacío',error:'Error'},
      roles:{super:'Superadministrador',finance:'Gerente de finanzas',support:'Agente de soporte',compliance:'Revisor de cumplimiento',ops:'Gerente de operaciones'} },
    nav: { fin:'Panel financiero', tx:'Transacciones de pago', refunds:'Reembolsos y ajustes', recon:'Conciliación', finrep:'Reportes financieros', claims:'Centro de reclamos', claim:'Investigación de reclamo', claimpol:'Política de reclamos' },
    common: { export:'Exportar', pdf:'PDF', excel:'Excel', filters:'Filtros', search:'Buscar', save:'Guardar', cancel:'Cancelar', submit:'Enviar', approve:'Aprobar', reject:'Rechazar', view:'Ver', download:'Descargar', all:'Todos',
      empty:'No hay registros para los filtros seleccionados.', emptyHint:'Ajuste el período o limpie los filtros para ver resultados.',
      errorT:'No se pudo cargar la información', errorHint:'El servicio financiero no respondió. Intente de nuevo en un momento.', retry:'Reintentar',
      deniedT:'No tiene acceso a esta sección', deniedHint:'La información financiera está limitada a roles autorizados. Solicite acceso a un administrador de la organización.',
      required:'Complete los campos obligatorios.', exported:'Exportación preparada y enviada a su correo.',
      auditT:'Historial de auditoría', auditNote:'Los registros de auditoría son inmutables y no pueden ser editados por administradores.',
      restricted:'Restringido a roles autorizados' },
    fin: {
      title:'Panel financiero', sub:'Vista consolidada de ingresos, cobros y saldos en los mercados activos.',
      stats:[{k:'Ingresos (mes en curso)',v:'$ ——',d:'Referencia'},{k:'Pagos cobrados',v:'$ ——',d:'Referencia'},{k:'Saldo pendiente',v:'$ ——',d:'Referencia'},{k:'Facturas vencidas',v:'——',d:'Más de 30 días'},{k:'Reembolsos emitidos',v:'$ ——',d:'Referencia'},{k:'Créditos y ajustes',v:'$ ——',d:'Referencia'}],
      filters:['Este mes','Mes anterior','Trimestre','Año','Todas las cuentas empresariales'],
      svc:{t:'Ingresos por servicio',exp:true,cols:['Servicio','Envíos','Ingresos','Ticket promedio','Participación'],rows:[
        {c:['Paquetería nacional','——','$ ——','$ ——','—— %']},{c:['Internacional consolidado','——','$ ——','$ ——','—— %']},
        {c:['Carga completa','——','$ ——','$ ——','—— %']},{c:['Almacenaje','——','$ ——','$ ——','—— %']}]},
      mkt:{t:'Ingresos por mercado',exp:true,cols:['Mercado','Ingresos','Pendiente','Estado'],rows:[
        {c:['Estados Unidos','$ ——','$ ——'],st:'ok',pill:'Activo'},{c:['Puerto Rico','$ ——','$ ——'],st:'ok',pill:'Activo'},
        {c:['República Dominicana','$ ——','$ ——'],st:'ok',pill:'Activo'},{c:['Venezuela','—','—'],st:'warn',pill:'Expansión futura'}]},
      fails:{t:'Fallas de pago que requieren atención',cols:['Cuenta','Factura','Monto','Intentos','Estado'],rows:[
        {c:['Distribuidora Caribe','INV-20418','$ ——','3'],st:'bad',pill:'Tarjeta rechazada'},
        {c:['Almacén Bayamón','INV-20402','$ ——','2'],st:'warn',pill:'Reintento programado'}]},
      note:'Las cifras mostradas son de referencia hasta autorizar la integración contable. No se muestran datos financieros reales.',
      live:{stats:['Pagos procesados','Pagos pendientes','Envíos registrados','Cotizaciones recibidas','Incidencias reportadas','Transacciones de nómina'],d:'Datos reales',
        trackT:'Envíos por servicio',trackCols:['Tracking','Servicio','Origen','Destino','Fecha'],
        none:'Sin tipo',pills:{pending:'Pendiente',in_transit:'En tránsito',delivered:'Entregado',cancelled:'Cancelado'},
        mktCols:['Mercado','Envíos','Ingresos','Estado'],
        markets:{PR:'Puerto Rico',DO:'República Dominicana',VE:'Venezuela',US:'Estados Unidos'},
        mktPills:{active:'Activo',future:'En preparación'},other:'Otro',
        failT:'Incidencias que requieren atención',failCols:['Código','Tipo','Reportado por','Severidad','Fecha','Estado'],
        incPills:{open:'Abierto',in_progress:'En revisión',resolved:'Resuelto',closed:'Cerrado'}}
    },
    tx: {
      title:'Transacciones de pago', sub:'Cada intento de pago con su referencia del procesador y estado de reembolso.',
      stats:[{k:'Transacciones (período)',v:'——',d:'Referencia'},{k:'Completadas',v:'——',d:'Referencia'},{k:'Fallidas',v:'——',d:'Referencia'},{k:'En disputa',v:'——',d:'En revisión'}],
      filters:['Todas','Pendiente','Autorizada','Completada','Fallida','Reembolsada','Reembolso parcial','En disputa'],
      list:{t:'Transacciones',exp:true,cols:['Transacción','Cuenta','Factura','Envío','Método','Monto','Moneda','Fecha','Ref. procesador','Estado'],rows:[
        {c:['TRX-77120','Distribuidora Caribe','INV-20418','TR3-260729-EUAL-84120','Tarjeta ····4242','$ ——','USD','2026-07-24','ch_ph_0001'],st:'bad',pill:'Fallida'},
        {c:['TRX-77118','Almacén Bayamón','INV-20402','TR3-260729-PRSJ-84077','Transferencia','$ ——','USD','2026-07-24','po_ph_0002'],st:'ok',pill:'Completada'},
        {c:['TRX-77104','Importadora RD','INV-20396','TR3-260729-EUAL-83940','Tarjeta ····1881','$ ——','USD','2026-07-23','ch_ph_0003'],st:'info',pill:'Autorizada'},
        {c:['TRX-77088','Retail Miami LLC','INV-20388','TR3-260729-EUAL-83712','ACH','$ ——','USD','2026-07-22','po_ph_0004'],st:'warn',pill:'Reembolso parcial'},
        {c:['TRX-77061','Cliente individual','INV-20377','TR3-260729-PRSJ-83540','Tarjeta ····9002','$ ——','USD','2026-07-21','ch_ph_0005'],st:'neutral',pill:'Pendiente'},
        {c:['TRX-77040','Textiles Santiago','INV-20361','TR3-260729-PRSJ-83411','Tarjeta ····7710','$ ——','USD','2026-07-20','ch_ph_0006'],st:'info',pill:'En disputa'}]},
      note:'Los montos y referencias del procesador son de referencia. Los números de tarjeta se almacenan siempre enmascarados.',
      live:{cols:['Referencia','Beneficiario','Período','Base','Bonos','Deducciones','Total','Pagado','Estado'],
        stats:['Pagos registrados','Completados','Pendientes','Total pagado'],d:'Datos reales',
        pills:{Paid:'Pagado',Pending:'Pendiente'}}
    },
    refunds: {
      title:'Reembolsos y ajustes', sub:'Los reembolsos por encima del límite configurado requieren aprobación de finanzas antes de procesarse.',
      stats:[{k:'Solicitudes abiertas',v:'——',d:'Por revisar'},{k:'En espera de aprobación',v:'——',d:'Sobre el límite'},{k:'Procesados (mes)',v:'$ ——',d:'Referencia'},{k:'Límite de aprobación',v:'$ ——',d:'Configurable'}],
      form:{t:'Nueva solicitud de reembolso',fields:[
        {l:'Envío pendiente (tracking)',ph:'Seleccione el envío a reembolsar',span:1},{l:'Monto a reembolsar',ph:'$0.00',span:1},
        {l:'Motivo del reembolso',ph:'Servicio no prestado, cargo duplicado, corrección de factura…',span:2},
        {l:'Documentación de respaldo',ph:'Adjunte factura, evidencia o autorización',file:true,span:2}],
        submit:'Enviar solicitud',ok:'Solicitud de reembolso enviada para aprobación.'},
      panels:[{t:'Transacción original',items:[{k:'Transacción',v:'TRX-77120'},{k:'Cuenta',v:'Distribuidora Caribe'},{k:'Factura',v:'INV-20418'},{k:'Método',v:'Tarjeta ····4242'},{k:'Monto original',v:'$ ——'},{k:'Fecha de pago',v:'2026-07-24'}]},
        {t:'Aprobación y procesamiento',items:[{k:'Estado de aprobación',v:'En espera del gerente de finanzas'},{k:'Aprobado por',v:'—'},{k:'Estado de procesamiento',v:'Sin iniciar'},{k:'Notificación al cliente',v:'Al aprobar'},{k:'Acreditación estimada',v:'3–5 días hábiles'}]}],
      steps:{t:'Flujo de aprobación',items:['Solicitud creada','Revisión de finanzas','Aprobado','Procesado por el proveedor','Cliente notificado'],action:'Avanzar aprobación',ok:'Etapa de aprobación avanzada y registrada en la auditoría.'},
      hist:{t:'Historial de ajustes',exp:true,cols:['Referencia','Tipo','Cuenta','Monto','Fecha','Aprobado por','Estado'],rows:[
        {c:['ADJ-3081','Reembolso total','Retail Miami LLC','$ ——','2026-07-18','A. Peralta'],st:'ok',pill:'Procesado'},
        {c:['ADJ-3074','Nota de crédito','Importadora RD','$ ——','2026-07-15','A. Peralta'],st:'ok',pill:'Procesado'},
        {c:['ADJ-3069','Reembolso parcial','Textiles Santiago','$ ——','2026-07-11','—'],st:'warn',pill:'En espera de aprobación'}]},
      note:'Los reembolsos nunca se procesan automáticamente: un revisor autorizado aprueba cada solicitud y la decisión se escribe en el registro de auditoría inmutable.'
    },
    recon: {
      title:'Conciliación', sub:'Compare pagos internos con los registros del procesador y los depósitos bancarios antes de cerrar el período.',
      stats:[{k:'Conciliadas',v:'——',d:'Referencia'},{k:'Sin coincidencia',v:'——',d:'Requiere revisión'},{k:'Pagos faltantes',v:'——',d:'Referencia'},{k:'Duplicados',v:'——',d:'Referencia'}],
      filters:['Período actual','Período anterior','Solo sin coincidencia','Solo variaciones'],
      diff:{t:'Transacciones sin coincidencia',exp:true,cols:['Registro interno','Registro del procesador','Depósito bancario','Variación','Tipo','Estado'],rows:[
        {c:['TRX-77118 · $ ——','po_ph_0002 · $ ——','DEP-4410','$ ——','Variación'],st:'warn',pill:'En revisión'},
        {c:['TRX-77104 · $ ——','—','—','$ ——','Falta en el procesador'],st:'bad',pill:'Abierto'},
        {c:['—','ch_ph_0009 · $ ——','DEP-4408','$ ——','Falta internamente'],st:'bad',pill:'Abierto'},
        {c:['TRX-77040 · $ ——','ch_ph_0006 · $ ——','DEP-4405','$ ——','Posible duplicado'],st:'warn',pill:'En revisión'}]},
      panels:[{t:'Cierre de período',items:[{k:'Período',v:'Julio 2026'},{k:'Estado de conciliación',v:'En proceso'},{k:'Revisado por',v:'—'},{k:'Cerrado el',v:'—'},{k:'Ítems sin resolver',v:'——'}]},
        {t:'Notas de resolución',items:[{k:'TRX-77104',v:'En espera de confirmación del procesador'},{k:'ch_ph_0009',v:'Depósito recibido sin registro interno'},{k:'TRX-77040',v:'Verificar posible doble captura'}]}],
      closure:{t:'Flujo de cierre del período',items:['Ítems revisados','Variaciones resueltas','Revisión de finanzas','Período cerrado'],action:'Solicitar cierre del período',ok:'Cierre solicitado. Un revisor autorizado debe confirmarlo.'},
      note:'El período no puede marcarse como conciliado sin la revisión de un rol financiero autorizado.'
    },
    finrep: {
      title:'Reportes financieros', sub:'Reportes disponibles para roles financieros autorizados, exportables en PDF o Excel.',
      filters:['Este mes','Trimestre','Año','Rango personalizado'],
      cards:{t:'Reportes disponibles',items:[
        {t:'Reporte de ingresos',s:'Ingresos por período, servicio y mercado'},{t:'Cuentas por cobrar',s:'Antigüedad por cliente y cuenta empresarial'},
        {t:'Saldos pendientes',s:'Facturas abiertas y días de vencimiento'},{t:'Cobranza',s:'Cobros por método y procesador'},
        {t:'Reporte de reembolsos',s:'Reembolsos emitidos, motivos y aprobaciones'},{t:'Créditos y ajustes',s:'Notas de crédito y correcciones manuales'},
        {t:'Ingresos por servicio',s:'Comparación entre líneas de servicio'},{t:'Ingresos por cliente',s:'Ranking por volumen facturado'},
        {t:'Ingresos por país',s:'Solo mercados activos'},{t:'Resumen de transacciones fiscales',s:'Transacciones gravables por jurisdicción'}]},
      note:'Las exportaciones se registran con el usuario solicitante, el reporte y el período. Solo los roles con permiso de exportación pueden descargar datos financieros.',
      live:{suffix:'· {n} registros reales'}
    },
    claims: {
      title:'Centro de reclamos', sub:'Reclamos por estado, valor y asignación, con objetivos de resolución.',
      stats:[{k:'Abiertos',v:'——',d:'Referencia'},{k:'En revisión',v:'——',d:'Referencia'},{k:'Aprobados',v:'——',d:'Referencia'},{k:'Rechazados',v:'——',d:'Referencia'},{k:'Cerrados (mes)',v:'——',d:'Referencia'}],
      filters:['Todos','Abiertos','En revisión','Aprobados','Rechazados','Cerrados','Prioridad alta'],
      list:{t:'Reclamos',exp:true,cols:['Reclamo','Envío','Tipo','Valor reclamado','Asignado a','Prioridad','Vencimiento','Estado'],rows:[
        {c:['CLM-1042','TR3-260729-EUAL-84120','Envío dañado','$ ——','M. Solano','Alta','2026-07-29'],st:'warn',pill:'En revisión'},
        {c:['CLM-1039','TR3-260729-EUAL-83940','Envío perdido','$ ——','J. Rivas','Alta','2026-07-28'],st:'bad',pill:'Abierto'},
        {c:['CLM-1035','TR3-260729-EUAL-83712','Artículos faltantes','$ ——','M. Solano','Media','2026-08-02'],st:'warn',pill:'En revisión'},
        {c:['CLM-1028','TR3-260729-PRSJ-83540','Entrega retrasada','$ ——','L. Duarte','Baja','2026-08-05'],st:'ok',pill:'Aprobado'},
        {c:['CLM-1021','TR3-260729-PRSJ-83411','Disputa de facturación','$ ——','A. Peralta','Media','2026-07-31'],st:'neutral',pill:'Cerrado'}]},
      note:'Cada cambio de estado se registra con usuario, fecha y valor anterior.',
      live:{cols:['Código','Referencia','Tipo','Reportado por','Severidad','Fecha','Foto','Estado'],
        stats:['Abiertos','En revisión','Resueltos','Cerrados','Total reportados'],d:'Datos reales',
        pills:{open:'Abierto',in_progress:'En revisión',resolved:'Resuelto',closed:'Cerrado'}}
    },
    claim: {
      title:'Reclamo CLM-1042 · Envío dañado', sub:'Investigación con evidencia, decisión e historial de auditoría completo.',
      panels:[{t:'Reclamante',items:[{k:'Nombre',v:'Distribuidora Caribe'},{k:'Contacto',v:'claims@placeholder.com'},{k:'Cuenta empresarial',v:'BA-2041'},{k:'Fecha de presentación',v:'2026-07-22'},{k:'Tipo de reclamo',v:'Envío dañado'}]},
        {t:'Paquete y valor',items:[{k:'Envío',v:'TR3-260729-EUAL-84120'},{k:'Piezas',v:'3'},{k:'Peso',v:'34 lbs'},{k:'Valor declarado',v:'$ ——'},{k:'Monto reclamado',v:'$ ——'}]},
        {t:'Decisión',items:[{k:'Revisor',v:'M. Solano'},{k:'Decisión',v:'Pendiente'},{k:'Compensación',v:'—'},{k:'Objetivo de resolución',v:'2026-07-29'},{k:'Cliente notificado',v:'Al decidir'}]}],
      timeline:{t:'Cronología del envío',items:[{t:'Recolectado',d:'2026-07-16 · Miami, FL'},{t:'En tránsito',d:'2026-07-17 · Consolidación'},{t:'Arribo a destino',d:'2026-07-19 · San Juan, PR'},{t:'En reparto',d:'2026-07-20'},{t:'Entregado con excepción',d:'2026-07-20 · Daño reportado'}]},
      cards:{t:'Evidencia y documentos',items:[
        {t:'Fotos del cliente (4)',s:'Cargadas 2026-07-22 · almacenamiento seguro'},{t:'Evidencia del conductor',s:'Foto de entrega y notas'},
        {t:'Prueba de entrega',s:'Firma capturada 2026-07-20'},{t:'Factura comercial',s:'Respaldo del valor declarado'}]},
      notes:{t:'Notas internas de investigación',fields:[{l:'Nota del revisor',ph:'Hallazgos, contacto con el conductor, verificación en almacén…',span:2}],submit:'Guardar nota',ok:'Nota interna guardada en el expediente del reclamo.'},
      steps:{t:'Flujo de resolución',items:['Presentado','Evidencia recopilada','Investigación','Decisión','Compensación y cierre'],action:'Avanzar etapa',ok:'Etapa avanzada y registrada en la auditoría.'},
      hist:{t:'Historial de auditoría',cols:['Fecha','Usuario','Acción','Valor anterior','Valor nuevo'],rows:[
        {c:['2026-07-22 09:14','Portal de cliente','Reclamo presentado','—','Abierto']},
        {c:['2026-07-22 11:02','J. Rivas','Asignación','—','M. Solano']},
        {c:['2026-07-23 15:40','M. Solano','Cambio de estado','Abierto','En revisión']},
        {c:['2026-07-24 08:22','M. Solano','Evidencia agregada','3 archivos','4 archivos']}]},
      note:'Los documentos se almacenan de forma segura y solo son visibles para revisores autorizados.'
    },
    claimpol: {
      title:'Configuración de política de reclamos', sub:'Versiones de la política visible al cliente con fechas de vigencia y niveles de aprobación.',
      form:{t:'Política vigente',fields:[
        {l:'Plazo para presentar (días)',ph:'15',span:1},{l:'Compensación máxima',ph:'$ ——',span:1},
        {l:'Objetivo de resolución (días hábiles)',ph:'10',span:1},{l:'Versión de la política',ph:'v3.2',span:1},
        {l:'Vigente desde',ph:'2026-08-01',span:1},{l:'Vigente hasta',ph:'—',span:1},
        {l:'Exclusiones',ph:'Artículos prohibidos, valor no declarado, empaque hecho por el cliente…',span:2}],
        submit:'Guardar versión',ok:'Versión de política guardada como borrador pendiente de aprobación.'},
      toggles:{t:'Servicios elegibles y evidencia requerida',items:[
        {k:'Paquetería nacional',on:true},{k:'Internacional consolidado',on:true},{k:'Carga completa',on:false},{k:'Almacenaje',on:false},
        {k:'Evidencia fotográfica obligatoria',on:true},{k:'Factura comercial obligatoria',on:true},{k:'Denuncia policial por pérdida',on:false}]},
      panels:[{t:'Niveles de aprobación',items:[{k:'Hasta $ ——',v:'Agente de soporte'},{k:'Hasta $ ——',v:'Gerente de operaciones'},{k:'Sobre $ ——',v:'Gerente de finanzas'},{k:'Cambios de política',v:'Superadministrador'}]}],
      hist:{t:'Historial de versiones',cols:['Versión','Vigente desde','Responsable','Idiomas','Estado'],rows:[
        {c:['v3.2','2026-08-01','A. Peralta','EN · ES · ZH'],st:'warn',pill:'Pendiente de aprobación'},
        {c:['v3.1','2026-02-01','A. Peralta','EN · ES · ZH'],st:'ok',pill:'Publicada'},
        {c:['v3.0','2025-09-15','R. Molina','EN · ES'],st:'neutral',pill:'Archivada'}]},
      note:'La política visible al cliente se publica en inglés, español y chino simplificado; no se publica ninguna versión sin traducir.'
    }
  };
})();
