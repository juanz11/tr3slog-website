// Business portal (41–50) — Español
(function () {
  var root = window.TR3S_I18N = window.TR3S_I18N || {}; var d = root.es = root.es || {};
  d.biz = {
    shell: { portal:'Portal empresarial', company:'Comercial Bayamón LLC', account:'Cuenta BIZ-0241 · Administrador', signout:'Cerrar sesión', searchPh:'Buscar guía, ubicación o empleado', section:{ops:'Operación',finance:'Facturación',admin:'Administración'} },
    nav: { dash:'Panel', shipments:'Envíos', bulk:'Carga masiva', recurring:'Entregas recurrentes', locations:'Ubicaciones', team:'Equipo', roles:'Roles y permisos', reports:'Reportes', billing:'Cuenta de facturación', invoices:'Estados y facturas' },
    common: { export:'Exportar', pdf:'PDF', excel:'Excel', save:'Guardar', cancel:'Cancelar', confirm:'Confirmar', back:'Atrás', next:'Continuar', view:'Ver', download:'Descargar', add:'Agregar', invite:'Invitar', edit:'Editar', remove:'Quitar', pause:'Pausar', resume:'Reactivar', active:'Activo', inactive:'Inactivo', pending:'Pendiente', approved:'Aprobado', empty:'No hay datos para los filtros seleccionados.', loading:'Cargando…', required:'Complete los campos requeridos.', audit:'Registro de auditoría', lastUpdate:'Última actualización', restricted:'Acceso restringido para su rol.', savedOk:'Cambios guardados.', exportOk:'Exportación generada.' },
    dash: {
      title:'Resumen de la cuenta', period:'Julio 2026',
      kpis:[{l:'Envíos activos',v:'14'},{l:'Recogidos pendientes',v:'4'},{l:'Entregas en curso',v:'6'},{l:'Volumen mensual',v:'248'},{l:'Tasa de éxito',v:'97.6%'},{l:'Balance pendiente',v:'$1,343.00'}],
      perfT:'Resumen de desempeño',
      perf:[{l:'Tiempo promedio de entrega',v:'1.8 días'},{l:'Entregas fallidas',v:'3'},{l:'Reclamaciones abiertas',v:'1'}],
      invoicesT:'Facturas recientes', quickT:'Acciones rápidas',
      quick:['Crear envío','Carga masiva','Programar recogido','Ver reportes'],
      alertsT:'Alertas',
      alerts:[{t:'Factura próxima a vencer',d:'INV-1044 vence en 3 días · $1,025.00'},{t:'Dirección por validar',d:'2 ubicaciones sin instrucciones de entrega.'}]
    },
    ship: {
      title:'Envíos de la empresa', searchPh:'Buscar por número de guía',
      filters:{status:'Estado',location:'Ubicación',date:'Fecha',service:'Servicio',employee:'Empleado'},
      statuses:['Todos','En tránsito','En ruta','Entregados','Excepción'],
      cols:['Guía','Ruta','Servicio','Empleado','Estado','Evidencia'],
      bulkT:'Acciones en lote', bulk:['Exportar selección','Solicitar recogido','Descargar evidencias'],
      selected:'seleccionados', exception:'Excepción', evidence:'Ver evidencia',
      rows:[
        {id:'TR3-260729-PRSJ-08821',route:'Miami → San Juan',svc:'Consolidado',emp:'L. Ortiz',st:6,exc:false},
        {id:'TR3-260729-RDPC-08790',route:'San Juan → Ponce',svc:'Última milla',emp:'L. Ortiz',st:7,exc:false},
        {id:'TR3-260729-EUAL-08744',route:'Miami → Santo Domingo',svc:'Marítimo',emp:'R. Colón',st:8,exc:true},
        {id:'TR3-260729-EUAL-08702',route:'Bayamón → Caguas',svc:'Entrega local',emp:'R. Colón',st:0,exc:false},
        {id:'TR3-260729-PRSJ-08698',route:'Miami → Orlando',svc:'Carga terrestre',emp:'M. Díaz',st:8,exc:false}
      ]
    },
    bulk: {
      title:'Carga masiva de envíos', steps:['Archivo','Validación','Vista previa','Confirmación'],
      dropT:'Arrastre su archivo CSV o Excel', dropNote:'Máximo 500 filas por lote · .csv, .xlsx',
      template:'Descargar plantilla', file:'envios-julio.csv · 128 filas',
      validationT:'Validación de columnas y direcciones',
      checks:[{l:'Columnas requeridas',v:'12 / 12'},{l:'Direcciones validadas',v:'124 / 128'},{l:'Duplicados detectados',v:'2'},{l:'Filas con error',v:'4'}],
      errorsT:'Reporte de errores',
      errors:[{row:'Fila 18',msg:'Código postal no corresponde al municipio indicado.'},{row:'Fila 46',msg:'Guía duplicada dentro del mismo archivo.'},{row:'Fila 91',msg:'Falta el teléfono del destinatario.'},{row:'Fila 112',msg:'Peso declarado excede el límite del servicio.'}],
      downloadErrors:'Descargar reporte de errores',
      previewT:'Vista previa del lote', previewNote:'Los envíos no se crean hasta que confirme el lote.',
      cols:['Fila','Destinatario','Destino','Servicio','Peso','Estado'],
      preview:[
        {r:'1',to:'Farmacia Del Valle',dest:'San Juan, PR',svc:'Última milla',w:'12 lbs',ok:true},
        {r:'2',to:'Tienda Caguas Centro',dest:'Caguas, PR',svc:'Entrega local',w:'34 lbs',ok:true},
        {r:'18',to:'Colmado La Loma',dest:'Ponce, PR',svc:'Entrega local',w:'8 lbs',ok:false},
        {r:'46',to:'E-shop Isla Verde',dest:'Carolina, PR',svc:'Última milla',w:'22 lbs',ok:false}
      ],
      confirmBtn:'Confirmar lote', confirmed:'Lote confirmado. 124 envíos creados y 4 filas excluidas.',
      historyT:'Historial de cargas',
      history:[{f:'envios-junio.csv',d:'30 jun, 2026',n:'211 envíos',st:'Completado'},{f:'envios-mayo.csv',d:'31 may, 2026',n:'186 envíos',st:'Completado'}]
    },
    rec: {
      title:'Entregas recurrentes', create:'Crear recurrencia',
      freqT:'Frecuencia', freq:['Diaria','Semanal','Bisemanal','Mensual'],
      f:{pickup:'Ubicación de recogido',dest:'Ubicaciones de entrega',svc:'Tipo de servicio',window:'Ventana preferida',contact:'Contacto asignado'},
      cols:['Programa','Frecuencia','Origen','Destinos','Ventana','Estado'],
      rows:[
        {id:'RC-014',freq:'Semanal · Lun',from:'Almacén Bayamón Sur',to:'4 tiendas',w:'08:00 – 11:00',st:'Activo'},
        {id:'RC-011',freq:'Diaria',from:'Centro Miami',to:'Hub San Juan',w:'14:00 – 17:00',st:'Activo'},
        {id:'RC-008',freq:'Mensual · día 1',from:'Oficina Caguas',to:'2 ubicaciones',w:'11:00 – 14:00',st:'Pausado'}
      ],
      historyT:'Historial de ejecuciones',
      history:[{d:'21 jul, 2026',n:'RC-014 · 4 entregas',st:'Completado'},{d:'14 jul, 2026',n:'RC-014 · 4 entregas',st:'Completado'},{d:'07 jul, 2026',n:'RC-014 · 3 entregas · 1 fallida',st:'Con excepción'}]
    },
    loc: {
      title:'Ubicaciones de la empresa', add:'Agregar ubicación',
      types:['Tienda','Almacén','Oficina','Centro de recogido','Facturación'],
      cols:['Ubicación','Tipo','Contacto','Horario','Estado'],
      instructionsT:'Instrucciones de entrega',
      rows:[
        {n:'Almacén Bayamón Sur',type:1,addr:'Carr. 167 Km 4.2, Bayamón',c:'R. Colón · +1 787 555 0142',h:'Lun – Sáb · 7:00 – 17:00',active:true,ins:'Entregar en muelle posterior.'},
        {n:'Tienda Caguas Centro',type:0,addr:'Calle Betances 88, Caguas',c:'M. Díaz · +1 787 555 0177',h:'Lun – Dom · 9:00 – 20:00',active:true,ins:'Coordinar con supervisor de turno.'},
        {n:'Oficina San Juan',type:2,addr:'Ave. Roosevelt 1204, San Juan',c:'L. Ortiz · +1 787 555 0118',h:'Lun – Vie · 8:00 – 18:00',active:true,ins:'Recepción en el segundo piso.'},
        {n:'Centro Miami',type:3,addr:'1234 Logistics Way, Miami, FL',c:'J. Pérez · +1 786 555 0102',h:'Lun – Vie · 8:00 – 19:00',active:false,ins:'Sin instrucciones registradas.'}
      ]
    },
    team: {
      title:'Equipo de la empresa', invite:'Invitar empleado',
      roles:['Propietario','Administrador','Gerente de envíos','Gerente de facturación','Consulta'],
      cols:['Empleado','Rol','Ubicación','Último acceso','Estado'],
      f:{email:'Correo del empleado',role:'Rol',loc:'Ubicación asignada',finance:'Restringir acceso financiero',ship:'Restringir acceso a envíos'},
      suspend:'Suspender', reactivate:'Reactivar', removeAccess:'Quitar acceso',
      invited:'Invitación enviada.',
      rows:[
        {n:'Lourdes Ortiz',e:'l.ortiz@bayamon.com',role:0,loc:'Oficina San Juan',last:'Hoy · 09:42',st:'Activo'},
        {n:'Rafael Colón',e:'r.colon@bayamon.com',role:2,loc:'Almacén Bayamón Sur',last:'Hoy · 08:10',st:'Activo'},
        {n:'María Díaz',e:'m.diaz@bayamon.com',role:3,loc:'Tienda Caguas Centro',last:'Ayer · 17:26',st:'Activo'},
        {n:'Jorge Pérez',e:'j.perez@bayamon.com',role:4,loc:'Centro Miami',last:'12 jul · 11:04',st:'Suspendido'}
      ]
    },
    perm: {
      title:'Roles y permisos', note:'Los cambios de permisos quedan registrados en el historial de auditoría de la cuenta.',
      items:['Crear envío','Aprobar envío','Ver rastreo','Administrar ubicaciones','Ver facturas','Realizar pagos','Exportar reportes','Administrar equipo','Enviar reclamaciones','Acceder a integraciones'],
      matrix:[
        [1,1,1,1,1,1,1,1,1,1],
        [1,1,1,1,1,1,1,1,1,1],
        [1,1,1,1,0,0,1,0,1,0],
        [0,0,1,0,1,1,1,0,1,0],
        [0,0,1,0,0,0,0,0,0,0]
      ],
      allowed:'Permitido', denied:'Sin acceso'
    },
    rep: {
      title:'Reportes de la empresa', period:'Periodo', periods:['Últimos 30 días','Trimestre actual','Año en curso'],
      cards:[
        {l:'Volumen de envíos',v:'248',n:'+18% vs. periodo anterior'},
        {l:'Costo del periodo',v:'$18,420',n:'promedio $74.28 por envío'},
        {l:'Costo por ubicación',v:'4 ubicaciones',n:'mayor: Almacén Bayamón Sur'},
        {l:'Desempeño de entrega',v:'97.6%',n:'objetivo 95%'},
        {l:'Entregas fallidas',v:'3',n:'2 reprogramadas · 1 devuelta'},
        {l:'Tiempo promedio',v:'1.8 días',n:'de recogido a entrega'},
        {l:'Uso por servicio',v:'6 servicios',n:'mayor uso: última milla'},
        {l:'Reclamaciones e incidencias',v:'1',n:'en revisión'},
        {l:'Desempeño por ruta',v:'12 rutas',n:'visible según permisos'}
      ],
      exportT:'Exportación', exportNote:'La exportación respeta los permisos de su rol.'
    },
    bill: {
      title:'Cuenta de facturación',
      profileT:'Perfil de facturación', contactsT:'Contactos de facturación', methodT:'Método de pago',
      termsT:'Términos de pago', creditT:'Límite de crédito', balanceT:'Balance pendiente',
      statementsT:'Estados de cuenta', taxT:'Información fiscal', autopayT:'Pago automático', notifT:'Notificaciones de facturación',
      f:{legal:'Razón social',ein:'EIN / RNC',address:'Dirección de facturación',email:'Correo de facturación',phone:'Teléfono'},
      values:{legal:'Comercial Bayamón LLC',ein:'66-0421887',address:'Carr. 167 Km 4.2, Bayamón, PR 00961',email:'facturacion@bayamon.com',phone:'+1 787 555 0118'},
      contacts:[{n:'María Díaz',r:'Gerente de facturación',e:'m.diaz@bayamon.com'},{n:'Lourdes Ortiz',r:'Propietaria',e:'l.ortiz@bayamon.com'}],
      method:'Tarjeta terminada en 4242 · Vence 09/2028', terms:'Neto 30 días', credit:'$25,000.00', balance:'$1,343.00',
      autopayOn:'Cargo automático al vencimiento', autopayOff:'Pago manual',
      notifs:['Nueva factura emitida','Recordatorio de vencimiento','Pago recibido','Cargo disputado'],
      taxNote:'Los documentos fiscales se emiten según la jurisdicción de cada operación.'
    },
    inv: {
      title:'Estados, facturas y recibos',
      periodT:'Periodo del estado', periods:['Julio 2026','Junio 2026','Mayo 2026'],
      cols:['Documento','Envío','Emitida','Monto','Estado',''],
      tabs:['Facturas','Créditos','Ajustes','Reembolsos','Disputas'],
      statuses:{paid:'Pagada',pending:'Pendiente',overdue:'Vencida',credit:'Crédito',adjust:'Ajuste',refund:'Reembolsada',disputed:'En disputa'},
      pay:'Pagar', receipt:'Recibo', invoice:'Factura', statement:'Descargar estado',
      dispute:'Disputar cargo', disputed:'Cargo marcado en disputa.',
      rows:[
        {id:'INV-1044',ship:'TR3-260729-PRSJ-08821',d:'24 jul, 2026',a:'$1,025.00',st:'pending',tab:0},
        {id:'INV-1043',ship:'TR3-260729-RDPC-08790',d:'21 jul, 2026',a:'$318.00',st:'overdue',tab:0},
        {id:'INV-1042',ship:'TR3-260729-EUAL-08744',d:'14 jul, 2026',a:'$1,240.00',st:'paid',tab:0},
        {id:'CR-0112',ship:'TR3-260729-PRSJ-08698',d:'12 jul, 2026',a:'-$85.00',st:'credit',tab:1},
        {id:'AJ-0090',ship:'TR3-260729-EUAL-08744',d:'10 jul, 2026',a:'-$45.00',st:'adjust',tab:2},
        {id:'RF-0031',ship:'TR3-260729-EUAL-08621',d:'02 jul, 2026',a:'$210.00',st:'refund',tab:3},
        {id:'INV-1039',ship:'TR3-260729-PRSJ-08590',d:'28 jun, 2026',a:'$96.00',st:'disputed',tab:4}
      ]
    }
  };
})();
