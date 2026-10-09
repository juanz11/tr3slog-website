// App (auth · customer portal · admin) — English
(function () {
  var root = window.TR3S_I18N = window.TR3S_I18N || {}; var d = root.en = root.en || {};
  d.app = {
    auth: {
      signinT:'Sign in to TR3SLOG', signinSub:'Access your shipments, quotes and documents.',
      email:'Email', emailPh:'name@company.com', password:'Password', passwordPh:'••••••••',
      remember:'Keep me signed in', forgot:'Forgot your password?', signinBtn:'Sign in',
      noAccount:'New to TR3SLOG?', createLink:'Create an account',
      signupT:'Create your account', signupSub:'Set up your account to request shipments and follow every operation.',
      name:'Full name', namePh:'Your name', company:'Company (optional)', companyPh:'Comercial Bayamón LLC',
      phone:'Phone', phonePh:'+1 787 000 0000', confirm:'Confirm password',
      terms:'I accept the Terms of Service and Privacy Policy', signupBtn:'Create account',
      haveAccount:'Already have an account?', signinLink:'Sign in',
      resetT:'Reset your password', resetSub:'Enter your email and we will send a reset link.',
      resetBtn:'Send reset link', resetSent:'Link sent. Check your inbox for the reset instructions.',
      newPass:'New password', savePass:'Save new password', back:'Back to sign in',
      errEmail:'Enter a valid email address.', errPass:'Password must be at least 8 characters.',
      errMatch:'Passwords do not match.', errTerms:'You must accept the terms to continue.',
      errCreds:'Email or password is incorrect.'
    },
    shell: { roleDemo:'Demo view switch', roleDemoNote:'Real authorization is enforced on the server, not on this screen.', searchHint:'Searches shipments', portal:'Customer portal', admin:'Operations', signout:'Sign out', viewSite:'View website', account:'Account', role:'Corporate · BIZ-0241', client:'Comercial Bayamón LLC', operator:'Operations · San Juan hub', searchPh:'Search tracking number, client or route' },
    navC: { dashboard:'Dashboard', shipments:'My shipments', create:'Create shipment', payments:'Payments & invoices', addresses:'Addresses', support:'Support' },
    navA: { ops:'Operations dashboard', dispatch:'Shipments & dispatch', drivers:'Drivers', incidents:'Incidents' },
    dash: {
      greeting:'Good afternoon', title:'Your operations at a glance', newShipment:'New shipment', range:'Last 30 days',
      kpis:[{l:'Active shipments',v:'14',n:'3 in transit'},{l:'Delivered this month',v:'248',n:'vs. last month'},{l:'On-time rate',v:'97.6%',n:'SLA target 95%'},{l:'Pending quotes',v:'3',n:'awaiting your approval'}],
      activeT:'Active shipments', seeAll:'See all',
      quickT:'Quick actions', quick:['New shipment','Schedule pickup','Track shipment','Contact support'],
      activityT:'Recent activity',
      activity:[{t:'Delivered to Daniela Cruz',m:'TR3-260729-EUAL-08744 · 12 min ago'},{t:'Driver picked up cargo',m:'TR3-260729-RDPC-08790 · 38 min ago'},{t:'New shipment booked',m:'TR3-260729-PRSJ-08821 · 1 h ago'},{t:'Invoice INV-1042 paid',m:'$1,240.00 · yesterday'}],
      alertsT:'Alerts',
      alerts:[{t:'Quote awaiting approval',d:'Quote QT-0091 expires in 2 days.'},{t:'Address needs confirmation',d:'Recipient phone missing on TR3-260729-EUAL-08702.'}]
    },
    ship: {
      title:'My shipments', searchPh:'Search by tracking number, city or recipient',
      filters:['All','In transit','Out for delivery','Delivered','Pending'],
      cols:['Tracking','Route','Service','Status','ETA',''],
      empty:'No shipments match this search. Adjust the filters or clear the search field.',
      view:'View', results:'shipments'
    },
    detail: {
      title:'Shipment detail', back:'Back to shipments',
      addressesT:'Addresses', from:'Sender', to:'Recipient',
      fromVal:'Comercial Bayamón LLC\n1234 Logistics Way, Miami, FL 33101',
      toVal:'Daniela Cruz\n1204 Roosevelt Ave, San Juan, PR 00920',
      chargesT:'Charges', charges:[{l:'Freight',v:'$860.00'},{l:'Consolidation',v:'$120.00'},{l:'Documentation',v:'$45.00'}],
      total:'Total', totalVal:'$1,025.00',
      docPending:'The file is generated once the document service is connected.', docsT:'Documents', docs:['Bill of lading','Commercial invoice','Packing list'], download:'Download',
      evidenceT:'Delivery evidence', timelineT:'Full tracking timeline'
    },
    pod: {
      title:'Delivery record', open:'View full record', back:'Back to shipment',
      subInt:'Complete delivery record, with per-role access control and a trace of every lookup.',
      subCli:'Confirmation of your delivery: date, time, who received it and the available evidence.',
      subSup:'Claims view: recorded facts, evidence integrity and what may be shared.',
      viewT:'View', views:{ internal:'Operations', customer:'Customer', support:'Support' },
      viewNote:{
        internal:'Internal view. Includes receiver and fleet data. Not shared with the customer.',
        customer:'Customer view. No receiver personal data and no fleet positions.',
        support:'Support view. Read only, meant to support or reject a claim.'
      },
      statusT:'Delivery status', statusVal:'Delivered · evidence complete',
      completeT:'Evidence complete', incompleteT:'Evidence incomplete',
      summaryT:'Delivery summary',
      summary:[
        {k:'Guide',v:'TR3-260729-PRSJ-08821'},
        {k:'Date and time',v:'—— · device time zone'},
        {k:'Delivery address',v:'Calle Betances 88, Caguas, PR'},
        {k:'Service',v:'Local delivery · identification required'},
        {k:'Route',v:'RT-2607-A'},
        {k:'Recorded from',v:'Driver app · offline, synced later'}
      ],
      receiverT:'Receiver identity', receiverRestricted:'Restricted · operations and support',
      receiver:[
        {k:'Receiver name',v:'——'},
        {k:'Relationship to recipient',v:'Employee'},
        {k:'Identification type',v:'Driver license'},
        {k:'Number',v:'•••• 4821'},
        {k:'Consent',v:'Given by the person'},
        {k:'Identification images',v:'2 · encrypted'}
      ],
      receiverHidden:'Receiver data is not shown in the customer view.',
      receiverMaskNote:'Only the last four digits are kept. The full number is never stored or displayed.',
      evidenceT:'Captured evidence',
      evidence:[
        {t:'Package photo',d:'Captured with the device camera',st:'ok'},
        {t:'Receiver signature',d:'Drawn on screen at delivery time',st:'ok'},
        {t:'Identification front',d:'Visible to operations and support only',st:'restricted'},
        {t:'Identification back',d:'Required by the document type',st:'restricted'},
        {t:'Place photo',d:'Optional · not captured on this delivery',st:'missing'}
      ],
      evStates:{ ok:'Available', restricted:'Restricted', missing:'Not captured' },
      viewImage:'View image', restrictedImage:'No permission to view this image',
      geoT:'Location and time', geo:[
        {k:'Coordinates',v:'——'},
        {k:'Accuracy',v:'—— m'},
        {k:'Device time',v:'——'},
        {k:'Sync time',v:'——'},
        {k:'Inside the geofence',v:'Yes · the geofence does not close the delivery'},
        {k:'Position source',v:'Amazon Location'}
      ],
      geoNote:'The geofence is context only. A delivery closes solely with the driver evidence.',
      chainT:'Chain of custody', chainCols:['Time','Event','Responsible','Place','Condition'],
      chain:[
        {c:['——','Picked up at warehouse','C. Méndez','Hub San Juan','Sealed']},
        {c:['——','Loaded onto vehicle','E. Rivera','Dock 3','Sealed']},
        {c:['——','In transit','E. Rivera','RT-2607-A','Sealed']},
        {c:['——','Delivered','E. Rivera','Caguas','Good condition']}
      ],
      chainNote:'The chain is append only: a correction is added as a new record referencing the previous one.',
      accessT:'Lookups of this record', accessCols:['Time','Who','Role','View','Reason'],
      access:[
        {c:['——','A. Rojas','Support','Support','Claim CLM-1041']},
        {c:['——','C. Méndez','Operations','Operations','Route review']},
        {c:['——','Customer','Portal','Customer','Shipment lookup']}
      ],
      accessNote:'Every opening of the record is logged with who, when and why.',
      integrityT:'Integrity', integrity:[
        {k:'Record mode',v:'Append only'},
        {k:'Editing',v:'Not allowed for any role'},
        {k:'Images',v:'Encrypted at rest and in transit'},
        {k:'Retention',v:'Defined by compliance'},
        {k:'Integrity verification',v:'Pending connection'}
      ],
      shareT:'What may be shared', share:[
        {k:'Package photo',v:'Yes'},
        {k:'Signature',v:'Yes'},
        {k:'Date, time and address',v:'Yes'},
        {k:'Receiver name',v:'With authorization only'},
        {k:'Identification images',v:'Never'},
        {k:'Fleet position',v:'Never'}
      ],
      claimT:'Linked claims', claimCols:['Claim','Reason','Opened','Status'],
      claims:[{c:['CLM-1041','Delivery not recognized','——','Under review']}],
      actionsT:'Actions',
      download:'Download receipt', downloadNote:'The PDF receipt is issued by the document service, not connected yet.',
      shareBtn:'Share with the customer', shareNote:'Sending to the customer requires the notification service.',
      dispute:'Open a claim', disputeNote:'The claim is recorded in support; no credit is issued from this screen.',
      exportAudit:'Export audit', exportNote:'The export is recorded in the lookup history.',
      pending:'Pending connection'
    },
    create: { errStep:'Complete the required fields of this step.', reqMark:'Required', localNote:'The shipment is not created in the system: the shipment service is missing.',
      title:'Create shipment', steps:['Sender','Recipient','Package','Service & pickup','Payment'],
      next:'Continue', back:'Back', submit:'Create shipment', success:'Shipment created. Tracking number TR3-260729-PRSJ-08830 assigned.',
      f:{name:'Name',company:'Company',address:'Address',city:'City',zip:'ZIP / Postal code',phone:'Phone',email:'Email',pieces:'Pieces',weight:'Weight',dims:'Dimensions',contents:'Contents',declared:'Declared value',service:'Service',date:'Pickup date',window:'Time window',notes:'Notes',payment:'Payment method',card:'Card ending 4242',invoiceMe:'Bill to account'},
      review:'Review before creating', summary:'Summary'
    },
    pay: {
      title:'Payments & invoices', pendingT:'Pending payments', paidT:'Completed payments',
      cols:['Invoice','Shipment','Issued','Amount','Status',''],
      payNow:'Pay now', receipt:'Receipt', invoice:'Invoice', totalDue:'Total due', paidLabel:'Paid', pendingLabel:'Pending',
      empty:'No invoices in this section yet.'
    },
    ops: {
      title:'Operations dashboard', subtitle:'Live view of deliveries, exceptions and driver capacity.',
      kpis:[{l:'Active deliveries',v:'62',n:'18 out for delivery'},{l:'Delayed shipments',v:'5',n:'requires follow-up'},{l:'Unassigned orders',v:'7',n:'awaiting driver'},{l:'Drivers on route',v:'12',n:'of 15 available'}],
      delayedT:'Delayed shipments', unassignedT:'Unassigned orders', driversT:'Drivers', incidentsT:'Open incidents',
      driverCols:['Driver','Vehicle','Stops','Progress','Status'],
      incidentCols:['Case','Shipment','Type','Reported','Status'],
      assign:'Assign'
    },
    disp: {
      title:'Shipments & dispatch', subtitle:'Create, edit and dispatch shipments across all corridors.',
      create:'Create shipment', edit:'Edit', assignDriver:'Assign driver', changeStatus:'Change status',
      scheduleRoute:'Schedule route', reportIncident:'Report incident',
      cols:['Tracking','Client','Route','Driver','Status','Actions'],
      statuses:['Order received','Pending validation','Confirmed','Pickup scheduled','Cargo received','Processing','In transit','Out for delivery','Delivered','Incident','Cancelled'],
      saved:'Changes saved.', assigned:'Driver assigned.', incidentSaved:'Incident reported and case opened.',
      selectDriver:'Select driver', selectStatus:'Select status', unassigned:'Unassigned', apply:'Apply', cancel:'Cancel',
      incidentType:'Incident type', incidentTypes:['Damaged cargo','Failed delivery attempt','Address issue','Delay','Missing piece'], incidentNotes:'Notes'
    },
    addr: {
      title:'Addresses', add:'Add address', edit:'Edit', remove:'Remove', primary:'Primary', setPrimary:'Set as primary',
      newT:'New address', editT:'Edit address', save:'Save address', cancelBtn:'Cancel', removeBtn:'Remove', removed:'Address removed from this session.', localNote:'Saved in this session only. Persistence requires the address service.', typeT:'Address type', added:'Address added in this session.', updated:'Address updated in this session.', types:['Pickup','Delivery','Billing'], cols:['Name','Address','Type','Contact',''],
      empty:'No saved addresses yet.', saved:'Address saved.',
      f:{name:'Address name',address:'Address',city:'City',zip:'ZIP code',contact:'Contact',phone:'Phone',instructions:'Delivery instructions'},
      rows:[
        {n:'Bayamón South Warehouse',a:'Rd. 167 Km 4.2, Bayamón, PR 00961',type:0,c:'R. Colón · +1 787 555 0142',primary:true},
        {n:'Tienda Caguas Centro',a:'88 Betances St, Caguas, PR 00725',type:1,c:'M. Díaz · +1 787 555 0177',primary:false},
        {n:'San Juan Office',a:'1204 Roosevelt Ave, San Juan, PR 00920',type:1,c:'L. Ortiz · +1 787 555 0118',primary:false},
        {n:'Billing · Bayamón',a:'Rd. 167 Km 4.2, Bayamón, PR 00961',type:2,c:'billing@bayamon.com',primary:false}
      ]
    },
    support: {
      title:'Support', sub:'A coordinator replies within the next business day.',
      channelsT:'Support channels', hoursT:'Business hours', hours:'Mon – Fri · 8:00 a.m. – 6:00 p.m. (AST)',
      channels:[{l:'WhatsApp Business',v:'+1 786 123 4567'},{l:'Phone',v:'+1 786 123 4567'},{l:'Email',v:'info@tr3slog.com'},{l:'Telegram',v:'@TR3SLOG'},{l:'Discord',v:'discord.gg/tr3slog'}],
      shipInvalid:'The tracking number must follow TR3-260729-PRSJ-00001.', formT:'Open a case', f:{subject:'Subject',subjectPh:'Claim, follow-up, billing…',ship:'Related shipment',shipPh:'TR3-260729-PRSJ-00001',msg:'Message',msgPh:'Describe your request'},
      submit:'Submit case', sent:'Case opened. You will receive the reference number by email.',
      openT:'Open cases', open:[{id:'CS-0231',t:'Damaged cargo',st:'Under review',when:'Jul 25'}]
    },
    rows: [
      {id:'TR3-260729-PRSJ-08821',client:'Comercial Bayamón LLC',route:'Miami → San Juan',svc:'Consolidated',status:6,eta:'Jul 31',driver:'E. Rivera'},
      {id:'TR3-260729-RDPC-08790',client:'Farmacia Del Valle',route:'San Juan → Ponce',svc:'Last mile',status:7,eta:'Jul 27',driver:'J. Mejía'},
      {id:'TR3-260729-EUAL-08744',client:'Tienda Caguas Centro',route:'Miami → Santo Domingo',svc:'Ocean freight',status:8,eta:'Jul 22',driver:'C. Núñez'},
      {id:'TR3-260729-EUAL-08702',client:'Almacén Bayamón Sur',route:'Bayamón → Caguas',svc:'Local delivery',status:0,eta:'—',driver:''},
      {id:'TR3-260729-PRSJ-08698',client:'E-shop Isla Verde',route:'Miami → Orlando',svc:'Ground freight',status:9,eta:'Jul 26',driver:'P. Rivas'}
    ],
    invoices: [
      {id:'INV-1044',ship:'TR3-260729-PRSJ-08821',date:'Jul 24, 2026',amount:'$1,025.00',paid:false},
      {id:'INV-1043',ship:'TR3-260729-RDPC-08790',date:'Jul 21, 2026',amount:'$318.00',paid:false},
      {id:'INV-1042',ship:'TR3-260729-EUAL-08744',date:'Jul 14, 2026',amount:'$1,240.00',paid:true},
      {id:'INV-1041',ship:'TR3-260729-PRSJ-08698',date:'Jul 08, 2026',amount:'$640.00',paid:true}
    ],
    drivers: [
      {n:'E. Rivera',v:'Van 04',s:'18',p:'11 / 18',st:'On route'},
      {n:'J. Mejía',v:'Van 07',s:'14',p:'9 / 14',st:'On route'},
      {n:'C. Núñez',v:'Truck 02',s:'6',p:'6 / 6',st:'Completed'},
      {n:'P. Rivas',v:'Van 11',s:'0',p:'—',st:'Available'}
    ],
    incidents: [
      {id:'CS-0231',ship:'TR3-260729-EUAL-08744',type:'Damaged cargo',when:'Jul 25 · 10:12',st:'Under review'},
      {id:'CS-0230',ship:'TR3-260729-RDPC-08790',type:'Failed delivery attempt',when:'Jul 24 · 16:40',st:'Rescheduled'}
    ]
  ,
    drv: {
      title:'Drivers', sub:'Driver roster, documents, assigned vehicle, shifts and employment status.',
      searchPh:'Search by name, identifier or vehicle', filters:['All','Active','On route','Available','Suspended','Documents expiring'],
      counted:'matches', empty:'No driver matches the selected filters.', emptyHint:'Change the filter or clear the search term.',
      cols:['Driver','Identifier','Vehicle','Hub','Shift','Documents','Status','Actions'],
      view:'View profile', newDriver:'Register driver', backList:'Back to list',
      states:{active:'Active',route:'On route',available:'Available',suspended:'Suspended',offduty:'Off duty'},
      docState:{ok:'Valid',soon:'Expiring soon',expired:'Expired',missing:'Missing'},
      tabs:['Profile','Documents','Vehicle','Shifts','Suspension'],
      profileT:'Driver details', profileNote:'Identity is verified in the driver app. This screen only shows the result.',
      fields:{name:'Full name',id:'Internal identifier',idType:'Identification type',idNum:'Identification',phone:'Phone',email:'Email',hub:'Operating hub',hired:'Start date',contract:'Contract type',emergency:'Emergency contact'},
      identityT:'Identity verification', identityState:'Verified', identityBy:'Reviewed by', identityWhen:'Review date', identityMasked:'Only the last four digits are shown.',
      docsT:'Driver documents', docsNote:'Files are stored encrypted. Each download is recorded in the audit log.',
      docCols:['Document','Number','Issued','Expires','Status','Actions'],
      docs:[
        {n:'Driver license',num:'PR-4471882',iss:'14 Mar 2024',exp:'14 Mar 2028',st:'ok'},
        {n:'Government ID',num:'•••• 4821',iss:'10 Jan 2024',exp:'10 Jan 2030',st:'ok'},
        {n:'Medical certificate',num:'MED-2026-118',iss:'02 Feb 2026',exp:'02 Feb 2027',st:'ok'},
        {n:'Background check',num:'BG-2026-441',iss:'18 Jan 2026',exp:'18 Jan 2027',st:'ok'},
        {n:'Cargo handling training',num:'TR-0912',iss:'20 Apr 2026',exp:'20 Apr 2027',st:'ok'},
        {n:'Incident protocol',num:'—',iss:'—',exp:'—',st:'missing'}
      ],
      vehicleT:'Assigned vehicle', vehicleNote:'The pre-trip inspection is recorded in the driver app before the shift starts.',
      vehicle:{unit:'Van 04',plate:'PR-8842',type:'Refrigerated van',year:'2023',capacity:'1,200 kg · 14 m³',odometer:'——',insurance:'POL-99412 · expires 02 Sep 2026',inspection:'INSP-2026-04 · expires 18 Aug 2026',maintenance:'——'},
      vehicleFields:{unit:'Unit',plate:'Plate',type:'Type',year:'Year',capacity:'Capacity',odometer:'Odometer',insurance:'Insurance',inspection:'Inspection',maintenance:'Next maintenance'},
      shiftsT:'Shifts and activity', shiftsNote:'Hours come from shift control; totals are approved by operations.',
      shiftCols:['Date','Shift','Clock in','Clock out','Hours','Route','Status'],
      shifts:[
        {d:'27 Jul 2026',w:'06:00–14:00',in:'05:52',out:'——',h:'——',route:'RT-2607-A',st:'route'},
        {d:'26 Jul 2026',w:'06:00–14:00',in:'05:58',out:'14:12',h:'8.2',route:'RT-2606-A',st:'closed'},
        {d:'25 Jul 2026',w:'06:00–14:00',in:'06:04',out:'13:48',h:'7.7',route:'RT-2605-B',st:'closed'},
        {d:'24 Jul 2026',w:'—',in:'—',out:'—',h:'—',route:'—',st:'off'}
      ],
      shiftStates:{route:'In progress',closed:'Closed',off:'Day off',review:'Under review'},
      shiftTotals:[{l:'Hours this period',v:'——'},{l:'Approved hours',v:'——'},{l:'Hours under review',v:'——'},{l:'Stops completed',v:'——'}],
      suspendT:'Suspension and employment status', suspendNote:'Suspending blocks shift start and route assignment. The action requires a reason and is recorded in the audit log.',
      suspendReasonT:'Reason for suspension',
      suspendReasons:['Expired document','Incident under investigation','Protocol breach','Driver request','Lack of availability','Vehicle unavailable','Identity verification pending','Human resources decision'],
      suspendUntil:'In effect until', suspendNotes:'Notes for the record', suspendNotesPh:'Context that will stay in the record',
      suspendBtn:'Suspend driver', reinstateBtn:'Reinstate driver',
      suspendDone:'Driver suspended. The change is recorded in the audit log and does not persist without the personnel service.',
      reinstateDone:'Driver reinstated. The change is recorded in the audit log and does not persist without the personnel service.',
      suspendNeedsReason:'Choose a reason for the suspension.',
      historyT:'Employment history',
      history:[
        {t:'Reinstated after license expiry',m:'12 May 2026 · Human resources'},
        {t:'Suspended for expired document',m:'28 Apr 2026 · Compliance'},
        {t:'Registered as driver',m:'14 Mar 2024 · Human resources'}
      ],
      rows:[
        {n:'E. Rivera',id:'DRV-0412',v:'Van 04 · PR-8842',hub:'San Juan hub',shift:'06:00–14:00',doc:'ok',st:'route'},
        {n:'J. Mejía',id:'DRV-0418',v:'Van 07 · PR-9104',hub:'San Juan hub',shift:'06:00–14:00',doc:'soon',st:'route'},
        {n:'A. Castillo',id:'DRV-0423',v:'Van 09 · PR-7719',hub:'Caguas hub',shift:'14:00–22:00',doc:'ok',st:'active'},
        {n:'P. Rivas',id:'DRV-0431',v:'Van 11 · PR-6620',hub:'Caguas hub',shift:'—',doc:'ok',st:'available'},
        {n:'M. Solano',id:'DRV-0437',v:'—',hub:'Santo Domingo hub',shift:'—',doc:'expired',st:'suspended'},
        {n:'R. Núñez',id:'DRV-0442',v:'Van 15 · RD-2284',hub:'Santo Domingo hub',shift:'08:00–16:00',doc:'ok',st:'offduty'}
      ],
      pending:'Registering and offboarding drivers requires the personnel service. Changes made on this screen do not persist.'
    },
    inc: {
      title:'Incidents', sub:'Open cases with type, severity, evidence, investigation owner, costs and resolution.',
      searchPh:'Search by case, shipment or driver', filters:['All','Open','Under investigation','High severity','With cost','Closed'],
      counted:'matches', empty:'No incident matches the selected filters.', emptyHint:'Change the filter or clear the search term.',
      cols:['Case','Shipment','Type','Severity','Reported','Investigator','Status','Actions'],
      view:'View case', newCase:'Open case', backList:'Back to list',
      sev:{low:'Low',med:'Medium',high:'High',critical:'Critical'},
      states:{open:'Open',investigating:'Under investigation',pending:'Awaiting information',resolved:'Resolved',closed:'Closed',rejected:'Rejected'},
      tabs:['Detail','Evidence','Investigation','Costs','Resolution'],
      detailT:'Case detail',
      fields:{id:'Case',ship:'Shipment',type:'Type',sev:'Severity',when:'Reported',by:'Reported by',driver:'Driver',vehicle:'Vehicle',route:'Route',stop:'Stop',place:'Location',desc:'Description'},
      types:['Damaged goods','Missing piece','Failed delivery attempt','Address problem','Delay','Traffic accident','Theft or loss','Vehicle failure','Protocol breach'],
      descVal:'The package arrived with the box open and the contents displaced. The recipient refused the delivery and the driver documented the condition on site.',
      safetyT:'Safety and third parties',
      safety:[{l:'People injured',v:'No'},{l:'Police involvement',v:'No'},{l:'Insurance report',v:'Pending'},{l:'Third parties involved',v:'No'}],
      evidenceT:'Case evidence', evidenceNote:'Evidence comes from the driver app and the delivery record. It is append only.',
      evidence:[
        {n:'Damage photo',src:'Driver app',st:'ok'},
        {n:'Package photo at location',src:'Delivery record',st:'ok'},
        {n:'Recipient signature',src:'Delivery record',st:'missing'},
        {n:'Location and time',src:'Amazon Location',st:'ok'},
        {n:'Incident video',src:'—',st:'missing'}
      ],
      evCols:['Item','Source','Status'],
      evStates:{ok:'Available',missing:'Not captured',restricted:'Restricted'},
      investT:'Investigation', investNote:'Every update is recorded with author and date. The history is append only.',
      investFields:{owner:'Assigned investigator',opened:'Opened',due:'Response commitment',contact:'Customer contact',finding:'Preliminary finding'},
      investVals:{owner:'C. Méndez · Operations',opened:'25 Jul 2026 · 10:12',due:'28 Jul 2026',contact:'Notified on 25 Jul 2026',finding:'Packaging did not meet the standard for stacked cargo.'},
      timelineT:'Case activity',
      timeline:[
        {t:'Evidence received from the driver app',m:'25 Jul 2026 · 10:14 · E. Rivera'},
        {t:'Case assigned to investigation',m:'25 Jul 2026 · 10:40 · Operations'},
        {t:'Customer notified',m:'25 Jul 2026 · 11:05 · Support'},
        {t:'Preliminary finding recorded',m:'26 Jul 2026 · 09:20 · C. Méndez'}
      ],
      costT:'Case costs', costNote:'Amounts are reference values. Refunds and credits require approval and are not issued from this screen.',
      costCols:['Item','Owner','Amount','Status'],
      costs:[
        {n:'Declared value of the goods',who:'Insurance',v:'——',st:'pending'},
        {n:'Order reshipment',who:'TR3SLOG',v:'——',st:'pending'},
        {n:'Customer credit',who:'Finance',v:'——',st:'blocked'},
        {n:'Insurance deductible',who:'TR3SLOG',v:'——',st:'pending'}
      ],
      costStates:{pending:'To be determined',approved:'Approved',blocked:'Requires approval',rejected:'Rejected'},
      costTotals:[{l:'Estimated cost',v:'——'},{l:'Covered by insurance',v:'——'},{l:'Cost absorbed',v:'——'}],
      resolT:'Resolution', resolNote:'Closing a case does not close the delivery or issue payments. A delivery is closed with complete evidence.',
      resolReasonT:'Resolution applied',
      resolOptions:['Order reshipment','Customer credit','Refund requested','Insurance claim','No TR3SLOG liability','Process adjustment','Driver training','Duplicate case'],
      resolNotes:'Closing notes', resolNotesPh:'Explanation that will stay in the record',
      preventT:'Preventive action', preventPh:'Process change or control resulting from the case',
      closeBtn:'Close case', reopenBtn:'Reopen case',
      closeDone:'Case closed. The resolution is recorded in the audit log and does not persist without the case service.',
      reopenDone:'Case reopened. The change is recorded in the audit log.',
      needsResolution:'Choose the resolution applied.',
      needsEvidence:'The case cannot be closed: required evidence is missing.',
      rows:[
        {id:'CS-0231',ship:'TR3-260729-EUAL-08744',type:0,sev:'high',when:'25 Jul · 10:12',owner:'C. Méndez',st:'investigating',cost:true},
        {id:'CS-0230',ship:'TR3-260729-RDPC-08790',type:2,sev:'med',when:'24 Jul · 16:40',owner:'A. Rojas',st:'pending',cost:false},
        {id:'CS-0229',ship:'TR3-260729-PRSJ-08698',type:1,sev:'high',when:'23 Jul · 09:05',owner:'C. Méndez',st:'investigating',cost:true},
        {id:'CS-0228',ship:'TR3-260729-EUAL-08651',type:4,sev:'low',when:'21 Jul · 14:22',owner:'A. Rojas',st:'resolved',cost:false},
        {id:'CS-0227',ship:'TR3-260729-RDPC-08604',type:7,sev:'critical',when:'19 Jul · 07:48',owner:'R. Vega',st:'closed',cost:true}
      ],
      pending:'Creating and formally closing cases requires the incident service. Changes made on this screen do not persist.'
    }
  };
})();
