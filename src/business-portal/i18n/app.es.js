// App (auth · portal del cliente · administración) — Español
(function () {
  var root = window.TR3S_I18N = window.TR3S_I18N || {}; var d = root.es = root.es || {};
  d.app = {
    auth: {
      signinT:'Inicie sesión en TR3SLOG', signinSub:'Acceda a sus envíos, cotizaciones y documentos.',
      email:'Correo electrónico', emailPh:'nombre@empresa.com', password:'Contraseña', passwordPh:'••••••••',
      remember:'Mantener sesión abierta', forgot:'¿Olvidó su contraseña?', signinBtn:'Iniciar sesión',
      noAccount:'¿Nuevo en TR3SLOG?', createLink:'Crear una cuenta',
      signupT:'Cree su cuenta', signupSub:'Configure su cuenta para solicitar envíos y seguir cada operación.',
      name:'Nombre completo', namePh:'Su nombre', company:'Empresa (opcional)', companyPh:'Comercial Bayamón LLC',
      phone:'Teléfono', phonePh:'+1 787 000 0000', confirm:'Confirmar contraseña',
      terms:'Acepto los Términos de servicio y la Política de privacidad', signupBtn:'Crear cuenta',
      haveAccount:'¿Ya tiene una cuenta?', signinLink:'Iniciar sesión',
      resetT:'Restablecer contraseña', resetSub:'Ingrese su correo y le enviaremos un enlace de restablecimiento.',
      resetBtn:'Enviar enlace', resetSent:'Enlace enviado. Revise su bandeja de entrada para continuar.',
      newPass:'Nueva contraseña', savePass:'Guardar nueva contraseña', back:'Volver a iniciar sesión',
      errEmail:'Ingrese un correo electrónico válido.', errPass:'La contraseña debe tener al menos 8 caracteres.',
      errMatch:'Las contraseñas no coinciden.', errTerms:'Debe aceptar los términos para continuar.',
      errCreds:'El correo o la contraseña son incorrectos.'
    },
    shell: { roleDemo:'Cambio de vista de demostración', roleDemoNote:'La autorización real se aplica en el servidor, no en esta pantalla.', searchHint:'Busca en envíos', portal:'Portal del cliente', admin:'Operaciones', signout:'Cerrar sesión', viewSite:'Ver website', account:'Cuenta', role:'Corporativo · BIZ-0241', client:'Comercial Bayamón LLC', operator:'Operaciones · Hub San Juan', searchPh:'Buscar número de guía, cliente o ruta' },
    navC: { dashboard:'Panel', shipments:'Mis envíos', create:'Crear envío', payments:'Pagos y facturas', addresses:'Direcciones', support:'Soporte' },
    navA: { ops:'Panel de operaciones', dispatch:'Envíos y despacho', drivers:'Conductores', incidents:'Incidencias' },
    dash: {
      greeting:'Buenas tardes', title:'Su operación de un vistazo', newShipment:'Nuevo envío', range:'Últimos 30 días',
      kpis:[{l:'Envíos activos',v:'14',n:'3 en tránsito'},{l:'Entregados este mes',v:'248',n:'vs. mes anterior'},{l:'Puntualidad',v:'97.6%',n:'objetivo SLA 95%'},{l:'Cotizaciones pendientes',v:'3',n:'esperan su aprobación'}],
      activeT:'Envíos activos', seeAll:'Ver todos',
      quickT:'Acciones rápidas', quick:['Nuevo envío','Programar recogido','Rastrear envío','Contactar soporte'],
      activityT:'Actividad reciente',
      activity:[{t:'Entregado a Daniela Cruz',m:'TR3-260729-EUAL-08744 · hace 12 min'},{t:'Conductor recogió la carga',m:'TR3-260729-RDPC-08790 · hace 38 min'},{t:'Nuevo envío creado',m:'TR3-260729-PRSJ-08821 · hace 1 h'},{t:'Factura INV-1042 pagada',m:'$1,240.00 · ayer'}],
      alertsT:'Alertas',
      alerts:[{t:'Cotización por aprobar',d:'La cotización QT-0091 vence en 2 días.'},{t:'Dirección por confirmar',d:'Falta el teléfono del receptor en TR3-260729-EUAL-08702.'}]
    },
    ship: {
      title:'Mis envíos', searchPh:'Buscar por guía, ciudad o receptor',
      filters:['Todos','En tránsito','En ruta de entrega','Entregados','Pendientes'],
      cols:['Guía','Ruta','Servicio','Estado','Entrega',''],
      empty:'Ningún envío coincide con esta búsqueda. Ajuste los filtros o limpie el campo.',
      view:'Ver', results:'envíos'
    },
    detail: {
      title:'Detalle del envío', back:'Volver a mis envíos',
      addressesT:'Direcciones', from:'Remitente', to:'Destinatario',
      fromVal:'Comercial Bayamón LLC\n1234 Logistics Way, Miami, FL 33101',
      toVal:'Daniela Cruz\nAve. Roosevelt 1204, San Juan, PR 00920',
      chargesT:'Cargos', charges:[{l:'Flete',v:'$860.00'},{l:'Consolidación',v:'$120.00'},{l:'Documentación',v:'$45.00'}],
      total:'Total', totalVal:'$1,025.00',
      docPending:'El archivo se genera cuando el servicio de documentos esté conectado.', docsT:'Documentos', docs:['Conocimiento de embarque','Factura comercial','Lista de empaque'], download:'Descargar',
      evidenceT:'Evidencia de entrega', timelineT:'Línea de tiempo completa'
    },
    pod: {
      title:'Expediente de entrega', open:'Ver expediente completo', back:'Volver al envío',
      subInt:'Registro completo de la entrega, con control de acceso por rol y trazabilidad de cada consulta.',
      subCli:'Confirmación de su entrega: fecha, hora, quien recibió y la evidencia disponible.',
      subSup:'Vista para reclamos: hechos registrados, integridad de la evidencia y qué se puede compartir.',
      viewT:'Vista', views:{ internal:'Operaciones', customer:'Cliente', support:'Soporte' },
      viewNote:{
        internal:'Vista interna. Incluye datos del receptor y de la flota. No se comparte con el cliente.',
        customer:'Vista del cliente. Sin datos personales del receptor y sin posiciones de la flota.',
        support:'Vista de soporte. Solo lectura, orientada a sustentar o rechazar un reclamo.'
      },
      statusT:'Estado de la entrega', statusVal:'Entregada · evidencia completa',
      completeT:'Evidencia completa', incompleteT:'Evidencia incompleta',
      summaryT:'Resumen de la entrega',
      summary:[
        {k:'Guía',v:'TR3-260729-PRSJ-08821'},
        {k:'Fecha y hora',v:'—— · zona del dispositivo'},
        {k:'Dirección de entrega',v:'Calle Betances 88, Caguas, PR'},
        {k:'Servicio',v:'Entrega local · requiere identificación'},
        {k:'Ruta',v:'RT-2607-A'},
        {k:'Registrada desde',v:'App del conductor · sin conexión, sincronizada después'}
      ],
      receiverT:'Identidad del receptor', receiverRestricted:'Restringido · operaciones y soporte',
      receiver:[
        {k:'Nombre del receptor',v:'——'},
        {k:'Relación con el destinatario',v:'Empleado'},
        {k:'Tipo de identificación',v:'Licencia de conducir'},
        {k:'Número',v:'•••• 4821'},
        {k:'Consentimiento',v:'Otorgado por la persona'},
        {k:'Imágenes de la identificación',v:'2 · cifradas'}
      ],
      receiverHidden:'Los datos del receptor no se muestran en la vista del cliente.',
      receiverMaskNote:'Solo se conservan los últimos cuatro dígitos. El número completo nunca se almacena ni se muestra.',
      evidenceT:'Evidencia capturada',
      evidence:[
        {t:'Foto del paquete',d:'Capturada con la cámara del dispositivo',st:'ok'},
        {t:'Firma del receptor',d:'Trazada en pantalla al momento de la entrega',st:'ok'},
        {t:'Frente de la identificación',d:'Visible solo para operaciones y soporte',st:'restricted'},
        {t:'Reverso de la identificación',d:'Requerido por el tipo de documento',st:'restricted'},
        {t:'Foto del lugar',d:'Opcional · no capturada en esta entrega',st:'missing'}
      ],
      evStates:{ ok:'Disponible', restricted:'Restringida', missing:'No capturada' },
      viewImage:'Ver imagen', restrictedImage:'Sin permiso para ver esta imagen',
      geoT:'Ubicación y hora', geo:[
        {k:'Coordenadas',v:'——'},
        {k:'Precisión',v:'—— m'},
        {k:'Hora del dispositivo',v:'——'},
        {k:'Hora de sincronización',v:'——'},
        {k:'Dentro de la geocerca',v:'Sí · la geocerca no cierra la entrega'},
        {k:'Fuente de posición',v:'Amazon Location'}
      ],
      geoNote:'La geocerca es un dato de contexto. La entrega se cierra únicamente con la evidencia del conductor.',
      chainT:'Cadena de custodia', chainCols:['Momento','Evento','Responsable','Lugar','Condición'],
      chain:[
        {c:['——','Recogido en almacén','C. Méndez','Hub San Juan','Sellado']},
        {c:['——','Cargado en vehículo','E. Rivera','Muelle 3','Sellado']},
        {c:['——','En ruta','E. Rivera','RT-2607-A','Sellado']},
        {c:['——','Entregado','E. Rivera','Caguas','Buen estado']}
      ],
      chainNote:'La cadena es de solo anexado: una corrección se agrega como registro nuevo que referencia el anterior.',
      accessT:'Consultas de este expediente', accessCols:['Momento','Quién','Rol','Vista','Motivo'],
      access:[
        {c:['——','A. Rojas','Soporte','Soporte','Reclamo CLM-1041']},
        {c:['——','C. Méndez','Operaciones','Operaciones','Revisión de ruta']},
        {c:['——','Cliente','Portal','Cliente','Consulta del envío']}
      ],
      accessNote:'Cada apertura del expediente queda registrada con quién, cuándo y por qué.',
      integrityT:'Integridad', integrity:[
        {k:'Modo del registro',v:'Solo anexado'},
        {k:'Edición',v:'No permitida para ningún rol'},
        {k:'Imágenes',v:'Cifradas en reposo y en tránsito'},
        {k:'Retención',v:'Definida por cumplimiento'},
        {k:'Verificación de integridad',v:'Pendiente de conexión'}
      ],
      shareT:'Qué se puede compartir', share:[
        {k:'Foto del paquete',v:'Sí'},
        {k:'Firma',v:'Sí'},
        {k:'Fecha, hora y dirección',v:'Sí'},
        {k:'Nombre del receptor',v:'Solo con autorización'},
        {k:'Imágenes de la identificación',v:'Nunca'},
        {k:'Posición de la flota',v:'Nunca'}
      ],
      claimT:'Reclamos vinculados', claimCols:['Reclamo','Motivo','Abierto','Estado'],
      claims:[{c:['CLM-1041','Entrega no reconocida','——','En revisión']}],
      actionsT:'Acciones',
      download:'Descargar comprobante', downloadNote:'El comprobante en PDF lo emite el servicio de documentos, aún no conectado.',
      shareBtn:'Compartir con el cliente', shareNote:'El envío al cliente requiere el servicio de notificaciones.',
      dispute:'Abrir reclamo', disputeNote:'El reclamo se registra en soporte; ningún crédito se emite desde esta pantalla.',
      exportAudit:'Exportar auditoría', exportNote:'La exportación queda registrada en el historial de consultas.',
      pending:'Pendiente de conexión'
    },
    create: { errStep:'Complete los campos obligatorios de este paso.', reqMark:'Obligatorio', localNote:'El envío no se crea en el sistema: falta el servicio de envíos.',
      title:'Crear envío', steps:['Remitente','Destinatario','Paquete','Servicio y recogido','Pago'],
      next:'Continuar', back:'Atrás', submit:'Crear envío', success:'Envío creado. Se asignó la guía TR3-260729-PRSJ-08830.',
      f:{name:'Nombre',company:'Empresa',address:'Dirección',city:'Ciudad',zip:'Código postal',phone:'Teléfono',email:'Correo',pieces:'Piezas',weight:'Peso',dims:'Dimensiones',contents:'Contenido',declared:'Valor declarado',service:'Servicio',date:'Fecha de recogido',window:'Ventana de horario',notes:'Notas',payment:'Método de pago',card:'Tarjeta terminada en 4242',invoiceMe:'Cargar a la cuenta'},
      review:'Revise antes de crear', summary:'Resumen'
    },
    pay: {
      title:'Pagos y facturas', pendingT:'Pagos pendientes', paidT:'Pagos completados',
      cols:['Factura','Envío','Emitida','Monto','Estado',''],
      payNow:'Pagar', receipt:'Recibo', invoice:'Factura', totalDue:'Total por pagar', paidLabel:'Pagada', pendingLabel:'Pendiente',
      empty:'Aún no hay facturas en esta sección.'
    },
    ops: {
      title:'Panel de operaciones', subtitle:'Vista en vivo de entregas, excepciones y capacidad de conductores.',
      kpis:[{l:'Entregas activas',v:'62',n:'18 en ruta de entrega'},{l:'Envíos retrasados',v:'5',n:'requieren seguimiento'},{l:'Órdenes sin asignar',v:'7',n:'esperan conductor'},{l:'Conductores en ruta',v:'12',n:'de 15 disponibles'}],
      delayedT:'Envíos retrasados', unassignedT:'Órdenes sin asignar', driversT:'Conductores', incidentsT:'Incidencias abiertas',
      driverCols:['Conductor','Vehículo','Paradas','Progreso','Estado'],
      incidentCols:['Caso','Envío','Tipo','Reportado','Estado'],
      assign:'Asignar'
    },
    disp: {
      title:'Envíos y despacho', subtitle:'Cree, edite y despache envíos en todos los corredores.',
      create:'Crear envío', edit:'Editar', assignDriver:'Asignar conductor', changeStatus:'Cambiar estado',
      scheduleRoute:'Programar ruta', reportIncident:'Reportar incidencia',
      cols:['Guía','Cliente','Ruta','Conductor','Estado','Acciones'],
      statuses:['Solicitud recibida','Pendiente de validación','Confirmada','Recogido programado','Mercancía recibida','En procesamiento','En tránsito','En ruta de entrega','Entregada','Incidencia','Cancelada'],
      saved:'Cambios guardados.', assigned:'Conductor asignado.', incidentSaved:'Incidencia reportada y caso abierto.',
      selectDriver:'Seleccione conductor', selectStatus:'Seleccione estado', unassigned:'Sin asignar', apply:'Aplicar', cancel:'Cancelar',
      incidentType:'Tipo de incidencia', incidentTypes:['Mercancía dañada','Intento de entrega fallido','Problema de dirección','Retraso','Pieza faltante'], incidentNotes:'Notas'
    },
    addr: {
      title:'Direcciones', add:'Agregar dirección', edit:'Editar', remove:'Quitar', primary:'Principal', setPrimary:'Marcar como principal',
      newT:'Nueva dirección', editT:'Editar dirección', save:'Guardar dirección', cancelBtn:'Cancelar', removeBtn:'Eliminar', removed:'Dirección eliminada de esta sesión.', localNote:'Se guarda solo en esta sesión. La persistencia requiere el servicio de direcciones.', typeT:'Tipo de dirección', added:'Dirección añadida en esta sesión.', updated:'Dirección actualizada en esta sesión.', types:['Recogido','Entrega','Facturación'], cols:['Nombre','Dirección','Tipo','Contacto',''],
      empty:'Aún no hay direcciones guardadas.', saved:'Dirección guardada.',
      f:{name:'Nombre de la dirección',address:'Dirección',city:'Ciudad',zip:'Código postal',contact:'Contacto',phone:'Teléfono',instructions:'Instrucciones de entrega'},
      rows:[
        {n:'Almacén Bayamón Sur',a:'Carr. 167 Km 4.2, Bayamón, PR 00961',type:0,c:'R. Colón · +1 787 555 0142',primary:true},
        {n:'Tienda Caguas Centro',a:'Calle Betances 88, Caguas, PR 00725',type:1,c:'M. Díaz · +1 787 555 0177',primary:false},
        {n:'Oficina San Juan',a:'Ave. Roosevelt 1204, San Juan, PR 00920',type:1,c:'L. Ortiz · +1 787 555 0118',primary:false},
        {n:'Facturación · Bayamón',a:'Carr. 167 Km 4.2, Bayamón, PR 00961',type:2,c:'facturacion@bayamon.com',primary:false}
      ]
    },
    support: {
      title:'Soporte', sub:'Un coordinador responde dentro del próximo día hábil.',
      channelsT:'Canales de atención', hoursT:'Horario', hours:'Lun – Vie · 8:00 a.m. – 6:00 p.m. (AST)',
      channels:[{l:'WhatsApp Business',v:'+1 786 123 4567'},{l:'Teléfono',v:'+1 786 123 4567'},{l:'Correo',v:'info@tr3slog.com'},{l:'Telegram',v:'@TR3SLOG'},{l:'Discord',v:'discord.gg/tr3slog'}],
      shipInvalid:'El formato de la guía debe ser TR3-260729-PRSJ-00001.', formT:'Abrir un caso', f:{subject:'Asunto',subjectPh:'Reclamación, seguimiento, facturación…',ship:'Envío relacionado',shipPh:'TR3-260729-PRSJ-00001',msg:'Mensaje',msgPh:'Describa su solicitud'},
      submit:'Enviar caso', sent:'Caso abierto. Recibirá el número de referencia por correo.',
      openT:'Casos abiertos', open:[{id:'CS-0231',t:'Mercancía dañada',st:'En revisión',when:'25 jul'}]
    },
    rows: [
      {id:'TR3-260729-PRSJ-08821',client:'Comercial Bayamón LLC',route:'Miami → San Juan',svc:'Consolidado',status:6,eta:'31 jul',driver:'E. Rivera'},
      {id:'TR3-260729-RDPC-08790',client:'Farmacia Del Valle',route:'San Juan → Ponce',svc:'Última milla',status:7,eta:'27 jul',driver:'J. Mejía'},
      {id:'TR3-260729-EUAL-08744',client:'Tienda Caguas Centro',route:'Miami → Santo Domingo',svc:'Marítimo',status:8,eta:'22 jul',driver:'C. Núñez'},
      {id:'TR3-260729-EUAL-08702',client:'Almacén Bayamón Sur',route:'Bayamón → Caguas',svc:'Entrega local',status:0,eta:'—',driver:''},
      {id:'TR3-260729-PRSJ-08698',client:'E-shop Isla Verde',route:'Miami → Orlando',svc:'Carga terrestre',status:9,eta:'26 jul',driver:'P. Rivas'}
    ],
    invoices: [
      {id:'INV-1044',ship:'TR3-260729-PRSJ-08821',date:'24 jul, 2026',amount:'$1,025.00',paid:false},
      {id:'INV-1043',ship:'TR3-260729-RDPC-08790',date:'21 jul, 2026',amount:'$318.00',paid:false},
      {id:'INV-1042',ship:'TR3-260729-EUAL-08744',date:'14 jul, 2026',amount:'$1,240.00',paid:true},
      {id:'INV-1041',ship:'TR3-260729-PRSJ-08698',date:'08 jul, 2026',amount:'$640.00',paid:true}
    ],
    drivers: [
      {n:'E. Rivera',v:'Van 04',s:'18',p:'11 / 18',st:'En ruta'},
      {n:'J. Mejía',v:'Van 07',s:'14',p:'9 / 14',st:'En ruta'},
      {n:'C. Núñez',v:'Camión 02',s:'6',p:'6 / 6',st:'Completado'},
      {n:'P. Rivas',v:'Van 11',s:'0',p:'—',st:'Disponible'}
    ],
    incidents: [
      {id:'CS-0231',ship:'TR3-260729-EUAL-08744',type:'Mercancía dañada',when:'25 jul · 10:12',st:'En revisión'},
      {id:'CS-0230',ship:'TR3-260729-RDPC-08790',type:'Intento de entrega fallido',when:'24 jul · 16:40',st:'Reprogramado'}
    ]
  ,
    drv: {
      title:'Conductores', sub:'Registro de conductores, documentos, vehículo asignado, turnos y estado laboral.',
      searchPh:'Buscar por nombre, identificador o vehículo', filters:['Todos','Activos','En ruta','Disponibles','Suspendidos','Documentos por vencer'],
      counted:'coincidencias', empty:'Ningún conductor coincide con los filtros seleccionados.', emptyHint:'Cambie el filtro o borre el término de búsqueda.',
      cols:['Conductor','Identificador','Vehículo','Base','Turno','Documentos','Estado','Acciones'],
      view:'Ver perfil', newDriver:'Registrar conductor', backList:'Volver al listado',
      states:{active:'Activo',route:'En ruta',available:'Disponible',suspended:'Suspendido',offduty:'Fuera de turno'},
      docState:{ok:'Vigente',soon:'Por vencer',expired:'Vencido',missing:'Falta'},
      tabs:['Perfil','Documentos','Vehículo','Turnos','Suspensión'],
      profileT:'Datos del conductor', profileNote:'La identidad se verifica en la app del conductor. Aquí solo se consulta el resultado.',
      fields:{name:'Nombre completo',id:'Identificador interno',idType:'Tipo de identificación',idNum:'Identificación',phone:'Teléfono',email:'Correo',hub:'Base de operación',hired:'Fecha de ingreso',contract:'Tipo de contrato',emergency:'Contacto de emergencia'},
      identityT:'Verificación de identidad', identityState:'Verificada', identityBy:'Revisada por', identityWhen:'Fecha de revisión', identityMasked:'Solo se muestran los últimos cuatro dígitos.',
      docsT:'Documentos del conductor', docsNote:'Los archivos se almacenan cifrados. La descarga queda registrada en auditoría.',
      docCols:['Documento','Número','Emitido','Vence','Estado','Acciones'],
      docs:[
        {n:'Licencia de conducir',num:'PR-4471882',iss:'14 mar, 2024',exp:'14 mar, 2028',st:'ok'},
        {n:'Identificación oficial',num:'•••• 4821',iss:'10 ene, 2024',exp:'10 ene, 2030',st:'ok'},
        {n:'Certificado médico',num:'MED-2026-118',iss:'02 feb, 2026',exp:'02 feb, 2027',st:'ok'},
        {n:'Antecedentes penales',num:'BG-2026-441',iss:'18 ene, 2026',exp:'18 ene, 2027',st:'ok'},
        {n:'Capacitación de manejo de carga',num:'TR-0912',iss:'20 abr, 2026',exp:'20 abr, 2027',st:'ok'},
        {n:'Protocolo de incidencias',num:'—',iss:'—',exp:'—',st:'missing'}
      ],
      vehicleT:'Vehículo asignado', vehicleNote:'La inspección preoperacional se registra en la app del conductor antes de iniciar el turno.',
      vehicle:{unit:'Van 04',plate:'PR-8842',type:'Furgón refrigerado',year:'2023',capacity:'1 200 kg · 14 m³',odometer:'——',insurance:'POL-99412 · vence 02 sep, 2026',inspection:'INSP-2026-04 · vence 18 ago, 2026',maintenance:'——'},
      vehicleFields:{unit:'Unidad',plate:'Placa',type:'Tipo',year:'Año',capacity:'Capacidad',odometer:'Odómetro',insurance:'Seguro',inspection:'Inspección',maintenance:'Próximo mantenimiento'},
      shiftsT:'Turnos y actividad', shiftsNote:'Las horas provienen del control de turno; los totales los aprueba operaciones.',
      shiftCols:['Fecha','Turno','Entrada','Salida','Horas','Ruta','Estado'],
      shifts:[
        {d:'27 jul, 2026',w:'06:00–14:00',in:'05:52',out:'——',h:'——',route:'RT-2607-A',st:'route'},
        {d:'26 jul, 2026',w:'06:00–14:00',in:'05:58',out:'14:12',h:'8.2',route:'RT-2606-A',st:'closed'},
        {d:'25 jul, 2026',w:'06:00–14:00',in:'06:04',out:'13:48',h:'7.7',route:'RT-2605-B',st:'closed'},
        {d:'24 jul, 2026',w:'—',in:'—',out:'—',h:'—',route:'—',st:'off'}
      ],
      shiftStates:{route:'En curso',closed:'Cerrado',off:'Día libre',review:'En revisión'},
      shiftTotals:[{l:'Horas del periodo',v:'——'},{l:'Horas aprobadas',v:'——'},{l:'Horas en revisión',v:'——'},{l:'Paradas completadas',v:'——'}],
      suspendT:'Suspensión y estado laboral', suspendNote:'Suspender bloquea el inicio de turno y la asignación de rutas. La acción requiere motivo y queda en auditoría.',
      suspendReasonT:'Motivo de la suspensión',
      suspendReasons:['Documento vencido','Incidencia en investigación','Incumplimiento de protocolo','Solicitud del conductor','Falta de disponibilidad','Vehículo no disponible','Verificación de identidad pendiente','Decisión de recursos humanos'],
      suspendUntil:'Vigente hasta', suspendNotes:'Notas para el expediente', suspendNotesPh:'Contexto que quedará en el registro',
      suspendBtn:'Suspender conductor', reinstateBtn:'Reactivar conductor',
      suspendDone:'Conductor suspendido. El cambio queda en auditoría y no persiste sin el servicio de personal.',
      reinstateDone:'Conductor reactivado. El cambio queda en auditoría y no persiste sin el servicio de personal.',
      suspendNeedsReason:'Elija un motivo de suspensión.',
      historyT:'Historial laboral',
      history:[
        {t:'Reactivación tras vencimiento de licencia',m:'12 may, 2026 · Recursos humanos'},
        {t:'Suspensión por documento vencido',m:'28 abr, 2026 · Cumplimiento'},
        {t:'Alta como conductor',m:'14 mar, 2024 · Recursos humanos'}
      ],
      rows:[
        {n:'E. Rivera',id:'DRV-0412',v:'Van 04 · PR-8842',hub:'Hub San Juan',shift:'06:00–14:00',doc:'ok',st:'route'},
        {n:'J. Mejía',id:'DRV-0418',v:'Van 07 · PR-9104',hub:'Hub San Juan',shift:'06:00–14:00',doc:'soon',st:'route'},
        {n:'A. Castillo',id:'DRV-0423',v:'Van 09 · PR-7719',hub:'Hub Caguas',shift:'14:00–22:00',doc:'ok',st:'active'},
        {n:'P. Rivas',id:'DRV-0431',v:'Van 11 · PR-6620',hub:'Hub Caguas',shift:'—',doc:'ok',st:'available'},
        {n:'M. Solano',id:'DRV-0437',v:'—',hub:'Hub Santo Domingo',shift:'—',doc:'expired',st:'suspended'},
        {n:'R. Núñez',id:'DRV-0442',v:'Van 15 · RD-2284',hub:'Hub Santo Domingo',shift:'08:00–16:00',doc:'ok',st:'offduty'}
      ],
      pending:'El registro y la baja de conductores requieren el servicio de personal. Los cambios de esta pantalla no persisten.'
    },
    inc: {
      title:'Incidencias', sub:'Casos abiertos con tipo, severidad, evidencia, responsable de investigación, costos y resolución.',
      searchPh:'Buscar por caso, envío o conductor', filters:['Todas','Abiertas','En investigación','Severidad alta','Con costo','Cerradas'],
      counted:'coincidencias', empty:'Ninguna incidencia coincide con los filtros seleccionados.', emptyHint:'Cambie el filtro o borre el término de búsqueda.',
      cols:['Caso','Envío','Tipo','Severidad','Reportado','Investigador','Estado','Acciones'],
      view:'Ver caso', newCase:'Abrir caso', backList:'Volver al listado',
      sev:{low:'Baja',med:'Media',high:'Alta',critical:'Crítica'},
      states:{open:'Abierta',investigating:'En investigación',pending:'Esperando información',resolved:'Resuelta',closed:'Cerrada',rejected:'Rechazada'},
      tabs:['Detalle','Evidencia','Investigación','Costos','Resolución'],
      detailT:'Detalle del caso',
      fields:{id:'Caso',ship:'Envío',type:'Tipo',sev:'Severidad',when:'Reportado',by:'Reportado por',driver:'Conductor',vehicle:'Vehículo',route:'Ruta',stop:'Parada',place:'Lugar',desc:'Descripción'},
      types:['Mercancía dañada','Pieza faltante','Intento de entrega fallido','Problema de dirección','Retraso','Accidente de tránsito','Robo o pérdida','Falla del vehículo','Incumplimiento de protocolo'],
      descVal:'El paquete llegó con la caja abierta y el contenido desplazado. El receptor rechazó la entrega y el conductor documentó el estado en el sitio.',
      safetyT:'Seguridad y terceros',
      safety:[{l:'Personas lesionadas',v:'No'},{l:'Intervención policial',v:'No'},{l:'Reporte a seguro',v:'Pendiente'},{l:'Terceros involucrados',v:'No'}],
      evidenceT:'Evidencia del caso', evidenceNote:'La evidencia proviene de la app del conductor y del expediente de entrega. Es de solo anexado.',
      evidence:[
        {n:'Foto del daño',src:'App del conductor',st:'ok'},
        {n:'Foto del paquete en el lugar',src:'Expediente de entrega',st:'ok'},
        {n:'Firma del receptor',src:'Expediente de entrega',st:'missing'},
        {n:'Ubicación y hora',src:'Amazon Location',st:'ok'},
        {n:'Video del incidente',src:'—',st:'missing'}
      ],
      evCols:['Elemento','Origen','Estado'],
      evStates:{ok:'Disponible',missing:'No capturada',restricted:'Restringida'},
      investT:'Investigación', investNote:'Cada actualización queda registrada con autor y fecha. El historial es de solo anexado.',
      investFields:{owner:'Investigador asignado',opened:'Apertura',due:'Compromiso de respuesta',contact:'Contacto del cliente',finding:'Hallazgo preliminar'},
      investVals:{owner:'C. Méndez · Operaciones',opened:'25 jul, 2026 · 10:12',due:'28 jul, 2026',contact:'Notificado el 25 jul, 2026',finding:'El embalaje no cumplía el estándar para carga apilada.'},
      timelineT:'Actividad del caso',
      timeline:[
        {t:'Evidencia recibida de la app del conductor',m:'25 jul, 2026 · 10:14 · E. Rivera'},
        {t:'Caso asignado a investigación',m:'25 jul, 2026 · 10:40 · Operaciones'},
        {t:'Cliente notificado',m:'25 jul, 2026 · 11:05 · Soporte'},
        {t:'Hallazgo preliminar registrado',m:'26 jul, 2026 · 09:20 · C. Méndez'}
      ],
      costT:'Costos del caso', costNote:'Los montos son de referencia. Los reembolsos y créditos requieren aprobación y no se emiten desde esta pantalla.',
      costCols:['Concepto','Responsable','Monto','Estado'],
      costs:[
        {n:'Valor declarado de la mercancía',who:'Seguro',v:'——',st:'pending'},
        {n:'Reenvío del pedido',who:'TR3SLOG',v:'——',st:'pending'},
        {n:'Crédito al cliente',who:'Finanzas',v:'——',st:'blocked'},
        {n:'Deducible del seguro',who:'TR3SLOG',v:'——',st:'pending'}
      ],
      costStates:{pending:'Por determinar',approved:'Aprobado',blocked:'Requiere aprobación',rejected:'Rechazado'},
      costTotals:[{l:'Costo estimado',v:'——'},{l:'Cubierto por seguro',v:'——'},{l:'Costo asumido',v:'——'}],
      resolT:'Resolución', resolNote:'Cerrar un caso no cierra la entrega ni emite pagos. La entrega se cierra con evidencia completa.',
      resolReasonT:'Resolución aplicada',
      resolOptions:['Reenvío del pedido','Crédito al cliente','Reembolso solicitado','Reclamo al seguro','Sin responsabilidad de TR3SLOG','Ajuste de proceso','Capacitación al conductor','Caso duplicado'],
      resolNotes:'Notas de cierre', resolNotesPh:'Explicación que quedará en el expediente',
      preventT:'Acción preventiva', preventPh:'Cambio de proceso o control derivado del caso',
      closeBtn:'Cerrar caso', reopenBtn:'Reabrir caso',
      closeDone:'Caso cerrado. La resolución queda en auditoría y no persiste sin el servicio de casos.',
      reopenDone:'Caso reabierto. El cambio queda en auditoría.',
      needsResolution:'Elija la resolución aplicada.',
      needsEvidence:'No se puede cerrar el caso: falta evidencia obligatoria.',
      rows:[
        {id:'CS-0231',ship:'TR3-260729-EUAL-08744',type:0,sev:'high',when:'25 jul · 10:12',owner:'C. Méndez',st:'investigating',cost:true},
        {id:'CS-0230',ship:'TR3-260729-RDPC-08790',type:2,sev:'med',when:'24 jul · 16:40',owner:'A. Rojas',st:'pending',cost:false},
        {id:'CS-0229',ship:'TR3-260729-PRSJ-08698',type:1,sev:'high',when:'23 jul · 09:05',owner:'C. Méndez',st:'investigating',cost:true},
        {id:'CS-0228',ship:'TR3-260729-EUAL-08651',type:4,sev:'low',when:'21 jul · 14:22',owner:'A. Rojas',st:'resolved',cost:false},
        {id:'CS-0227',ship:'TR3-260729-RDPC-08604',type:7,sev:'critical',when:'19 jul · 07:48',owner:'R. Vega',st:'closed',cost:true}
      ],
      pending:'La creación y el cierre formal de casos requieren el servicio de incidencias. Los cambios de esta pantalla no persisten.'
    }
  };
})();
