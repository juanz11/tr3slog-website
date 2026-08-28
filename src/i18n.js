export const es = {
  label: 'ES',
  name: 'Español',
  common: {
    signin: 'Iniciar sesión',
    dashboard: 'Dashboard',
    quote: 'Solicitar cotización',
    viewAll: 'Ver todos',
    explore: 'Explorar',
    close: 'Cerrar',
    loading: 'Buscando…',
    required: 'Este campo es obligatorio',
    invalidEmail: 'Email no válido',
    placeholderNote: 'Cifras de demostración — se reemplazarán con datos reales.',
  },
  nav: {
    home: 'Inicio',
    services: 'Servicios',
    track: 'Rastrear',
    coverage: 'Cobertura',
    about: 'Nosotros',
    contact: 'Contacto',
    quote: 'Cotizar',
    pickup: 'Recogida',
    how: 'Cómo funciona',
    faq: 'Preguntas',
  },
  home: {
    eyebrow: 'Logística inteligente',
    title: 'Logística que llega, tecnología que prueba',
    sub: 'Desde San Juan hasta el Caribe: transportamos tu carga con trazabilidad total, evidencia fotográfica y confirmación firmada en cada entrega.',
    trackTitle: 'Rastrea tu envío',
    trackPh: 'TR3-260729-PRSJ-08821',
    trackBtn: 'Rastrear',
    quoteBtn: 'Cotizar',
    svcEyebrow: 'Servicios',
    svcTitle: 'Soluciones logísticas integrales',
    svcSub: 'Cobertura terrestre, marítima y aérea con tecnología de trazabilidad en tiempo real.',
    howEyebrow: 'Proceso',
    howTitle: 'Cómo funciona',
    covEyebrow: 'Cobertura',
    covTitle: 'Red logística regional',
    segEyebrow: 'Sectores',
    segTitle: 'Industrias que servimos',
    seg: [
      { t: 'Farmacéutico', d: 'Cadena de frío, control de temperatura y evidencia de entrega certificada.' },
      { t: 'Retail', d: 'Distribución a tiendas con ventanas horarias y confirmación electrónica.' },
      { t: 'E-commerce', d: 'Última milla con notificaciones al cliente y prueba de entrega.' },
      { t: 'Industrial', d: 'Carga pesada, maquinaria y repuestos con planificación dedicada.' },
    ],
    techEyebrow: 'Tecnología',
    techTitle: 'Plataforma impulsada por tecnología',
    tech: [
      'Trazabilidad GPS en tiempo real',
      'Evidencia fotográfica de entrega',
      'Firma electrónica del receptor',
      'API de integración con tu ERP',
      'Notificaciones SMS y WhatsApp',
      'Panel de control y reportes',
    ],
    trust: [
      'Países atendidos',
      'Entregas con prueba',
      'Tiempo promedio de respuesta',
      'Conductores activos',
    ],
    ctaTitle: '¿Listo para enviar con TR3SLOG?',
    ctaSub: 'Solicita una cotización personalizada o programa una recogida en minutos.',
    ctaBtn1: 'Solicitar cotización',
    ctaBtn2: 'Contáctanos',
  },
  svc: {
    title: 'Servicios de logística',
    sub: 'Soluciones de transporte y distribución con tecnología de trazabilidad total.',
    items: [
      { t: 'Transporte terrestre', d: 'Distribución regional con flotilla propia y conductores verificados.', b: ['Carga seca y refrigerada', 'Cobertura interurbana', 'GPS en tiempo real'] },
      { t: 'Carga marítima', d: 'Contenedores FCL/LCL con coordinación puerta a puerta.', b: ['FCL y LCL', 'Consolidación de carga', 'Despacho aduanero'] },
      { t: 'Envío aéreo', d: 'Entrega urgente con vuelos directos y manejo de prioridades.', b: ['Servicio express', 'Carga sensible', 'Seguro incluido'] },
      { t: 'Última milla', d: 'Entrega final al cliente con evidencia fotográfica y firma.', b: ['Ventanas horarias', 'Notificación al cliente', 'Prueba de entrega'] },
      { t: 'Almacenamiento', d: 'Bodegas equipadas con control de acceso y inventario digital.', b: ['Inventario en tiempo real', 'Pick and pack', 'Cross-docking'] },
      { t: 'Logística inversa', d: 'Gestión de devoluciones y retiros con trazabilidad completa.', b: ['Recolección de devoluciones', 'Verificación de estado', 'Reingreso a inventario'] },
    ],
  },
  trk: {
    title: 'Rastrea tu envío',
    sub: 'Ingresa tu número de guía para ver el estado, ubicación y evidencia de entrega.',
    ph: 'TR3-260729-PRSJ-08821',
    guide: 'Número de guía',
    btn: 'Rastrear',
    errEmpty: 'Ingresa un número de guía',
    errFormat: 'Formato no válido. Ejemplo: TR3-260729-PRSJ-08821',
    empty: 'Ingresa un número de guía para ver el detalle de tu envío.',
    status: 'Estado',
    statusVal: 'En tránsito',
    location: 'Ubicación actual',
    locationVal: 'Centro de distribución San Juan',
    eta: 'Entrega estimada',
    etaVal: '30 Jul, 4:30 PM',
    service: 'Servicio',
    serviceVal: 'Transporte terrestre',
    created: 'Creado',
    timelineTitle: 'Línea de tiempo',
    proofTitle: 'Evidencia de entrega',
    proofPhoto: 'Foto de entrega',
    proofSign: 'Firma del receptor',
    proofDoc: 'Documento de entrega',
    proofPending: 'Pendiente',
    timeline: [
      { label: 'Orden recibida', time: '27 Jul, 8:00 AM', place: 'Sistema' },
      { label: 'Recolectado', time: '27 Jul, 9:15 AM', place: 'Almacén origen' },
      { label: 'En tránsito', time: '28 Jul, 6:00 AM', place: 'Carretera PR-52' },
      { label: 'En centro de distribución', time: '29 Jul, 2:00 PM', place: 'San Juan, PR' },
      { label: 'Entregado', time: '—', place: '—' },
    ],
  },
  quo: {
    title: 'Solicita una cotización',
    sub: 'Completa los datos y recibe una propuesta personalizada en menos de 24 horas.',
    toast: '¡Cotización enviada! Te contactaremos pronto.',
    sent: '✓ Enviado',
    btn: 'Enviar solicitud',
    signIn: 'Inicia sesión para cotizar',
    signInSub: 'Regístrate o inicia sesión para enviar tu solicitud y guardar el historial.',
    signInBtn: 'Iniciar sesión / Registrarse',
    types: ['Terrestre', 'Marítimo', 'Aéreo', 'Última milla', 'Almacenamiento'],
    f: {
      origin: 'Origen',
      originPh: 'Ciudad de origen',
      dest: 'Destino',
      destPh: 'Ciudad de destino',
      type: 'Tipo de servicio',
      weight: 'Peso (kg)',
      weightPh: 'Ej. 250',
      dims: 'Dimensiones (cm)',
      dimsPh: 'L × A × H',
      pieces: 'Número de piezas',
      piecesPh: 'Ej. 12',
      name: 'Nombre',
      namePh: 'Tu nombre completo',
      email: 'Email',
      emailPh: 'tucorreo@empresa.com',
      details: 'Detalles adicionales',
      detailsPh: 'Describe tu carga, requisitos especiales, etc.',
    },
    err: {
      pieces: 'Número de piezas: ingrese solo números.',
      dims: 'Dimensiones: use el formato L × A × H (ej. 10x20x30 cm).',
    },
  },
  pick: {
    title: 'Programar recogida',
    sub: 'Coordina la recolección de tu paquete con nuestro equipo.',
    toast: '¡Recogida programada! Confirmaremos por correo.',
    sent: '✓ Programada',
    btn: 'Programar recogida',
    f: {
      from: 'Dirección de recogida',
      fromPh: 'Dirección completa',
      to: 'Destino',
      toPh: 'Ciudad de destino',
      date: 'Fecha',
      time: 'Ventana horaria',
      contact: 'Contacto',
      contactPh: 'Nombre y teléfono',
      pkg: 'Descripción del paquete',
      pkgPh: 'Tipo, peso, dimensiones',
    },
    windows: ['Mañana 8-12', 'Tarde 1-5', 'Noche 6-9'],
  },
  cov: {
    title: 'Red de cobertura',
    sub: 'Operamos en el Caribe con expansión continua hacia nuevos mercados.',
    mapAlt: 'Mapa de cobertura',
    active: 'Operación activa',
    future: 'Próximamente',
    sub2: 'Cobertura regional con hubs estratégicos.',
    stats: [
      { v: '4', l: 'Países' },
      { v: '12+', l: 'Hubs logísticos' },
      { v: '98.7%', l: 'Entregas a tiempo' },
    ],
    rows: [
      { n: 'Puerto Rico', d: 'Cobertura completa en la isla con hubs en San Juan, Ponce y Mayagüez.', c: 'San Juan · Ponce · Mayagüez · Caguas · Bayamón' },
      { n: 'República Dominicana', d: 'Operación en Santo Domingo y Santiago con expansión a zonas turísticas.', c: 'Santo Domingo · Santiago · Punta Cana' },
      { n: 'Estados Unidos', d: 'Conexión con Florida y Nueva York para importación y exportación.', c: 'Miami · Orlando · Nueva York', regions: { 'Miami': 'Florida', 'Orlando': 'Florida', 'Nueva York': 'Nueva York' } },
      { n: 'Venezuela', d: 'Próxima apertura de operaciones en Caracas y Valencia.', c: 'Caracas · Valencia', regions: { 'Caracas': 'Distrito Capital', 'Valencia': 'Carabobo' } },
    ],
    ctaT: '¿Tu zona no está en la lista?',
    ctaSub: 'Contáctanos para evaluar cobertura a medida.',
  },
  how: {
    title: 'Cómo funciona',
    sub: 'Cuatro pasos simples para enviar tu carga con total trazabilidad.',
    steps: [
      { t: 'Solicita', d: 'Pide una cotización o programa una recogida desde la web o la app.' },
      { t: 'Recolectamos', d: 'Nuestro conductor llega a la dirección indicada y escanea tu carga.' },
      { t: 'Transportamos', d: 'Seguimiento GPS en tiempo real con actualizaciones automáticas.' },
      { t: 'Entregamos', d: 'Confirmación con foto, firma y notificación al destinatario.' },
    ],
  },
  about: {
    title: 'Sobre TR3SLOG',
    sub: 'Somos una empresa de logística regional con tecnología propia y enfoque en transparencia total.',
    missionT: 'Misión',
    missionB: 'Conectar el Caribe con logística confiable, trazable y transparente, impulsando el comercio regional con tecnología de punta.',
    promiseT: 'Promesa',
    promiseB: 'Cada entrega incluye evidencia fotográfica, firma del receptor y trazabilidad GPS de extremo a extremo.',
    valuesT: 'Nuestros valores',
    values: [
      { t: 'Transparencia', d: 'Visibilidad total en cada etapa del envío.' },
      { t: 'Confianza', d: 'Conductores verificados y procesos auditables.' },
      { t: 'Innovación', d: 'Tecnología propia con mejora continua.' },
      { t: 'Cercanía', d: 'Atención humana y soporte bilingüe.' },
    ],
    teamT: 'Equipo directivo',
    team: [
      { n: 'Carlos Méndez', r: 'CEO y Co-fundador' },
      { n: 'Ana Rivera', r: 'COO' },
      { n: 'Luis Torres', r: 'CTO' },
    ],
  },
  cont: {
    title: 'Contacto',
    sub: 'Estamos aquí para ayudarte con tu envío, cotización o cualquier consulta.',
    btn: 'Enviar mensaje',
    sent: '✓ Enviado',
    toast: '¡Mensaje enviado!',
    ref: 'Número de referencia',
    successNote: 'Un coordinador responde dentro del próximo día hábil.',
    phoneT: 'Teléfono',
    emailT: 'Email',
    waT: 'WhatsApp',
    hoursT: 'Horario',
    hours: 'Lun–Vie 8:00 AM – 6:00 PM\nSáb 9:00 AM – 1:00 PM',
    addressT: 'Dirección',
    address: '123 Calle Principal\nSan Juan, PR 00901',
    f: {
      name: 'Nombre',
      namePh: 'Tu nombre',
      email: 'Email',
      emailPh: 'tucorreo@email.com',
      subject: 'Asunto',
      subjectPh: '¿Sobre qué nos escribes?',
      msg: 'Mensaje',
      msgPh: 'Cuéntanos en qué podemos ayudarte…',
    },
  },
  faq: {
    title: 'Preguntas frecuentes',
    sub: 'Resolvemos las dudas más comunes sobre nuestros servicios.',
    groups: [
      {
        t: 'Envíos y rastreo',
        items: [
          { q: '¿Cómo rastreo mi envío?', a: 'Ingresa tu número de guía en la sección "Rastrear" o en la app del conductor. Verás ubicación, estado y evidencia de entrega.' },
          { q: '¿Qué incluye la evidencia de entrega?', a: 'Foto del paquete entregado, firma electrónica del receptor, fecha y hora con GPS.' },
        ],
      },
      {
        t: 'Cotizaciones y pagos',
        items: [
          { q: '¿Cómo solicito una cotización?', a: 'Completa el formulario en "Cotizar" con origen, destino y tipo de carga. Recibirás una propuesta en menos de 24 horas.' },
          { q: '¿Qué métodos de pago aceptan?', a: 'Transferencia bancaria, tarjeta de crédito y PayPal para clientes corporativos.' },
        ],
      },
      {
        t: 'Cobertura',
        items: [
          { q: '¿En qué países operan?', a: 'Actualmente en Puerto Rico, República Dominicana y Estados Unidos. Próximamente Venezuela.' },
          { q: '¿Hacen envíos a zonas remotas?', a: 'Sí, evaluamos cada caso. Contáctanos para verificar cobertura en tu zona.' },
        ],
      },
    ],
  },
  foot: {
    tagline: 'Logística regional con trazabilidad total. Transportamos tu carga con tecnología y transparencia.',
    colNav: 'Navegación',
    colServices: 'Servicios',
    colContact: 'Contacto',
    rights: '© 2025 TR3SLOG. Todos los derechos reservados.',
    privacy: 'Privacidad',
    terms: 'Términos',
  },
  legal: {
    privacy: {
      t: 'Política de privacidad',
      b: 'TR3SLOG recopila datos de envío, contacto y ubicación exclusivamente para prestar servicios logísticos. No compartimos información con terceros sin consentimiento. Puedes solicitar acceso, rectificación o eliminación de tus datos en cualquier momento.',
    },
    terms: {
      t: 'Términos y Condiciones de Servicio',
      b: `TR3SLOG · República Dominicana, Puerto Rico, Estados Unidos y Venezuela

Última actualización: 27 de agosto de 2026

Estos Términos y Condiciones ("Términos") rigen el uso de los servicios de logística, transporte, almacenaje y plataforma digital de TR3SLOG ("la Compañía", "nosotros") por parte de cualquier persona o empresa ("el Cliente", "usted") que cree una cuenta, solicite un envío o utilice nuestras aplicaciones web y móviles. Al registrarse o usar nuestros servicios, usted acepta estos Términos en su totalidad.

1. Territorio y cobertura
TR3SLOG opera actualmente en República Dominicana, Puerto Rico y Estados Unidos. La operación en Venezuela se encuentra en fase de preparación y no está disponible al público hasta su activación, la cual requiere aprobación ejecutiva expresa de la Compañía.

La disponibilidad de servicios, tarifas, monedas (USD, DOP, VES, EUR, CNY según corresponda) y tiempos de tránsito varía según el país de origen y destino, y está sujeta a las regulaciones aduaneras y de transporte de cada jurisdicción.

2. Cuentas y acceso
Existen distintos tipos de cuenta: cliente individual, cuenta empresarial, conductor y personal de operaciones. Cada cuenta se verifica por correo electrónico y teléfono antes de activarse. Las cuentas empresariales y de conductor requieren, además, revisión y aprobación por parte del equipo de Operaciones de TR3SLOG antes de obtener acceso completo.

Usted es responsable de mantener la confidencialidad de sus credenciales de acceso y de toda actividad realizada bajo su cuenta. Las cuentas empresariales pueden invitar colegas con roles específicos; cada invitado acepta y opera únicamente dentro del rol asignado.

3. Envíos permitidos y prohibidos
El Cliente declara que el contenido de cada envío es lícito y cumple con las leyes aduaneras y de transporte de los países de origen, tránsito y destino. Están prohibidos, entre otros: materiales peligrosos, armas, sustancias controladas, mercancía falsificada y cualquier artículo cuya importación o exportación esté restringida por ley.

TR3SLOG se reserva el derecho de inspeccionar, retener o rechazar cualquier envío que incumpla esta sección, sin responsabilidad por los costos derivados de dicho rechazo.

4. Tarifas, pagos y facturación
Las tarifas se calculan según peso, dimensiones, ruta y modalidad de servicio, y se muestran en la moneda seleccionada al momento de la cotización. El cobro se procesa según el método de pago registrado por el Cliente.

Los reembolsos y créditos por servicio no prestado o incidencias comprobadas requieren aprobación previa del equipo correspondiente; no se emiten de forma automática.

5. Responsabilidad y reclamaciones
TR3SLOG actúa con el cuidado razonable de un operador logístico profesional. Nuestra responsabilidad por pérdida, daño o retraso de un envío se limita al valor declarado por el Cliente al momento de la creación del envío, salvo que la ley aplicable disponga lo contrario.

Toda reclamación debe presentarse a través de los canales de soporte de la plataforma dentro de los plazos indicados en la confirmación de entrega. Las diferencias de inventario o contenido detectadas en almacén bloquean el despacho hasta su resolución.

6. Rastreo y privacidad
El rastreo de envíos y vehículos ocurre únicamente cuando existe una ruta y un turno activos; el Cliente puede ver el estado de su envío, pero en ningún caso puede ver la ubicación de la flota. El uso de datos de ubicación se rige por nuestras políticas de privacidad, retención de datos y control de acceso.

La geocerca de un punto de entrega es un dato de apoyo operativo y no constituye, por sí sola, el cierre de una entrega.

7. Servicios de terceros no implementados
Ciertas integraciones mostradas en la plataforma (marketplaces como Amazon, eBay, Etsy o Walmart, ciertas etiquetas de transportista, autenticación multifactor y servicios de flota en tiempo real de terceros) se encuentran en estado de planificación y no están activas. Ningún dato o función no implementada se presenta como disponible en producción.

8. Ley aplicable por jurisdicción
República Dominicana: estos Términos se interpretan conforme a las leyes de la República Dominicana para envíos originados o entregados en su territorio.

Puerto Rico: para envíos dentro de Puerto Rico se aplican, además, las leyes federales de los Estados Unidos que correspondan a servicios de transporte y comercio interestatal.

Estados Unidos: para envíos originados o entregados en territorio continental de EE. UU., rigen las leyes federales aplicables y las del estado de Florida, sede de nuestras oficinas principales.

Venezuela: mientras la operación permanezca en preparación, ninguna disposición de estos Términos habilita la prestación de servicios en dicho territorio; su activación futura estará sujeta a un anexo específico aprobado por la Compañía.

9. Resolución de disputas
Cualquier controversia se intentará resolver primero por vía directa con nuestro equipo de soporte. De no llegar a un acuerdo, la disputa se someterá a los tribunales competentes de la jurisdicción que corresponda al país donde se originó el envío o se prestó el servicio, según la sección 8.

10. Modificaciones a estos Términos
TR3SLOG puede actualizar estos Términos periódicamente. Notificaremos cambios sustanciales a través de la plataforma o por correo electrónico con antelación razonable. El uso continuado del servicio después de una actualización implica su aceptación.

11. Contacto
TR3SLOG · 1234 Logistics Way, Miami, FL 33101, USA
info@tr3slog.com · +1 786 123 4567 · WhatsApp Business`,
    },
  },
}

export const en = {
  label: 'EN',
  name: 'English',
  common: {
    signin: 'Sign in',
    dashboard: 'Dashboard',
    quote: 'Get a quote',
    viewAll: 'View all',
    explore: 'Explore',
    close: 'Close',
    loading: 'Searching…',
    required: 'This field is required',
    invalidEmail: 'Invalid email',
    placeholderNote: 'Demo figures — will be replaced with real data.',
  },
  nav: {
    home: 'Home',
    services: 'Services',
    track: 'Track',
    coverage: 'Coverage',
    about: 'About',
    contact: 'Contact',
    quote: 'Quote',
    pickup: 'Pickup',
    how: 'How it works',
    faq: 'FAQ',
  },
  home: {
    eyebrow: 'Smart logistics',
    title: 'Logistics that delivers, technology that proves',
    sub: 'From San Juan to the Caribbean: we transport your cargo with full traceability, photographic evidence and signed confirmation on every delivery.',
    trackTitle: 'Track your shipment',
    trackPh: 'TR3-260729-PRSJ-08821',
    trackBtn: 'Track',
    quoteBtn: 'Quote',
    svcEyebrow: 'Services',
    svcTitle: 'End-to-end logistics solutions',
    svcSub: 'Ground, sea and air coverage with real-time tracking technology.',
    howEyebrow: 'Process',
    howTitle: 'How it works',
    covEyebrow: 'Coverage',
    covTitle: 'Regional logistics network',
    segEyebrow: 'Sectors',
    segTitle: 'Industries we serve',
    seg: [
      { t: 'Pharmaceutical', d: 'Cold chain, temperature control and certified delivery evidence.' },
      { t: 'Retail', d: 'Store distribution with time windows and electronic confirmation.' },
      { t: 'E-commerce', d: 'Last mile with customer notifications and proof of delivery.' },
      { t: 'Industrial', d: 'Heavy cargo, machinery and parts with dedicated planning.' },
    ],
    techEyebrow: 'Technology',
    techTitle: 'Technology-driven platform',
    tech: [
      'Real-time GPS tracking',
      'Photographic delivery evidence',
      'Electronic receiver signature',
      'ERP integration API',
      'SMS and WhatsApp notifications',
      'Dashboard and reports',
    ],
    trust: [
      'Countries served',
      'Deliveries with proof',
      'Average response time',
      'Active drivers',
    ],
    ctaTitle: 'Ready to ship with TR3SLOG?',
    ctaSub: 'Request a custom quote or schedule a pickup in minutes.',
    ctaBtn1: 'Get a quote',
    ctaBtn2: 'Contact us',
  },
  svc: {
    title: 'Logistics services',
    sub: 'Transportation and distribution solutions with full traceability technology.',
    items: [
      { t: 'Ground transport', d: 'Regional distribution with owned fleet and verified drivers.', b: ['Dry and refrigerated cargo', 'Interurban coverage', 'Real-time GPS'] },
      { t: 'Sea freight', d: 'FCL/LCL containers with door-to-door coordination.', b: ['FCL and LCL', 'Cargo consolidation', 'Customs clearance'] },
      { t: 'Air shipping', d: 'Urgent delivery with direct flights and priority handling.', b: ['Express service', 'Sensitive cargo', 'Insurance included'] },
      { t: 'Last mile', d: 'Final delivery to customer with photo evidence and signature.', b: ['Time windows', 'Customer notification', 'Proof of delivery'] },
      { t: 'Warehousing', d: 'Equipped warehouses with access control and digital inventory.', b: ['Real-time inventory', 'Pick and pack', 'Cross-docking'] },
      { t: 'Reverse logistics', d: 'Returns management and pickups with full traceability.', b: ['Returns collection', 'Condition verification', 'Inventory re-entry'] },
    ],
  },
  trk: {
    title: 'Track your shipment',
    sub: 'Enter your tracking number to see status, location and delivery evidence.',
    ph: 'TR3-260729-PRSJ-08821',
    guide: 'Tracking number',
    btn: 'Track',
    errEmpty: 'Enter a tracking number',
    errFormat: 'Invalid format. Example: TR3-260729-PRSJ-08821',
    empty: 'Enter a tracking number to see your shipment details.',
    status: 'Status',
    statusVal: 'In transit',
    location: 'Current location',
    locationVal: 'San Juan distribution center',
    eta: 'Estimated delivery',
    etaVal: 'Jul 30, 4:30 PM',
    service: 'Service',
    serviceVal: 'Ground transport',
    created: 'Created',
    timelineTitle: 'Timeline',
    proofTitle: 'Delivery evidence',
    proofPhoto: 'Delivery photo',
    proofSign: 'Receiver signature',
    proofDoc: 'Delivery document',
    proofPending: 'Pending',
    timeline: [
      { label: 'Order received', time: 'Jul 27, 8:00 AM', place: 'System' },
      { label: 'Picked up', time: 'Jul 27, 9:15 AM', place: 'Origin warehouse' },
      { label: 'In transit', time: 'Jul 28, 6:00 AM', place: 'PR-52 Highway' },
      { label: 'At distribution center', time: 'Jul 29, 2:00 PM', place: 'San Juan, PR' },
      { label: 'Delivered', time: '—', place: '—' },
    ],
  },
  quo: {
    title: 'Request a quote',
    sub: 'Fill in the details and receive a customized proposal within 24 hours.',
    toast: 'Quote sent! We will contact you soon.',
    sent: '✓ Sent',
    btn: 'Send request',
    signIn: 'Sign in to request a quote',
    signInSub: 'Register or sign in to send your request and keep track of your history.',
    signInBtn: 'Sign in / Register',
    types: ['Ground', 'Sea', 'Air', 'Last mile', 'Warehousing'],
    f: {
      origin: 'Origin',
      originPh: 'Origin city',
      dest: 'Destination',
      destPh: 'Destination city',
      type: 'Service type',
      weight: 'Weight (kg)',
      weightPh: 'e.g. 250',
      dims: 'Dimensions (cm)',
      dimsPh: 'L × W × H',
      pieces: 'Number of pieces',
      piecesPh: 'e.g. 12',
      name: 'Name',
      namePh: 'Your full name',
      email: 'Email',
      emailPh: 'your@company.com',
      details: 'Additional details',
      detailsPh: 'Describe your cargo, special requirements, etc.',
    },
    err: {
      pieces: 'Number of pieces: enter numbers only.',
      dims: 'Dimensions: use the format L × W × H (e.g. 10x20x30 cm).',
    },
  },
  pick: {
    title: 'Schedule a pickup',
    sub: 'Coordinate your package pickup with our team.',
    toast: 'Pickup scheduled! We will confirm by email.',
    sent: '✓ Scheduled',
    btn: 'Schedule pickup',
    f: {
      from: 'Pickup address',
      fromPh: 'Full address',
      to: 'Destination',
      toPh: 'Destination city',
      date: 'Date',
      time: 'Time window',
      contact: 'Contact',
      contactPh: 'Name and phone',
      pkg: 'Package description',
      pkgPh: 'Type, weight, dimensions',
    },
    windows: ['Morning 8-12', 'Afternoon 1-5', 'Evening 6-9'],
  },
  cov: {
    title: 'Coverage network',
    sub: 'We operate in the Caribbean with continuous expansion to new markets.',
    mapAlt: 'Coverage map',
    active: 'Active operation',
    future: 'Coming soon',
    sub2: 'Regional coverage with strategic hubs.',
    stats: [
      { v: '4', l: 'Countries' },
      { v: '12+', l: 'Logistics hubs' },
      { v: '98.7%', l: 'On-time deliveries' },
    ],
    rows: [
      { n: 'Puerto Rico', d: 'Full island coverage with hubs in San Juan, Ponce and Mayagüez.', c: 'San Juan · Ponce · Mayagüez · Caguas · Bayamón' },
      { n: 'Dominican Republic', d: 'Operations in Santo Domingo and Santiago expanding to tourist areas.', c: 'Santo Domingo · Santiago · Punta Cana' },
      { n: 'United States', d: 'Connection with Florida and New York for import and export.', c: 'Miami · Orlando · New York', regions: { 'Miami': 'Florida', 'Orlando': 'Florida', 'New York': 'New York' } },
      { n: 'Venezuela', d: 'Upcoming operations in Caracas and Valencia.', c: 'Caracas · Valencia', regions: { 'Caracas': 'Distrito Capital', 'Valencia': 'Carabobo' } },
    ],
    ctaT: 'Your area not listed?',
    ctaSub: 'Contact us to evaluate custom coverage.',
  },
  how: {
    title: 'How it works',
    sub: 'Four simple steps to ship your cargo with full traceability.',
    steps: [
      { t: 'Request', d: 'Get a quote or schedule a pickup from the web or the app.' },
      { t: 'We pick up', d: 'Our driver arrives at the address and scans your cargo.' },
      { t: 'We transport', d: 'Real-time GPS tracking with automatic updates.' },
      { t: 'We deliver', d: 'Confirmation with photo, signature and recipient notification.' },
    ],
  },
  about: {
    title: 'About TR3SLOG',
    sub: 'We are a regional logistics company with proprietary technology and a focus on total transparency.',
    missionT: 'Mission',
    missionB: 'Connecting the Caribbean with reliable, traceable and transparent logistics, driving regional commerce with cutting-edge technology.',
    promiseT: 'Promise',
    promiseB: 'Every delivery includes photographic evidence, receiver signature and end-to-end GPS traceability.',
    valuesT: 'Our values',
    values: [
      { t: 'Transparency', d: 'Full visibility at every stage of the shipment.' },
      { t: 'Trust', d: 'Verified drivers and auditable processes.' },
      { t: 'Innovation', d: 'Proprietary technology with continuous improvement.' },
      { t: 'Closeness', d: 'Human attention and bilingual support.' },
    ],
    teamT: 'Leadership team',
    team: [
      { n: 'Carlos Méndez', r: 'CEO & Co-founder' },
      { n: 'Ana Rivera', r: 'COO' },
      { n: 'Luis Torres', r: 'CTO' },
    ],
  },
  cont: {
    title: 'Contact',
    sub: 'We are here to help with your shipment, quote or any inquiry.',
    btn: 'Send message',
    sent: '✓ Sent',
    toast: 'Message sent!',
    ref: 'Reference number',
    successNote: 'A coordinator will respond by the next business day.',
    phoneT: 'Phone',
    emailT: 'Email',
    waT: 'WhatsApp',
    hoursT: 'Hours',
    hours: 'Mon–Fri 8:00 AM – 6:00 PM\nSat 9:00 AM – 1:00 PM',
    addressT: 'Address',
    address: '123 Main Street\nSan Juan, PR 00901',
    f: {
      name: 'Name',
      namePh: 'Your name',
      email: 'Email',
      emailPh: 'your@email.com',
      subject: 'Subject',
      subjectPh: 'What are you writing about?',
      msg: 'Message',
      msgPh: 'Tell us how we can help…',
    },
  },
  faq: {
    title: 'Frequently asked questions',
    sub: 'We answer the most common questions about our services.',
    groups: [
      {
        t: 'Shipping and tracking',
        items: [
          { q: 'How do I track my shipment?', a: 'Enter your tracking number in the "Track" section or in the driver app. You will see location, status and delivery evidence.' },
          { q: 'What does delivery evidence include?', a: 'Photo of the delivered package, electronic receiver signature, date and time with GPS.' },
        ],
      },
      {
        t: 'Quotes and payments',
        items: [
          { q: 'How do I request a quote?', a: 'Fill out the form in "Quote" with origin, destination and cargo type. You will receive a proposal within 24 hours.' },
          { q: 'What payment methods do you accept?', a: 'Bank transfer, credit card and PayPal for corporate clients.' },
        ],
      },
      {
        t: 'Coverage',
        items: [
          { q: 'Which countries do you operate in?', a: 'Currently Puerto Rico, Dominican Republic and the United States. Venezuela coming soon.' },
          { q: 'Do you ship to remote areas?', a: 'Yes, we evaluate each case. Contact us to verify coverage in your area.' },
        ],
      },
    ],
  },
  foot: {
    tagline: 'Regional logistics with full traceability. We transport your cargo with technology and transparency.',
    colNav: 'Navigation',
    colServices: 'Services',
    colContact: 'Contact',
    rights: '© 2025 TR3SLOG. All rights reserved.',
    privacy: 'Privacy',
    terms: 'Terms',
  },
  legal: {
    privacy: {
      t: 'Privacy policy',
      b: 'TR3SLOG collects shipping, contact and location data solely to provide logistics services. We do not share information with third parties without consent. You can request access, correction or deletion of your data at any time.',
    },
    terms: {
      t: 'Terms and Conditions of Service',
      b: `TR3SLOG · Dominican Republic, Puerto Rico, United States and Venezuela

Last updated: August 27, 2026

These Terms and Conditions ("Terms") govern the use of logistics, transportation, warehousing and digital platform services of TR3SLOG ("the Company", "we") by any person or company ("the Client", "you") who creates an account, requests a shipment or uses our web and mobile applications. By registering or using our services, you accept these Terms in their entirety.

1. Territory and coverage
TR3SLOG currently operates in the Dominican Republic, Puerto Rico and the United States. Operations in Venezuela are in preparation phase and are not available to the public until activation, which requires express executive approval from the Company.

The availability of services, rates, currencies (USD, DOP, VES, EUR, CNY as applicable) and transit times varies according to the country of origin and destination, and is subject to customs and transportation regulations of each jurisdiction.

2. Accounts and access
There are different types of accounts: individual client, business account, driver and operations personnel. Each account is verified by email and phone before activation. Business and driver accounts also require review and approval by TR3SLOG Operations team before obtaining full access.

You are responsible for maintaining the confidentiality of your access credentials and for all activity performed under your account. Business accounts may invite colleagues with specific roles; each invitee accepts and operates only within the assigned role.

3. Permitted and prohibited shipments
The Client declares that the content of each shipment is lawful and complies with customs and transportation laws of the countries of origin, transit and destination. Prohibited items include, among others: hazardous materials, weapons, controlled substances, counterfeit goods and any article whose import or export is restricted by law.

TR3SLOG reserves the right to inspect, retain or reject any shipment that does not comply with this section, without liability for costs derived from such rejection.

4. Rates, payments and billing
Rates are calculated based on weight, dimensions, route and service modality, and are displayed in the currency selected at the time of quotation. Charges are processed according to the payment method registered by the Client.

Refunds and credits for services not provided or proven incidents require prior approval from the corresponding team; they are not issued automatically.

5. Liability and claims
TR3SLOG acts with the reasonable care of a professional logistics operator. Our liability for loss, damage or delay of a shipment is limited to the declared value by the Client at the time of shipment creation, unless applicable law provides otherwise.

All claims must be submitted through the platform support channels within the deadlines indicated in the delivery confirmation. Inventory or content differences detected in the warehouse block dispatch until resolution.

6. Tracking and privacy
Tracking of shipments and vehicles occurs only when there is an active route and shift; the Client can see the status of their shipment, but in no case can see the location of the fleet. The use of location data is governed by our privacy policies, data retention and access control.

The geofence of a delivery point is operational support data and does not, by itself, constitute the closure of a delivery.

7. Unimplemented third-party services
Certain integrations shown on the platform (marketplaces such as Amazon, eBay, Etsy or Walmart, certain carrier labels, multi-factor authentication and third-party real-time fleet services) are in planning state and are not active. No unimplemented data or function is presented as available in production.

8. Applicable law by jurisdiction
Dominican Republic: these Terms are interpreted in accordance with the laws of the Dominican Republic for shipments originated or delivered in its territory.

Puerto Rico: for shipments within Puerto Rico, federal laws of the United States applicable to transportation and interstate commerce services also apply.

United States: for shipments originated or delivered in the continental US, applicable federal laws and those of the state of Florida, seat of our main offices, govern.

Venezuela: while operations remain in preparation, no provision of these Terms enables the provision of services in said territory; its future activation will be subject to a specific addendum approved by the Company.

9. Dispute resolution
Any dispute will first be attempted to be resolved directly with our support team. If no agreement is reached, the dispute will be submitted to the competent courts of the jurisdiction corresponding to the country where the shipment originated or the service was provided, according to section 8.

10. Modifications to these Terms
TR3SLOG may update these Terms periodically. We will notify substantial changes through the platform or by email with reasonable notice. Continued use of the service after an update implies acceptance.

11. Contact
TR3SLOG · 1234 Logistics Way, Miami, FL 33101, USA
info@tr3slog.com · +1 786 123 4567 · WhatsApp Business`,
    },
  },
}

export const zhCN = {
  label: '中文',
  name: '中文',
  common: {
    signin: '登录',
    dashboard: '控制面板',
    quote: '获取报价',
    viewAll: '查看全部',
    explore: '探索',
    close: '关闭',
    loading: '搜索中…',
    required: '此字段为必填',
    invalidEmail: '邮箱无效',
    placeholderNote: '演示数据 — 将替换为真实数据。',
  },
  nav: {
    home: '首页',
    services: '服务',
    track: '追踪',
    coverage: '覆盖范围',
    about: '关于我们',
    contact: '联系我们',
    quote: '报价',
    pickup: '取件',
    how: '运作方式',
    faq: '常见问题',
  },
  home: {
    eyebrow: '智能物流',
    title: '送达的物流，可验证的技术',
    sub: '从圣胡安到加勒比：我们以全程可追溯、照片证据和签收确认运输您的货物。',
    trackTitle: '追踪您的货物',
    trackPh: 'TR3-260729-PRSJ-08821',
    trackBtn: '追踪',
    quoteBtn: '报价',
    svcEyebrow: '服务',
    svcTitle: '一站式物流解决方案',
    svcSub: '陆运、海运和空运覆盖，配备实时追踪技术。',
    howEyebrow: '流程',
    howTitle: '运作方式',
    covEyebrow: '覆盖范围',
    covTitle: '区域物流网络',
    segEyebrow: '行业',
    segTitle: '我们服务的行业',
    seg: [
      { t: '医药', d: '冷链运输，温度控制和认证送达证据。' },
      { t: '零售', d: '门店配送，时间窗口和电子确认。' },
      { t: '电商', d: '最后一英里，客户通知和送达证明。' },
      { t: '工业', d: '重型货物，机械和零件，专属规划。' },
    ],
    techEyebrow: '技术',
    techTitle: '技术驱动平台',
    tech: [
      '实时GPS追踪',
      '送达照片证据',
      '收件人电子签名',
      'ERP集成API',
      '短信和WhatsApp通知',
      '仪表板和报告',
    ],
    trust: [
      '服务国家',
      '有证据的送达',
      '平均响应时间',
      '活跃司机',
    ],
    ctaTitle: '准备好与TR3SLOG合作了吗？',
    ctaSub: '几分钟内获取定制报价或安排取件。',
    ctaBtn1: '获取报价',
    ctaBtn2: '联系我们',
  },
  svc: {
    title: '物流服务',
    sub: '具备全程可追溯技术的运输和配送解决方案。',
    items: [
      { t: '陆运', d: '自有车队和认证司机的区域配送。', b: ['干货和冷藏', '城际覆盖', '实时GPS'] },
      { t: '海运', d: 'FCL/LCL集装箱，门到门协调。', b: ['FCL和LCL', '货物整合', '清关'] },
      { t: '空运', d: '直飞紧急送达，优先处理。', b: ['快递服务', '敏感货物', '含保险'] },
      { t: '最后一英里', d: '最终送达客户，照片证据和签名。', b: ['时间窗口', '客户通知', '送达证明'] },
      { t: '仓储', d: '配备门禁和数字库存的仓库。', b: ['实时库存', '拣选和包装', '越库'] },
      { t: '逆向物流', d: '退货管理和取件，全程可追溯。', b: ['退货收集', '状态验证', '库存重新入库'] },
    ],
  },
  trk: {
    title: '追踪您的货物',
    sub: '输入您的追踪号码以查看状态、位置和送达证据。',
    ph: 'TR3-260729-PRSJ-08821',
    guide: '追踪号码',
    btn: '追踪',
    errEmpty: '请输入追踪号码',
    errFormat: '格式无效。示例：TR3-260729-PRSJ-08821',
    empty: '输入追踪号码以查看货物详情。',
    status: '状态',
    statusVal: '运输中',
    location: '当前位置',
    locationVal: '圣胡安配送中心',
    eta: '预计送达',
    etaVal: '7月30日，下午4:30',
    service: '服务',
    serviceVal: '陆运',
    created: '创建',
    timelineTitle: '时间线',
    proofTitle: '送达证据',
    proofPhoto: '送达照片',
    proofSign: '收件人签名',
    proofDoc: '送达文件',
    proofPending: '待定',
    timeline: [
      { label: '订单已接收', time: '7月27日，上午8:00', place: '系统' },
      { label: '已取件', time: '7月27日，上午9:15', place: '发货仓库' },
      { label: '运输中', time: '7月28日，上午6:00', place: 'PR-52公路' },
      { label: '到达配送中心', time: '7月29日，下午2:00', place: '圣胡安，PR' },
      { label: '已送达', time: '—', place: '—' },
    ],
  },
  quo: {
    title: '请求报价',
    sub: '填写详情，24小时内收到定制方案。',
    toast: '报价已发送！我们将尽快联系您。',
    sent: '✓ 已发送',
    btn: '发送请求',
    signIn: '登录后请求报价',
    signInSub: '注册或登录以发送您的请求并保存记录。',
    signInBtn: '登录 / 注册',
    types: ['陆运', '海运', '空运', '最后一英里', '仓储'],
    f: {
      origin: '出发地',
      originPh: '出发城市',
      dest: '目的地',
      destPh: '目的城市',
      type: '服务类型',
      weight: '重量（公斤）',
      weightPh: '例如 250',
      dims: '尺寸（厘米）',
      dimsPh: '长 × 宽 × 高',
      pieces: '件数',
      piecesPh: '例如 12',
      name: '姓名',
      namePh: '您的全名',
      email: '邮箱',
      emailPh: 'your@company.com',
      details: '补充详情',
      detailsPh: '描述您的货物、特殊要求等。',
    },
    err: {
      pieces: '件数：请输入数字。',
      dims: '尺寸：请使用 长 × 宽 × 高 格式（例如 10x20x30 cm）。',
    },
  },
  pick: {
    title: '安排取件',
    sub: '与我们的团队协调包裹取件。',
    toast: '取件已安排！我们将通过邮件确认。',
    sent: '✓ 已安排',
    btn: '安排取件',
    f: {
      from: '取件地址',
      fromPh: '完整地址',
      to: '目的地',
      toPh: '目的城市',
      date: '日期',
      time: '时间窗口',
      contact: '联系人',
      contactPh: '姓名和电话',
      pkg: '包裹描述',
      pkgPh: '类型、重量、尺寸',
    },
    windows: ['上午 8-12', '下午 1-5', '晚上 6-9'],
  },
  cov: {
    title: '覆盖网络',
    sub: '我们在加勒比地区运营，持续扩展到新市场。',
    mapAlt: '覆盖地图',
    active: '运营中',
    future: '即将开通',
    sub2: '战略枢纽的区域覆盖。',
    stats: [
      { v: '4', l: '国家' },
      { v: '12+', l: '物流枢纽' },
      { v: '98.7%', l: '准时送达' },
    ],
    rows: [
      { n: '波多黎各', d: '全岛覆盖，枢纽设在圣胡安、蓬塞和马亚圭斯。', c: '圣胡安 · 蓬塞 · 马亚圭斯 · 卡瓜斯 · 巴亚蒙' },
      { n: '多米尼加共和国', d: '在圣多明各和圣地亚哥运营，扩展到旅游区。', c: '圣多明各 · 圣地亚哥 · 蓬塔卡纳' },
      { n: '美国', d: '与佛罗里达和纽约连接，进出口服务。', c: '迈阿密 · 奥兰多 · 纽约', regions: { '迈阿密': 'Florida', '奥兰多': 'Florida', '纽约': 'New York' } },
      { n: '委内瑞拉', d: '即将在加拉加斯和巴伦西亚开通运营。', c: '加拉加斯 · 巴伦西亚', regions: { '加拉加斯': 'Distrito Capital', '巴伦西亚': 'Carabobo' } },
    ],
    ctaT: '您的地区不在列表中？',
    ctaSub: '联系我们评估定制覆盖。',
  },
  how: {
    title: '运作方式',
    sub: '四个简单步骤，全程可追溯地运输您的货物。',
    steps: [
      { t: '请求', d: '从网站或APP获取报价或安排取件。' },
      { t: '取件', d: '我们的司机到达地址并扫描您的货物。' },
      { t: '运输', d: '实时GPS追踪，自动更新。' },
      { t: '送达', d: '照片、签名和收件人通知确认。' },
    ],
  },
  about: {
    title: '关于TR3SLOG',
    sub: '我们是一家拥有自主技术的区域物流公司，专注于全面透明。',
    missionT: '使命',
    missionB: '以可靠、可追溯和透明的物流连接加勒比，用尖端技术推动区域商业。',
    promiseT: '承诺',
    promiseB: '每次送达都包含照片证据、收件人签名和端到端GPS可追溯性。',
    valuesT: '我们的价值观',
    values: [
      { t: '透明', d: '运输各阶段的全面可见性。' },
      { t: '信任', d: '认证司机和可审计流程。' },
      { t: '创新', d: '自主技术，持续改进。' },
      { t: '亲近', d: '人性化服务和双语支持。' },
    ],
    teamT: '领导团队',
    team: [
      { n: 'Carlos Méndez', r: 'CEO兼联合创始人' },
      { n: 'Ana Rivera', r: 'COO' },
      { n: 'Luis Torres', r: 'CTO' },
    ],
  },
  cont: {
    title: '联系我们',
    sub: '我们在这里帮助您处理运输、报价或任何咨询。',
    btn: '发送消息',
    sent: '✓ 已发送',
    toast: '消息已发送！',
    ref: '参考编号',
    successNote: '协调员将在下一个工作日回复。',
    phoneT: '电话',
    emailT: '邮箱',
    waT: 'WhatsApp',
    hoursT: '营业时间',
    hours: '周一至周五 上午8:00 – 下午6:00\n周六 上午9:00 – 下午1:00',
    addressT: '地址',
    address: '123 Main Street\nSan Juan, PR 00901',
    f: {
      name: '姓名',
      namePh: '您的姓名',
      email: '邮箱',
      emailPh: 'your@email.com',
      subject: '主题',
      subjectPh: '您想咨询什么？',
      msg: '消息',
      msgPh: '告诉我们如何帮助您…',
    },
  },
  faq: {
    title: '常见问题',
    sub: '我们解答关于服务的最常见问题。',
    groups: [
      {
        t: '运输和追踪',
        items: [
          { q: '如何追踪我的货物？', a: '在"追踪"部分或司机APP中输入您的追踪号码。您将看到位置、状态和送达证据。' },
          { q: '送达证据包括什么？', a: '送达包裹的照片、收件人电子签名、日期和时间及GPS。' },
        ],
      },
      {
        t: '报价和付款',
        items: [
          { q: '如何请求报价？', a: '在"报价"中填写出发地、目的地和货物类型。您将在24小时内收到方案。' },
          { q: '接受哪些付款方式？', a: '银行转账、信用卡和PayPal（企业客户）。' },
        ],
      },
      {
        t: '覆盖范围',
        items: [
          { q: '在哪些国家运营？', a: '目前为波多黎各、多米尼加共和国和美国。委内瑞拉即将开通。' },
          { q: '是否配送偏远地区？', a: '是的，我们逐案评估。请联系我们确认您所在地区的覆盖。' },
        ],
      },
    ],
  },
  foot: {
    tagline: '全面可追溯的区域物流。我们以技术和透明运输您的货物。',
    colNav: '导航',
    colServices: '服务',
    colContact: '联系',
    rights: '© 2025 TR3SLOG. 版权所有。',
    privacy: '隐私',
    terms: '条款',
  },
  legal: {
    privacy: {
      t: '隐私政策',
      b: 'TR3SLOG仅出于提供物流服务目的收集运输、联系和位置数据。未经同意，我们不与第三方共享信息。您可随时请求访问、更正或删除您的数据。',
    },
    terms: {
      t: '服务条款与条件',
      b: `TR3SLOG · 多米尼加共和国、波多黎各、美国和委内瑞拉

最后更新：2026年8月27日

本条款与条件（"条款"）管辖TR3SLOG（"公司"、"我们"）的物流、运输、仓储和数字平台服务，适用于任何创建账户、请求运输或使用我们网页及移动应用程序的个人或公司（"客户"、"您"）。通过注册或使用我们的服务，您完全接受这些条款。

1. 领土和覆盖范围
TR3SLOG目前在多米尼加共和国、波多黎各和美国运营。委内瑞拉的运营处于筹备阶段，在公司高管明确批准激活之前，不对公众开放。

服务可用性、费率、货币（根据情况为USD、DOP、VES、EUR、CNY）和运输时间根据始发地和目的地国家而异，并受每个司法管辖区的海关和运输法规约束。

2. 账户和访问
存在不同类型的账户：个人客户、企业账户、司机和运营人员。每个账户在激活前需通过电子邮件和电话验证。企业和司机账户还需要TR3SLOG运营团队的审查和批准才能获得完全访问权限。

您有责任维护访问凭证的机密性，并对您账户下执行的所有活动负责。企业账户可以邀请具有特定角色的同事；每位受邀者仅接受并在指定角色内操作。

3. 允许和禁止的运输
客户声明每批货物的内容合法，并符合始发地、过境地和目的地国家的海关和运输法律。禁止物品包括但不限于：危险材料、武器、受控物质、假冒商品以及任何法律限制进出口的物品。

TR3SLOG保留检查、扣留或拒绝任何不符合本节运输的权利，不对由此类拒绝产生的费用承担责任。

4. 费率、付款和账单
费率根据重量、尺寸、路线和服务模式计算，并在报价时以所选货币显示。费用根据客户注册的付款方式处理。

对于未提供服务或已证实的事件，退款和信用需要相应团队的事先批准；不会自动发放。

5. 责任和索赔
TR3SLOG以专业物流运营商的合理谨慎行事。我们对货物丢失、损坏或延误的责任仅限于客户在创建运输时声明的价值，除非适用法律另有规定。

所有索赔必须通过平台支持渠道在送达确认中指明的期限内提交。仓库中检测到的库存或内容差异会在解决前阻止发货。

6. 追踪和隐私
仅在存在有效路线和班次时才进行货物和车辆的追踪；客户可以查看其货物的状态，但绝不能查看车队的位置。位置数据的使用受我们的隐私政策、数据保留和访问控制管辖。

配送点的地理围栏是运营支持数据，本身不构成配送的完成。

7. 未实施的第三方服务
平台上显示的某些集成（如Amazon、eBay、Etsy或Walmart等市场、某些承运商标签、多因素认证和第三方实时车队服务）处于规划状态，尚未激活。任何未实施的数据或功能都不会在生产环境中呈现为可用。

8. 各司法管辖区适用法律
多米尼加共和国：这些条款根据多米尼加共和国法律解释，适用于在其境内始发或送达的运输。

波多黎各：对于波多黎各境内的运输，还适用于美国运输和州际商业服务的联邦法律。

美国：对于在美国大陆始发或送达的运输，适用联邦法律和佛罗里达州法律（我们主要办事处的所在地）。

委内瑞拉：在运营仍处于筹备期间，本条款的任何规定均不授权在该领土提供服务；其未来激活将受公司批准的特定附录约束。

9. 争议解决
任何争议将首先尝试通过我们的支持团队直接解决。如果未达成协议，争议将提交至根据第8节运输始发或提供服务国家相应司法管辖区的主管法院。

10. 对这些条款的修改
TR3SLOG可以定期更新这些条款。我们将通过平台或电子邮件提前通知重大变更。更新后继续使用服务即表示接受。

11. 联系方式
TR3SLOG · 1234 Logistics Way, Miami, FL 33101, USA
info@tr3slog.com · +1 786 123 4567 · WhatsApp Business`,
    },
  },
}

export const i18n = { es, en, 'zh-CN': zhCN }
export const langList = [
  { code: 'en', ...en },
  { code: 'es', ...es },
  { code: 'zh-CN', ...zhCN },
]
