// Business portal (41–50) — English
(function () {
  var root = window.TR3S_I18N = window.TR3S_I18N || {}; var d = root.en = root.en || {};
  d.biz = {
    shell: { portal:'Business portal', company:'Comercial Bayamón LLC', account:'Account BIZ-0241 · Administrator', signout:'Sign out', searchPh:'Search tracking, location or employee', section:{ops:'Operations',finance:'Billing',admin:'Administration'} },
    nav: { dash:'Dashboard', shipments:'Shipments', bulk:'Bulk upload', recurring:'Recurring deliveries', locations:'Locations', team:'Team', roles:'Roles & permissions', reports:'Reports', billing:'Billing account', invoices:'Statements & invoices' },
    common: { export:'Export', pdf:'PDF', excel:'Excel', save:'Save', cancel:'Cancel', confirm:'Confirm', back:'Back', next:'Continue', view:'View', download:'Download', add:'Add', invite:'Invite', edit:'Edit', remove:'Remove', pause:'Pause', resume:'Resume', active:'Active', inactive:'Inactive', pending:'Pending', approved:'Approved', empty:'No data for the selected filters.', loading:'Loading…', required:'Please complete the required fields.', audit:'Audit log', lastUpdate:'Last update', restricted:'Restricted for your role.', savedOk:'Changes saved.', exportOk:'Export generated.' },
    dash: {
      title:'Account overview', period:'July 2026',
      kpis:[{l:'Active shipments',v:'14'},{l:'Pending pickups',v:'4'},{l:'Deliveries in progress',v:'6'},{l:'Monthly volume',v:'248'},{l:'Success rate',v:'97.6%'},{l:'Outstanding balance',v:'$1,343.00'}],
      perfT:'Performance summary',
      perf:[{l:'Average delivery time',v:'1.8 days'},{l:'Failed deliveries',v:'3'},{l:'Open claims',v:'1'}],
      invoicesT:'Recent invoices', quickT:'Quick actions',
      quick:['Create shipment','Bulk upload','Schedule pickup','View reports'],
      alertsT:'Alerts',
      alerts:[{t:'Invoice due soon',d:'INV-1044 is due in 3 days · $1,025.00'},{t:'Address needs review',d:'2 locations without delivery instructions.'}]
    },
    ship: {
      title:'Company shipments', searchPh:'Search by tracking number',
      filters:{status:'Status',location:'Location',date:'Date',service:'Service',employee:'Employee'},
      statuses:['All','In transit','Out for delivery','Delivered','Exception'],
      cols:['Tracking','Route','Service','Employee','Status','Evidence'],
      bulkT:'Bulk actions', bulk:['Export selection','Request pickup','Download evidence'],
      selected:'selected', exception:'Exception', evidence:'View evidence',
      rows:[
        {id:'TR3-260729-PRSJ-08821',route:'Miami → San Juan',svc:'Consolidated',emp:'L. Ortiz',st:6,exc:false},
        {id:'TR3-260729-RDPC-08790',route:'San Juan → Ponce',svc:'Last mile',emp:'L. Ortiz',st:7,exc:false},
        {id:'TR3-260729-EUAL-08744',route:'Miami → Santo Domingo',svc:'Ocean freight',emp:'R. Colón',st:8,exc:true},
        {id:'TR3-260729-EUAL-08702',route:'Bayamón → Caguas',svc:'Local delivery',emp:'R. Colón',st:0,exc:false},
        {id:'TR3-260729-PRSJ-08698',route:'Miami → Orlando',svc:'Ground freight',emp:'M. Díaz',st:8,exc:false}
      ]
    },
    bulk: {
      title:'Bulk shipment upload', steps:['File','Validation','Preview','Confirmation'],
      dropT:'Drag your CSV or Excel file here', dropNote:'Up to 500 rows per batch · .csv, .xlsx',
      template:'Download template', file:'shipments-july.csv · 128 rows',
      validationT:'Column and address validation',
      checks:[{l:'Required columns',v:'12 / 12'},{l:'Addresses validated',v:'124 / 128'},{l:'Duplicates detected',v:'2'},{l:'Rows with errors',v:'4'}],
      errorsT:'Error report',
      errors:[{row:'Row 18',msg:'ZIP code does not match the municipality provided.'},{row:'Row 46',msg:'Duplicate tracking reference within the same file.'},{row:'Row 91',msg:'Recipient phone is missing.'},{row:'Row 112',msg:'Declared weight exceeds the service limit.'}],
      downloadErrors:'Download error report',
      previewT:'Batch preview', previewNote:'Shipments are not created until you confirm the batch.',
      cols:['Row','Recipient','Destination','Service','Weight','Status'],
      preview:[
        {r:'1',to:'Farmacia Del Valle',dest:'San Juan, PR',svc:'Last mile',w:'12 lbs',ok:true},
        {r:'2',to:'Tienda Caguas Centro',dest:'Caguas, PR',svc:'Local delivery',w:'34 lbs',ok:true},
        {r:'18',to:'Colmado La Loma',dest:'Ponce, PR',svc:'Local delivery',w:'8 lbs',ok:false},
        {r:'46',to:'E-shop Isla Verde',dest:'Carolina, PR',svc:'Last mile',w:'22 lbs',ok:false}
      ],
      confirmBtn:'Confirm batch', confirmed:'Batch confirmed. 124 shipments created, 4 rows excluded.',
      historyT:'Upload history',
      history:[{f:'shipments-june.csv',d:'Jun 30, 2026',n:'211 shipments',st:'Completed'},{f:'shipments-may.csv',d:'May 31, 2026',n:'186 shipments',st:'Completed'}]
    },
    rec: {
      title:'Recurring deliveries', create:'Create schedule',
      freqT:'Frequency', freq:['Daily','Weekly','Biweekly','Monthly'],
      f:{pickup:'Pickup location',dest:'Delivery locations',svc:'Service type',window:'Preferred window',contact:'Assigned contact'},
      cols:['Schedule','Frequency','Origin','Destinations','Window','Status'],
      rows:[
        {id:'RC-014',freq:'Weekly · Mon',from:'Bayamón South Warehouse',to:'4 stores',w:'08:00 – 11:00',st:'Active'},
        {id:'RC-011',freq:'Daily',from:'Miami center',to:'San Juan hub',w:'14:00 – 17:00',st:'Active'},
        {id:'RC-008',freq:'Monthly · day 1',from:'Caguas office',to:'2 locations',w:'11:00 – 14:00',st:'Paused'}
      ],
      historyT:'Run history',
      history:[{d:'Jul 21, 2026',n:'RC-014 · 4 deliveries',st:'Completed'},{d:'Jul 14, 2026',n:'RC-014 · 4 deliveries',st:'Completed'},{d:'Jul 07, 2026',n:'RC-014 · 3 deliveries · 1 failed',st:'With exception'}]
    },
    loc: {
      title:'Business locations', add:'Add location',
      types:['Store','Warehouse','Office','Pickup center','Billing'],
      cols:['Location','Type','Contact','Hours','Status'],
      instructionsT:'Delivery instructions',
      rows:[
        {n:'Bayamón South Warehouse',type:1,addr:'Rd. 167 Km 4.2, Bayamón',c:'R. Colón · +1 787 555 0142',h:'Mon – Sat · 7:00 – 17:00',active:true,ins:'Deliver at the rear dock.'},
        {n:'Tienda Caguas Centro',type:0,addr:'88 Betances St, Caguas',c:'M. Díaz · +1 787 555 0177',h:'Mon – Sun · 9:00 – 20:00',active:true,ins:'Coordinate with shift supervisor.'},
        {n:'San Juan Office',type:2,addr:'1204 Roosevelt Ave, San Juan',c:'L. Ortiz · +1 787 555 0118',h:'Mon – Fri · 8:00 – 18:00',active:true,ins:'Front desk on the second floor.'},
        {n:'Miami Center',type:3,addr:'1234 Logistics Way, Miami, FL',c:'J. Pérez · +1 786 555 0102',h:'Mon – Fri · 8:00 – 19:00',active:false,ins:'No instructions on file.'}
      ]
    },
    team: {
      title:'Business team members', invite:'Invite employee',
      roles:['Business Owner','Business Administrator','Shipping Manager','Billing Manager','Viewer'],
      cols:['Employee','Role','Location','Last login','Status'],
      f:{email:'Employee email',role:'Role',loc:'Assigned location',finance:'Restrict financial access',ship:'Restrict shipment access'},
      suspend:'Suspend', reactivate:'Reactivate', removeAccess:'Remove access',
      invited:'Invitation sent.',
      rows:[
        {n:'Lourdes Ortiz',e:'l.ortiz@bayamon.com',role:0,loc:'San Juan Office',last:'Today · 09:42',st:'Active'},
        {n:'Rafael Colón',e:'r.colon@bayamon.com',role:2,loc:'Bayamón South Warehouse',last:'Today · 08:10',st:'Active'},
        {n:'María Díaz',e:'m.diaz@bayamon.com',role:3,loc:'Tienda Caguas Centro',last:'Yesterday · 17:26',st:'Active'},
        {n:'Jorge Pérez',e:'j.perez@bayamon.com',role:4,loc:'Miami Center',last:'Jul 12 · 11:04',st:'Suspended'}
      ]
    },
    perm: {
      title:'Roles & permissions', note:'Permission changes are recorded in the account audit history.',
      items:['Create shipment','Approve shipment','View tracking','Manage locations','View invoices','Make payments','Export reports','Manage team members','Submit claims','Access integrations'],
      matrix:[
        [1,1,1,1,1,1,1,1,1,1],
        [1,1,1,1,1,1,1,1,1,1],
        [1,1,1,1,0,0,1,0,1,0],
        [0,0,1,0,1,1,1,0,1,0],
        [0,0,1,0,0,0,0,0,0,0]
      ],
      allowed:'Allowed', denied:'No access'
    },
    rep: {
      title:'Business reports', period:'Period', periods:['Last 30 days','Current quarter','Year to date'],
      cards:[
        {l:'Shipment volume',v:'248',n:'+18% vs. previous period'},
        {l:'Cost by period',v:'$18,420',n:'average $74.28 per shipment'},
        {l:'Cost by location',v:'4 locations',n:'highest: Bayamón South Warehouse'},
        {l:'Delivery performance',v:'97.6%',n:'target 95%'},
        {l:'Failed deliveries',v:'3',n:'2 rescheduled · 1 returned'},
        {l:'Average delivery time',v:'1.8 days',n:'pickup to delivery'},
        {l:'Service usage',v:'6 services',n:'most used: last mile'},
        {l:'Claims & incidents',v:'1',n:'under review'},
        {l:'Route performance',v:'12 routes',n:'visible per permissions'}
      ],
      exportT:'Export', exportNote:'Exports respect your role permissions.'
    },
    bill: {
      title:'Billing account',
      profileT:'Billing profile', contactsT:'Billing contacts', methodT:'Payment method',
      termsT:'Payment terms', creditT:'Credit limit', balanceT:'Outstanding balance',
      statementsT:'Statements', taxT:'Tax information', autopayT:'Automatic payment', notifT:'Billing notifications',
      f:{legal:'Legal name',ein:'EIN / Tax ID',address:'Billing address',email:'Billing email',phone:'Phone'},
      values:{legal:'Comercial Bayamón LLC',ein:'66-0421887',address:'Rd. 167 Km 4.2, Bayamón, PR 00961',email:'billing@bayamon.com',phone:'+1 787 555 0118'},
      contacts:[{n:'María Díaz',r:'Billing Manager',e:'m.diaz@bayamon.com'},{n:'Lourdes Ortiz',r:'Business Owner',e:'l.ortiz@bayamon.com'}],
      method:'Card ending 4242 · Expires 09/2028', terms:'Net 30 days', credit:'$25,000.00', balance:'$1,343.00',
      autopayOn:'Auto-charge on due date', autopayOff:'Manual payment',
      notifs:['New invoice issued','Due date reminder','Payment received','Charge disputed'],
      taxNote:'Tax documents are issued according to the jurisdiction of each operation.'
    },
    inv: {
      title:'Statements, invoices & receipts',
      periodT:'Statement period', periods:['July 2026','June 2026','May 2026'],
      cols:['Document','Shipment','Issued','Amount','Status',''],
      tabs:['Invoices','Credits','Adjustments','Refunds','Disputes'],
      statuses:{paid:'Paid',pending:'Pending',overdue:'Overdue',credit:'Credit',adjust:'Adjustment',refund:'Refunded',disputed:'Disputed'},
      pay:'Pay', receipt:'Receipt', invoice:'Invoice', statement:'Download statement',
      dispute:'Dispute charge', disputed:'Charge marked as disputed.',
      rows:[
        {id:'INV-1044',ship:'TR3-260729-PRSJ-08821',d:'Jul 24, 2026',a:'$1,025.00',st:'pending',tab:0},
        {id:'INV-1043',ship:'TR3-260729-RDPC-08790',d:'Jul 21, 2026',a:'$318.00',st:'overdue',tab:0},
        {id:'INV-1042',ship:'TR3-260729-EUAL-08744',d:'Jul 14, 2026',a:'$1,240.00',st:'paid',tab:0},
        {id:'CR-0112',ship:'TR3-260729-PRSJ-08698',d:'Jul 12, 2026',a:'-$85.00',st:'credit',tab:1},
        {id:'AJ-0090',ship:'TR3-260729-EUAL-08744',d:'Jul 10, 2026',a:'-$45.00',st:'adjust',tab:2},
        {id:'RF-0031',ship:'TR3-260729-EUAL-08621',d:'Jul 02, 2026',a:'$210.00',st:'refund',tab:3},
        {id:'INV-1039',ship:'TR3-260729-PRSJ-08590',d:'Jun 28, 2026',a:'$96.00',st:'disputed',tab:4}
      ]
    }
  };
})();
