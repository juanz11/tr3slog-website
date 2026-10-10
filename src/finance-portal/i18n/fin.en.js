// Finance, accounting & claims (61–68) — English
(function () {
  var root = window.TR3S_I18N = window.TR3S_I18N || {}; var d = root.en = root.en || {};
  d.fin = {
    shell: { portal:'Finance & claims', account:'TR3SLOG · Internal administration', signout:'Sign out', searchPh:'Search transaction, invoice, claim or customer',
      demo:'Placeholder figures', section:{finance:'Finance & accounting',claims:'Claims & resolution'},
      roleT:'Active role', stateT:'View state',
      states:{data:'Data',loading:'Loading',empty:'Empty',error:'Error'},
      roles:{super:'Super administrator',finance:'Finance manager',support:'Support agent',compliance:'Compliance reviewer',ops:'Operations manager'} },
    nav: { fin:'Finance dashboard', tx:'Payment transactions', refunds:'Refunds & adjustments', recon:'Reconciliation', finrep:'Financial reports', claims:'Claims center', claim:'Claim investigation', claimpol:'Claims policy' },
    common: { export:'Export', pdf:'PDF', excel:'Excel', filters:'Filters', search:'Search', save:'Save', cancel:'Cancel', submit:'Submit', approve:'Approve', reject:'Reject', view:'View', download:'Download', all:'All',
      empty:'No records for the selected filters.', emptyHint:'Adjust the period or clear the filters to see results.',
      errorT:'The information could not be loaded', errorHint:'The finance service did not respond. Retry in a moment.', retry:'Retry',
      deniedT:'You do not have access to this section', deniedHint:'Financial information is limited to authorized roles. Request access from an organization administrator.',
      required:'Please complete the required fields.', exported:'Export prepared and sent to your email.',
      auditT:'Audit history', auditNote:'Audit records are immutable and cannot be edited by administrators.',
      restricted:'Restricted to authorized roles' },
    fin: {
      title:'Finance dashboard', sub:'Consolidated view of revenue, collections and balances across active markets.',
      stats:[{k:'Revenue (month to date)',v:'$ ——',d:'Placeholder'},{k:'Collected payments',v:'$ ——',d:'Placeholder'},{k:'Outstanding balance',v:'$ ——',d:'Placeholder'},{k:'Overdue invoices',v:'——',d:'Over 30 days'},{k:'Refunds issued',v:'$ ——',d:'Placeholder'},{k:'Credits & adjustments',v:'$ ——',d:'Placeholder'}],
      filters:['This month','Last month','Quarter','Year','All business accounts'],
      svc:{t:'Revenue by service',exp:true,cols:['Service','Shipments','Revenue','Average ticket','Share'],rows:[
        {c:['Domestic parcel','——','$ ——','$ ——','—— %']},{c:['Consolidated international','——','$ ——','$ ——','—— %']},
        {c:['Full load','——','$ ——','$ ——','—— %']},{c:['Warehouse & storage','——','$ ——','$ ——','—— %']}]},
      mkt:{t:'Revenue by market',exp:true,cols:['Market','Revenue','Outstanding','Status'],rows:[
        {c:['United States','$ ——','$ ——'],st:'ok',pill:'Active'},{c:['Puerto Rico','$ ——','$ ——'],st:'ok',pill:'Active'},
        {c:['Dominican Republic','$ ——','$ ——'],st:'ok',pill:'Active'},{c:['Venezuela','—','—'],st:'warn',pill:'Future expansion'}]},
      fails:{t:'Payment failures requiring attention',cols:['Account','Invoice','Amount','Attempts','Status'],rows:[
        {c:['Distribuidora Caribe','INV-20418','$ ——','3'],st:'bad',pill:'Card declined'},
        {c:['Almacén Bayamón','INV-20402','$ ——','2'],st:'warn',pill:'Retry scheduled'}]},
      note:'Figures shown are placeholders until the accounting integration is authorized. No real financial data is displayed.',
      live:{stats:['Payments processed','Pending payments','Registered shipments','Quotes received','Reported incidents','Payroll transactions'],d:'Live data',
        trackT:'Shipments by service',trackCols:['Tracking','Service','Origin','Destination','Date'],
        none:'No type',pills:{pending:'Pending',in_transit:'In transit',delivered:'Delivered',cancelled:'Cancelled'},
        mktCols:['Market','Shipments','Revenue','Status'],
        markets:{PR:'Puerto Rico',DO:'Dominican Republic',VE:'Venezuela',US:'United States'},
        mktPills:{active:'Active',future:'In preparation'},other:'Other',
        failT:'Incidents requiring attention',failCols:['Code','Type','Reported by','Severity','Date','Status'],
        incPills:{open:'Open',in_progress:'In review',resolved:'Resolved',closed:'Closed'}}
    },
    tx: {
      title:'Payment transactions', sub:'Every payment attempt with its processor reference and refund status.',
      stats:[{k:'Transactions (period)',v:'——',d:'Placeholder'},{k:'Completed',v:'——',d:'Placeholder'},{k:'Failed',v:'——',d:'Placeholder'},{k:'Disputed',v:'——',d:'Under review'}],
      filters:['All','Pending','Authorized','Completed','Failed','Refunded','Partially refunded','Disputed'],
      list:{t:'Transactions',exp:true,cols:['Transaction','Account','Invoice','Shipment','Method','Amount','Currency','Date','Processor ref.','Status'],rows:[
        {c:['TRX-77120','Distribuidora Caribe','INV-20418','TR3-260729-EUAL-84120','Card ····4242','$ ——','USD','2026-07-24','ch_ph_0001'],st:'bad',pill:'Failed'},
        {c:['TRX-77118','Almacén Bayamón','INV-20402','TR3-260729-PRSJ-84077','Bank transfer','$ ——','USD','2026-07-24','po_ph_0002'],st:'ok',pill:'Completed'},
        {c:['TRX-77104','Importadora RD','INV-20396','TR3-260729-EUAL-83940','Card ····1881','$ ——','USD','2026-07-23','ch_ph_0003'],st:'info',pill:'Authorized'},
        {c:['TRX-77088','Retail Miami LLC','INV-20388','TR3-260729-EUAL-83712','ACH','$ ——','USD','2026-07-22','po_ph_0004'],st:'warn',pill:'Partially refunded'},
        {c:['TRX-77061','Cliente individual','INV-20377','TR3-260729-PRSJ-83540','Card ····9002','$ ——','USD','2026-07-21','ch_ph_0005'],st:'neutral',pill:'Pending'},
        {c:['TRX-77040','Textiles Santiago','INV-20361','TR3-260729-PRSJ-83411','Card ····7710','$ ——','USD','2026-07-20','ch_ph_0006'],st:'info',pill:'Disputed'}]},
      note:'Amounts and processor references are placeholders. Card numbers are always stored masked.',
      live:{cols:['Reference','Payee','Period','Base','Bonuses','Deductions','Total','Paid on','Status'],
        stats:['Payments recorded','Completed','Pending','Total paid'],d:'Live data',
        pills:{Paid:'Paid',Pending:'Pending'}}
    },
    refunds: {
      title:'Refunds & adjustments', sub:'Refund requests above the configured limit require finance approval before processing.',
      stats:[{k:'Open requests',v:'——',d:'Awaiting review'},{k:'Awaiting approval',v:'——',d:'Above limit'},{k:'Processed (month)',v:'$ ——',d:'Placeholder'},{k:'Approval limit',v:'$ ——',d:'Configurable'}],
      form:{t:'New refund request',fields:[
        {l:'Pending shipment (tracking)',ph:'Select the shipment to refund',span:1},{l:'Refund amount',ph:'$0.00',span:1},
        {l:'Refund reason',ph:'Service not rendered, duplicate charge, billing correction…',span:2},
        {l:'Supporting documentation',ph:'Attach invoice, evidence or authorization',file:true,span:2}],
        submit:'Submit request',ok:'Refund request submitted for approval.'},
      panels:[{t:'Original transaction',items:[{k:'Transaction',v:'TRX-77120'},{k:'Account',v:'Distribuidora Caribe'},{k:'Invoice',v:'INV-20418'},{k:'Method',v:'Card ····4242'},{k:'Original amount',v:'$ ——'},{k:'Payment date',v:'2026-07-24'}]},
        {t:'Approval & processing',items:[{k:'Approval status',v:'Awaiting finance manager'},{k:'Approved by',v:'—'},{k:'Processing status',v:'Not started'},{k:'Customer notification',v:'On approval'},{k:'Expected credit',v:'3–5 business days'}]}],
      steps:{t:'Approval flow',items:['Request created','Finance review','Approved','Processed by provider','Customer notified'],action:'Advance approval',ok:'Approval stage advanced and recorded in the audit log.'},
      hist:{t:'Adjustment history',exp:true,cols:['Reference','Type','Account','Amount','Date','Approved by','Status'],rows:[
        {c:['ADJ-3081','Full refund','Retail Miami LLC','$ ——','2026-07-18','A. Peralta'],st:'ok',pill:'Processed'},
        {c:['ADJ-3074','Credit note','Importadora RD','$ ——','2026-07-15','A. Peralta'],st:'ok',pill:'Processed'},
        {c:['ADJ-3069','Partial refund','Textiles Santiago','$ ——','2026-07-11','—'],st:'warn',pill:'Awaiting approval'}]},
      note:'Refunds are never processed automatically: an authorized reviewer approves each request and the decision is written to the immutable audit log.'
    },
    recon: {
      title:'Reconciliation', sub:'Match internal payments against processor records and bank deposits before closing the period.',
      stats:[{k:'Matched',v:'——',d:'Placeholder'},{k:'Unmatched',v:'——',d:'Needs review'},{k:'Missing payments',v:'——',d:'Placeholder'},{k:'Duplicates',v:'——',d:'Placeholder'}],
      filters:['Current period','Previous period','Unmatched only','Variances only'],
      diff:{t:'Unmatched transactions',exp:true,cols:['Internal record','Processor record','Bank deposit','Variance','Type','Status'],rows:[
        {c:['TRX-77118 · $ ——','po_ph_0002 · $ ——','DEP-4410','$ ——','Variance'],st:'warn',pill:'Under review'},
        {c:['TRX-77104 · $ ——','—','—','$ ——','Missing in processor'],st:'bad',pill:'Open'},
        {c:['—','ch_ph_0009 · $ ——','DEP-4408','$ ——','Missing internally'],st:'bad',pill:'Open'},
        {c:['TRX-77040 · $ ——','ch_ph_0006 · $ ——','DEP-4405','$ ——','Possible duplicate'],st:'warn',pill:'Under review'}]},
      panels:[{t:'Period closure',items:[{k:'Period',v:'July 2026'},{k:'Reconciliation status',v:'In progress'},{k:'Reviewed by',v:'—'},{k:'Closed on',v:'—'},{k:'Unresolved items',v:'——'}]},
        {t:'Resolution notes',items:[{k:'TRX-77104',v:'Awaiting processor confirmation'},{k:'ch_ph_0009',v:'Deposit received without internal record'},{k:'TRX-77040',v:'Verify possible double capture'}]}],
      closure:{t:'Period closure flow',items:['Items reviewed','Variances resolved','Finance review','Period closed'],action:'Request period closure',ok:'Closure requested. An authorized reviewer must confirm it.'},
      note:'The period cannot be marked as reconciled without review by an authorized finance role.'
    },
    finrep: {
      title:'Financial reports', sub:'Reports available to authorized finance roles, exportable as PDF or Excel.',
      filters:['This month','Quarter','Year to date','Custom range'],
      cards:{t:'Available reports',items:[
        {t:'Revenue report',s:'Revenue by period, service and market'},{t:'Accounts receivable',s:'Aging by customer and business account'},
        {t:'Outstanding balances',s:'Open invoices and days past due'},{t:'Payment collection',s:'Collections by method and processor'},
        {t:'Refund report',s:'Refunds issued, reasons and approvals'},{t:'Credits & adjustments',s:'Credit notes and manual corrections'},
        {t:'Revenue by service',s:'Comparison across service lines'},{t:'Revenue by customer',s:'Ranking by billed volume'},
        {t:'Revenue by country',s:'Active markets only'},{t:'Tax transaction summary',s:'Taxable transactions by jurisdiction'}]},
      note:'Exports are logged with the requesting user, report and period. Only roles with export permission can download financial data.',
      live:{suffix:'· {n} real records'}
    },
    claims: {
      title:'Claims center', sub:'Claims by state, value and assignment, with resolution targets.',
      stats:[{k:'Open',v:'——',d:'Placeholder'},{k:'Under review',v:'——',d:'Placeholder'},{k:'Approved',v:'——',d:'Placeholder'},{k:'Rejected',v:'——',d:'Placeholder'},{k:'Closed (month)',v:'——',d:'Placeholder'}],
      filters:['All','Open','Under review','Approved','Rejected','Closed','High priority'],
      list:{t:'Claims',exp:true,cols:['Claim','Shipment','Type','Claim value','Assigned to','Priority','Due date','Status'],rows:[
        {c:['CLM-1042','TR3-260729-EUAL-84120','Damaged shipment','$ ——','M. Solano','High','2026-07-29'],st:'warn',pill:'Under review'},
        {c:['CLM-1039','TR3-260729-EUAL-83940','Lost shipment','$ ——','J. Rivas','High','2026-07-28'],st:'bad',pill:'Open'},
        {c:['CLM-1035','TR3-260729-EUAL-83712','Missing items','$ ——','M. Solano','Medium','2026-08-02'],st:'warn',pill:'Under review'},
        {c:['CLM-1028','TR3-260729-PRSJ-83540','Delayed delivery','$ ——','L. Duarte','Low','2026-08-05'],st:'ok',pill:'Approved'},
        {c:['CLM-1021','TR3-260729-PRSJ-83411','Billing dispute','$ ——','A. Peralta','Medium','2026-07-31'],st:'neutral',pill:'Closed'}]},
      note:'Every state change is recorded with user, timestamp and previous value.',
      live:{cols:['Code','Reference','Type','Reported by','Severity','Date','Photo','Status'],
        stats:['Open','In review','Resolved','Closed','Total reported'],d:'Live data',
        pills:{open:'Open',in_progress:'In review',resolved:'Resolved',closed:'Closed'}}
    },
    claim: {
      title:'Claim CLM-1042 · Damaged shipment', sub:'Investigation with evidence, decision and complete audit history.',
      panels:[{t:'Claimant',items:[{k:'Name',v:'Distribuidora Caribe'},{k:'Contact',v:'claims@placeholder.com'},{k:'Business account',v:'BA-2041'},{k:'Filed on',v:'2026-07-22'},{k:'Claim type',v:'Damaged shipment'}]},
        {t:'Package & value',items:[{k:'Shipment',v:'TR3-260729-EUAL-84120'},{k:'Pieces',v:'3'},{k:'Weight',v:'34 lbs'},{k:'Declared value',v:'$ ——'},{k:'Claimed amount',v:'$ ——'}]},
        {t:'Decision',items:[{k:'Reviewer',v:'M. Solano'},{k:'Decision',v:'Pending'},{k:'Compensation',v:'—'},{k:'Resolution target',v:'2026-07-29'},{k:'Customer notified',v:'On decision'}]}],
      timeline:{t:'Shipment timeline',items:[{t:'Picked up',d:'2026-07-16 · Miami, FL'},{t:'In transit',d:'2026-07-17 · Consolidation'},{t:'Arrived at destination',d:'2026-07-19 · San Juan, PR'},{t:'Out for delivery',d:'2026-07-20'},{t:'Delivered with exception',d:'2026-07-20 · Damage reported'}]},
      cards:{t:'Evidence & documents',items:[
        {t:'Customer photos (4)',s:'Uploaded 2026-07-22 · secure storage'},{t:'Driver evidence',s:'Delivery photo and notes'},
        {t:'Proof of delivery',s:'Signature captured 2026-07-20'},{t:'Commercial invoice',s:'Declared value support'}]},
      notes:{t:'Internal investigation notes',fields:[{l:'Reviewer note',ph:'Findings, contact with the driver, warehouse verification…',span:2}],submit:'Save note',ok:'Internal note saved to the claim record.'},
      steps:{t:'Resolution flow',items:['Filed','Evidence collected','Investigation','Decision','Compensation & closure'],action:'Advance stage',ok:'Stage advanced and recorded in the audit log.'},
      hist:{t:'Audit history',cols:['Date','User','Action','Previous value','New value'],rows:[
        {c:['2026-07-22 09:14','Customer portal','Claim filed','—','Open']},
        {c:['2026-07-22 11:02','J. Rivas','Assigned','—','M. Solano']},
        {c:['2026-07-23 15:40','M. Solano','State change','Open','Under review']},
        {c:['2026-07-24 08:22','M. Solano','Evidence added','3 files','4 files']}]},
      note:'Documents are stored securely and are visible only to authorized reviewers.'
    },
    claimpol: {
      title:'Claims policy configuration', sub:'Customer-facing policy versions with effective dates and approval levels.',
      form:{t:'Current policy',fields:[
        {l:'Filing deadline (days)',ph:'15',span:1},{l:'Maximum compensation',ph:'$ ——',span:1},
        {l:'Resolution target (business days)',ph:'10',span:1},{l:'Policy version',ph:'v3.2',span:1},
        {l:'Effective from',ph:'2026-08-01',span:1},{l:'Effective to',ph:'—',span:1},
        {l:'Exclusions',ph:'Prohibited items, undeclared value, packaging by the customer…',span:2}],
        submit:'Save version',ok:'Policy version saved as a draft pending approval.'},
      toggles:{t:'Eligible services & required evidence',items:[
        {k:'Domestic parcel',on:true},{k:'Consolidated international',on:true},{k:'Full load',on:false},{k:'Warehouse & storage',on:false},
        {k:'Photographic evidence required',on:true},{k:'Commercial invoice required',on:true},{k:'Police report for loss',on:false}]},
      panels:[{t:'Approval levels',items:[{k:'Up to $ ——',v:'Support agent'},{k:'Up to $ ——',v:'Operations manager'},{k:'Above $ ——',v:'Finance manager'},{k:'Policy changes',v:'Super administrator'}]}],
      hist:{t:'Version history',cols:['Version','Effective from','Owner','Languages','Status'],rows:[
        {c:['v3.2','2026-08-01','A. Peralta','EN · ES · ZH'],st:'warn',pill:'Pending approval'},
        {c:['v3.1','2026-02-01','A. Peralta','EN · ES · ZH'],st:'ok',pill:'Published'},
        {c:['v3.0','2025-09-15','R. Molina','EN · ES'],st:'neutral',pill:'Archived'}]},
      note:'The customer-facing policy is published in English, Spanish and Simplified Chinese; no untranslated version is published.'
    }
  };
})();
