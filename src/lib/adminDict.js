export default {
  es: {
    label: 'Español',
    adm: {
      shell: {
        portal: 'Portal Administrativo',
        account: 'admin@tr3slog.com',
        searchPh: 'Buscar por código, estado o destinatario…',
        demo: 'Modo demostración',
        roleT: 'Rol activo',
        signout: 'Cerrar sesión',
        states: { data: 'Datos', loading: 'Cargando', empty: 'Vacío', error: 'Error', offline: 'Offline' },
        roles: {
          sysadmin: 'SysAdmin',
          secadmin: 'Seguridad',
          compliance: 'Cumplimiento',
          opsmgr: 'Operaciones',
          finance: 'Finanzas',
          support: 'Soporte'
        },
        section: { platform: 'Plataforma', access: 'Acceso', system: 'Sistema' }
      },
      common: {
        search: 'Buscar',
        restricted: 'Información restringida',
        deniedT: 'Acceso denegado',
        deniedHint: 'Tu rol actual no tiene permiso para ver esta sección. Contacta al administrador del sistema.',
        view: 'Ver',
        download: 'Descargar',
        save: 'Guardar',
        cancel: 'Cancelar',
        active: 'Activo',
        inactive: 'Inactivo',
        empty: 'Sin registros',
        emptyHint: 'No se encontraron elementos para esta vista.',
        errorT: 'No se pudieron cargar los datos',
        errorHint: 'Hubo un problema al consultar la información.',
        retry: 'Reintentar',
        filters: 'Filtros',
        required: 'Completa los campos obligatorios.',
        savedRecords: 'Registros guardados',
        removed: 'Eliminado',
        exported: 'Exportado',
        offlineT: 'Conexión perdida',
        offlineHint: 'Los datos pueden estar desactualizados.',
        scanDuplicate: 'Duplicado',
        scanUnknown: 'No encontrado'
      },
      nav: {
        adash: 'Dashboard',
        users: 'Usuarios',
        roles: 'Roles',
        audit: 'Auditoría',
        integr: 'Integraciones',
        flags: 'Banderas',
        keys: 'Claves API',
        maint: 'Mantenimiento'
      },
      adash: {
        title: 'Dashboard de Operaciones',
        sub: 'Vista general del estado de la plataforma, envíos activos y alertas del día.',
        stats: [
          { k: 'Envíos activos', v: '1,247', d: '+12% vs ayer' },
          { k: 'Entregas hoy', v: '843', d: 'Meta: 1,100' },
          { k: 'Incidentes abiertos', v: '17', d: '3 críticos' }
        ],
        filters: ['Todos', 'Entregado', 'En tránsito', 'Retrasado', 'Cancelado'],
        health: {
          t: 'Salud de servicios',
          exp: true,
          cols: ['Servicio', 'Latencia', 'Último check', 'Estado'],
          rows: [
            { c: ['API de envíos', '42 ms', 'hace 1 min'], pill: 'OK', st: 'ok' },
            { c: ['Notificaciones push', '128 ms', 'hace 2 min'], pill: 'OK', st: 'ok' },
            { c: ['Geocodificación', '312 ms', 'hace 5 min'], pill: 'Lento', st: 'warn' },
            { c: ['Webhook de clientes', '—', 'hace 15 min'], pill: 'Caído', st: 'bad' }
          ]
        },
        activity: {
          t: 'Actividad reciente',
          exp: true,
          cols: ['Hora', 'Usuario', 'Acción', 'Recurso'],
          rows: [
            { c: ['10:42', 'admin', 'Actualizó rol', 'operaciones@tr3slog.com'], pill: 'Roles', st: 'info' },
            { c: ['10:15', 'soporte', 'Escaló ticket', '#4829'], pill: 'Soporte', st: 'info' },
            { c: ['09:58', 'sysadmin', 'Reinició servicio', 'geocoder'], pill: 'Mtto', st: 'warn' }
          ]
        },
        note: 'Los datos mostrados son de demostración. Conecta el backend para reemplazarlos con información real.'
      },
      users: {
        title: 'Gestión de Usuarios',
        sub: 'Crea, edita y audita cuentas de la plataforma.',
        filters: ['Todos', 'Admin', 'Cliente', 'Conductor'],
        list: {
          t: 'Usuarios registrados',
          exp: true,
          cols: ['ID', 'Nombre', 'Email', 'Rol'],
          rows: [
            { c: ['U-101', 'Ana Pérez', 'ana@tr3slog.com', 'Operaciones'], pill: 'Activo', st: 'ok' },
            { c: ['U-102', 'Luis Gómez', 'luis@cliente.com', 'Cliente'], pill: 'Pendiente', st: 'warn' },
            { c: ['U-103', 'Marco Ruiz', 'marco@driver.com', 'Conductor'], pill: 'Activo', st: 'ok' }
          ]
        },
        form: {
          t: 'Nuevo usuario',
          submit: 'Crear usuario',
          ok: 'Usuario creado',
          fields: [
            { l: 'Nombre completo', ph: 'Ej. Ana Pérez', span: 1 },
            { l: 'Correo electrónico', ph: 'ana@tr3slog.com', span: 1 },
            { l: 'Rol', ph: 'Selecciona un rol', span: 1 },
            { l: 'Teléfono', ph: '+1 555 123 4567', span: 1 }
          ]
        },
        toggles: {
          t: 'Preferencias de acceso',
          items: [
            { k: 'Autenticación de dos factores obligatoria', on: true },
            { k: 'Bloquear sesiones fuera de la oficina', on: false }
          ]
        },
        note: 'Los cambios en usuarios se registran automáticamente en auditoría.'
      }
    }
  }
};
