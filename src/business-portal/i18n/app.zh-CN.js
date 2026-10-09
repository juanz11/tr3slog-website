// App (登录 · 客户门户 · 运营后台) — 简体中文
(function () {
  var root = window.TR3S_I18N = window.TR3S_I18N || {}; var d = root['zh-CN'] = root['zh-CN'] || {};
  d.app = {
    auth: {
      signinT:'登录 TR3SLOG', signinSub:'查看您的运单、报价与单据。',
      email:'电子邮箱', emailPh:'name@company.com', password:'密码', passwordPh:'••••••••',
      remember:'保持登录状态', forgot:'忘记密码？', signinBtn:'登录',
      noAccount:'第一次使用 TR3SLOG？', createLink:'创建账户',
      signupT:'创建账户', signupSub:'完成注册即可下单并跟踪每一次作业。',
      name:'姓名', namePh:'您的姓名', company:'公司（选填）', companyPh:'Comercial Bayamón LLC',
      phone:'电话', phonePh:'+1 787 000 0000', confirm:'确认密码',
      terms:'我接受服务条款与隐私政策', signupBtn:'创建账户',
      haveAccount:'已有账户？', signinLink:'登录',
      resetT:'重置密码', resetSub:'输入邮箱，我们将发送重置链接。',
      resetBtn:'发送重置链接', resetSent:'链接已发送，请查看邮箱并按提示操作。',
      newPass:'新密码', savePass:'保存新密码', back:'返回登录',
      errEmail:'请输入有效的电子邮箱。', errPass:'密码至少需要 8 个字符。',
      errMatch:'两次输入的密码不一致。', errTerms:'请先接受条款后继续。',
      errCreds:'邮箱或密码不正确。'
    },
    shell: { roleDemo:'演示视图切换', roleDemoNote:'真实授权在服务端执行，而非本页面。', searchHint:'搜索货件', portal:'客户门户', admin:'运营后台', signout:'退出登录', viewSite:'查看网站', account:'账户', role:'企业客户 · BIZ-0241', client:'Comercial Bayamón LLC', operator:'运营 · 圣胡安枢纽', searchPh:'搜索运单号、客户或线路' },
    navC: { dashboard:'面板', shipments:'我的运单', create:'创建运单', payments:'付款与账单', addresses:'地址管理', support:'客户支持' },
    navA: { ops:'运营面板', dispatch:'运单与调度', drivers:'司机', incidents:'异常事件' },
    dash: {
      greeting:'下午好', title:'运营情况总览', newShipment:'新建运单', range:'最近 30 天',
      kpis:[{l:'在途运单',v:'14',n:'3 单运输中'},{l:'本月已送达',v:'248',n:'与上月对比'},{l:'准时率',v:'97.6%',n:'SLA 目标 95%'},{l:'待处理报价',v:'3',n:'等待您确认'}],
      activeT:'在途运单', seeAll:'查看全部',
      quickT:'快捷操作', quick:['新建运单','预约取件','查询运单','联系客服'],
      activityT:'最近动态',
      activity:[{t:'已送达 Daniela Cruz',m:'TR3-260729-EUAL-08744 · 12 分钟前'},{t:'司机已取件',m:'TR3-260729-RDPC-08790 · 38 分钟前'},{t:'新运单已创建',m:'TR3-260729-PRSJ-08821 · 1 小时前'},{t:'账单 INV-1042 已支付',m:'$1,240.00 · 昨天'}],
      alertsT:'提醒',
      alerts:[{t:'报价待确认',d:'报价 QT-0091 将在 2 天后到期。'},{t:'地址待确认',d:'TR3-260729-EUAL-08702 缺少收件人电话。'}]
    },
    ship: {
      title:'我的运单', searchPh:'按运单号、城市或收件人搜索',
      filters:['全部','运输中','派送中','已送达','待处理'],
      cols:['运单号','线路','服务','状态','送达',''],
      empty:'没有符合条件的运单。请调整筛选或清空搜索。',
      view:'查看', results:'个运单'
    },
    detail: {
      title:'运单详情', back:'返回我的运单',
      addressesT:'地址', from:'寄件方', to:'收件方',
      fromVal:'Comercial Bayamón LLC\n1234 Logistics Way, 迈阿密, FL 33101',
      toVal:'Daniela Cruz\n圣胡安 Roosevelt 大道 1204 号, PR 00920',
      chargesT:'费用', charges:[{l:'运费',v:'$860.00'},{l:'集拼费',v:'$120.00'},{l:'单据费',v:'$45.00'}],
      total:'合计', totalVal:'$1,025.00',
      docPending:'接入文档服务后才会生成该文件。', docsT:'单据', docs:['提单','商业发票','装箱单'], download:'下载',
      evidenceT:'交付凭证', timelineT:'完整时间线'
    },
    pod: {
      title:'交付档案', open:'查看完整档案', back:'返回运单',
      subInt:'完整的交付记录，按角色控制访问，并记录每一次查阅。',
      subCli:'您的交付确认：日期、时间、签收人以及可提供的凭证。',
      subSup:'索赔视图：已记录的事实、凭证完整性以及可共享的范围。',
      viewT:'视图', views:{ internal:'运营', customer:'客户', support:'客户支持' },
      viewNote:{
        internal:'内部视图。包含签收人与车队数据，不向客户展示。',
        customer:'客户视图。不含签收人个人数据，也不含车队位置。',
        support:'客户支持视图。仅可读，用于支持或驳回索赔。'
      },
      statusT:'交付状态', statusVal:'已交付 · 凭证完整',
      completeT:'凭证完整', incompleteT:'凭证不完整',
      summaryT:'交付摘要',
      summary:[
        {k:'运单号',v:'TR3-260729-PRSJ-08821'},
        {k:'日期与时间',v:'—— · 设备时区'},
        {k:'交付地址',v:'Calle Betances 88, Caguas, PR'},
        {k:'服务',v:'本地交付 · 需核验证件'},
        {k:'路线',v:'RT-2607-A'},
        {k:'记录来源',v:'司机端 · 离线记录，稍后同步'}
      ],
      receiverT:'签收人身份', receiverRestricted:'受限 · 仅运营与客户支持',
      receiver:[
        {k:'签收人姓名',v:'——'},
        {k:'与收件人关系',v:'员工'},
        {k:'证件类型',v:'驾驶证'},
        {k:'号码',v:'•••• 4821'},
        {k:'授权',v:'本人已授权'},
        {k:'证件影像',v:'2 张 · 已加密'}
      ],
      receiverHidden:'客户视图中不显示签收人数据。',
      receiverMaskNote:'仅保留后四位。完整号码从不存储也不显示。',
      evidenceT:'已采集凭证',
      evidence:[
        {t:'包裹照片',d:'使用设备摄像头拍摄',st:'ok'},
        {t:'签收人签名',d:'交付时在屏幕上签署',st:'ok'},
        {t:'证件正面',d:'仅运营与客户支持可见',st:'restricted'},
        {t:'证件背面',d:'该证件类型要求提供',st:'restricted'},
        {t:'地点照片',d:'可选 · 本次交付未拍摄',st:'missing'}
      ],
      evStates:{ ok:'可查看', restricted:'受限', missing:'未采集' },
      viewImage:'查看影像', restrictedImage:'无权查看该影像',
      geoT:'位置与时间', geo:[
        {k:'坐标',v:'——'},
        {k:'精度',v:'—— 米'},
        {k:'设备时间',v:'——'},
        {k:'同步时间',v:'——'},
        {k:'位于地理围栏内',v:'是 · 地理围栏不会结束交付'},
        {k:'位置来源',v:'Amazon Location'}
      ],
      geoNote:'地理围栏仅作参考。交付只能凭司机采集的凭证结束。',
      chainT:'保管链', chainCols:['时间','事件','责任人','地点','状态'],
      chain:[
        {c:['——','仓库取件','C. Méndez','圣胡安枢纽','已封签']},
        {c:['——','装车','E. Rivera','3 号月台','已封签']},
        {c:['——','运输中','E. Rivera','RT-2607-A','已封签']},
        {c:['——','已交付','E. Rivera','卡瓜斯','状态良好']}
      ],
      chainNote:'保管链仅可追加：更正以引用原记录的新记录形式添加。',
      accessT:'本档案的查阅记录', accessCols:['时间','查阅人','角色','视图','事由'],
      access:[
        {c:['——','A. Rojas','客户支持','客户支持','索赔 CLM-1041']},
        {c:['——','C. Méndez','运营','运营','路线复核']},
        {c:['——','客户','门户','客户','运单查询']}
      ],
      accessNote:'每次打开档案都会记录查阅人、时间与事由。',
      integrityT:'完整性', integrity:[
        {k:'记录模式',v:'仅可追加'},
        {k:'编辑',v:'任何角色均不可编辑'},
        {k:'影像',v:'静态与传输中均加密'},
        {k:'保留期限',v:'由合规确定'},
        {k:'完整性校验',v:'待接入'}
      ],
      shareT:'可共享的内容', share:[
        {k:'包裹照片',v:'可以'},
        {k:'签名',v:'可以'},
        {k:'日期、时间与地址',v:'可以'},
        {k:'签收人姓名',v:'需获授权'},
        {k:'证件影像',v:'绝不'},
        {k:'车队位置',v:'绝不'}
      ],
      claimT:'关联索赔', claimCols:['索赔','事由','开立时间','状态'],
      claims:[{c:['CLM-1041','不认可该交付','——','审核中']}],
      actionsT:'操作',
      download:'下载凭据', downloadNote:'PDF 凭据由文档服务出具，尚未接入。',
      shareBtn:'共享给客户', shareNote:'发送给客户需要通知服务。',
      dispute:'提交索赔', disputeNote:'索赔记录在客户支持；本页面不发放任何赔付。',
      exportAudit:'导出审计', exportNote:'导出操作会记入查阅历史。',
      pending:'待接入'
    },
    create: { errStep:'请填写本步骤的必填字段。', reqMark:'必填', localNote:'货件不会在系统中创建：缺少货件服务。',
      title:'创建运单', steps:['寄件方','收件方','包裹','服务与取件','支付'],
      next:'继续', back:'返回', submit:'创建运单', success:'运单已创建，运单号 TR3-260729-PRSJ-08830。',
      f:{name:'姓名',company:'公司',address:'地址',city:'城市',zip:'邮政编码',phone:'电话',email:'邮箱',pieces:'件数',weight:'重量',dims:'尺寸',contents:'内容',declared:'申报价值',service:'服务类型',date:'取件日期',window:'时间窗',notes:'备注',payment:'支付方式',card:'尾号 4242 的卡',invoiceMe:'记入账户账单'},
      review:'创建前请确认', summary:'摘要'
    },
    pay: {
      title:'付款与账单', pendingT:'待付款', paidT:'已完成付款',
      cols:['账单','运单','开具日期','金额','状态',''],
      payNow:'立即支付', receipt:'收据', invoice:'账单', totalDue:'应付合计', paidLabel:'已支付', pendingLabel:'待支付',
      empty:'该分区暂无账单。'
    },
    ops: {
      title:'运营面板', subtitle:'实时查看配送、异常与司机运力。',
      kpis:[{l:'在途配送',v:'62',n:'18 单派送中'},{l:'延误运单',v:'5',n:'需跟进'},{l:'未分配订单',v:'7',n:'等待司机'},{l:'在途司机',v:'12',n:'共 15 人可用'}],
      delayedT:'延误运单', unassignedT:'未分配订单', driversT:'司机', incidentsT:'待处理异常',
      driverCols:['司机','车辆','站点','进度','状态'],
      incidentCols:['案件','运单','类型','上报时间','状态'],
      assign:'分配'
    },
    disp: {
      title:'运单与调度', subtitle:'在所有通道上创建、编辑并调度运单。',
      create:'创建运单', edit:'编辑', assignDriver:'分配司机', changeStatus:'变更状态',
      scheduleRoute:'排定线路', reportIncident:'上报异常',
      cols:['运单号','客户','线路','司机','状态','操作'],
      statuses:['已收到申请','待审核','已确认','已排定取件','货物已接收','处理中','运输中','派送中','已送达','异常','已取消'],
      saved:'更改已保存。', assigned:'司机已分配。', incidentSaved:'异常已上报并建立案件。',
      selectDriver:'选择司机', selectStatus:'选择状态', unassigned:'未分配', apply:'应用', cancel:'取消',
      incidentType:'异常类型', incidentTypes:['货物损坏','派送失败','地址问题','延误','缺件'], incidentNotes:'备注'
    },
    addr: {
      title:'地址管理', add:'添加地址', edit:'编辑', remove:'删除', primary:'默认', setPrimary:'设为默认',
      newT:'新增地址', editT:'编辑地址', save:'保存地址', cancelBtn:'取消', removeBtn:'删除', removed:'该地址已从本次会话中删除。', localNote:'仅保存在本次会话中。持久化需接入地址服务。', typeT:'地址类型', added:'地址已在本次会话中添加。', updated:'地址已在本次会话中更新。', types:['取件','派送','账单'], cols:['名称','地址','类型','联系人',''],
      empty:'暂无已保存地址。', saved:'地址已保存。',
      f:{name:'地址名称',address:'地址',city:'城市',zip:'邮政编码',contact:'联系人',phone:'电话',instructions:'派送说明'},
      rows:[
        {n:'巴亚蒙南部仓库',a:'巴亚蒙 167 号公路 4.2 公里, PR 00961',type:0,c:'R. Colón · +1 787 555 0142',primary:true},
        {n:'卡瓜斯中心门店',a:'卡瓜斯 Betances 街 88 号, PR 00725',type:1,c:'M. Díaz · +1 787 555 0177',primary:false},
        {n:'圣胡安办公室',a:'圣胡安 Roosevelt 大道 1204 号, PR 00920',type:1,c:'L. Ortiz · +1 787 555 0118',primary:false},
        {n:'账单 · 巴亚蒙',a:'巴亚蒙 167 号公路 4.2 公里, PR 00961',type:2,c:'billing@bayamon.com',primary:false}
      ]
    },
    support: {
      title:'客户支持', sub:'协调员将在下一个工作日内回复。',
      channelsT:'联系渠道', hoursT:'服务时间', hours:'周一至周五 · 8:00 – 18:00（AST）',
      channels:[{l:'WhatsApp Business',v:'+1 786 123 4567'},{l:'电话',v:'+1 786 123 4567'},{l:'邮箱',v:'info@tr3slog.com'},{l:'Telegram',v:'@TR3SLOG'},{l:'Discord',v:'discord.gg/tr3slog'}],
      shipInvalid:'运单号格式须为 TR3-260729-PRSJ-00001。', formT:'创建工单', f:{subject:'主题',subjectPh:'索赔、进度跟进、账单…',ship:'相关运单',shipPh:'TR3-260729-PRSJ-00001',msg:'留言',msgPh:'请描述您的需求'},
      submit:'提交工单', sent:'工单已创建，参考编号将通过邮件发送。',
      openT:'进行中的工单', open:[{id:'CS-0231',t:'货物损坏',st:'审核中',when:'7月25日'}]
    },
    rows: [
      {id:'TR3-260729-PRSJ-08821',client:'Comercial Bayamón LLC',route:'迈阿密 → 圣胡安',svc:'拼箱',status:6,eta:'7月31日',driver:'E. Rivera'},
      {id:'TR3-260729-RDPC-08790',client:'Farmacia Del Valle',route:'圣胡安 → 蓬塞',svc:'末端配送',status:7,eta:'7月27日',driver:'J. Mejía'},
      {id:'TR3-260729-EUAL-08744',client:'Tienda Caguas Centro',route:'迈阿密 → 圣多明各',svc:'海运',status:8,eta:'7月22日',driver:'C. Núñez'},
      {id:'TR3-260729-EUAL-08702',client:'Almacén Bayamón Sur',route:'巴亚蒙 → 卡瓜斯',svc:'本地配送',status:0,eta:'—',driver:''},
      {id:'TR3-260729-PRSJ-08698',client:'E-shop Isla Verde',route:'迈阿密 → 奥兰多',svc:'陆路货运',status:9,eta:'7月26日',driver:'P. Rivas'}
    ],
    invoices: [
      {id:'INV-1044',ship:'TR3-260729-PRSJ-08821',date:'2026年7月24日',amount:'$1,025.00',paid:false},
      {id:'INV-1043',ship:'TR3-260729-RDPC-08790',date:'2026年7月21日',amount:'$318.00',paid:false},
      {id:'INV-1042',ship:'TR3-260729-EUAL-08744',date:'2026年7月14日',amount:'$1,240.00',paid:true},
      {id:'INV-1041',ship:'TR3-260729-PRSJ-08698',date:'2026年7月8日',amount:'$640.00',paid:true}
    ],
    drivers: [
      {n:'E. Rivera',v:'Van 04',s:'18',p:'11 / 18',st:'在途'},
      {n:'J. Mejía',v:'Van 07',s:'14',p:'9 / 14',st:'在途'},
      {n:'C. Núñez',v:'卡车 02',s:'6',p:'6 / 6',st:'已完成'},
      {n:'P. Rivas',v:'Van 11',s:'0',p:'—',st:'可调度'}
    ],
    incidents: [
      {id:'CS-0231',ship:'TR3-260729-EUAL-08744',type:'货物损坏',when:'7月25日 · 10:12',st:'审核中'},
      {id:'CS-0230',ship:'TR3-260729-RDPC-08790',type:'派送失败',when:'7月24日 · 16:40',st:'已改期'}
    ]
  ,
    drv: {
      title:'司机', sub:'司机名册、证件、指派车辆、班次与在职状态。',
      searchPh:'按姓名、编号或车辆搜索', filters:['全部','在职','在途','可派单','已停用','证件将到期'],
      counted:'条匹配', empty:'没有司机符合所选筛选条件。', emptyHint:'请更改筛选条件或清除搜索词。',
      cols:['司机','编号','车辆','站点','班次','证件','状态','操作'],
      view:'查看档案', newDriver:'登记司机', backList:'返回列表',
      states:{active:'在职',route:'在途',available:'可派单',suspended:'已停用',offduty:'不在班'},
      docState:{ok:'有效',soon:'即将到期',expired:'已过期',missing:'缺失'},
      tabs:['档案','证件','车辆','班次','停用'],
      profileT:'司机资料', profileNote:'身份在司机端完成核验，本页面仅显示结果。',
      fields:{name:'姓名',id:'内部编号',idType:'证件类型',idNum:'证件号码',phone:'电话',email:'邮箱',hub:'所属站点',hired:'入职日期',contract:'合同类型',emergency:'紧急联系人'},
      identityT:'身份核验', identityState:'已核验', identityBy:'审核人', identityWhen:'审核日期', identityMasked:'仅显示后四位。',
      docsT:'司机证件', docsNote:'文件加密存储，每次下载均记入审计日志。',
      docCols:['证件','号码','签发','到期','状态','操作'],
      docs:[
        {n:'驾驶证',num:'PR-4471882',iss:'2024年3月14日',exp:'2028年3月14日',st:'ok'},
        {n:'官方身份证件',num:'•••• 4821',iss:'2024年1月10日',exp:'2030年1月10日',st:'ok'},
        {n:'体检证明',num:'MED-2026-118',iss:'2026年2月2日',exp:'2027年2月2日',st:'ok'},
        {n:'背景调查',num:'BG-2026-441',iss:'2026年1月18日',exp:'2027年1月18日',st:'ok'},
        {n:'货物操作培训',num:'TR-0912',iss:'2026年4月20日',exp:'2027年4月20日',st:'ok'},
        {n:'事件处理规程',num:'—',iss:'—',exp:'—',st:'missing'}
      ],
      vehicleT:'指派车辆', vehicleNote:'出车前检查在司机端于开始班次前记录。',
      vehicle:{unit:'Van 04',plate:'PR-8842',type:'冷藏厢式车',year:'2023',capacity:'1 200 公斤 · 14 立方米',odometer:'——',insurance:'POL-99412 · 2026年9月2日到期',inspection:'INSP-2026-04 · 2026年8月18日到期',maintenance:'——'},
      vehicleFields:{unit:'车辆',plate:'车牌',type:'类型',year:'年份',capacity:'载量',odometer:'里程',insurance:'保险',inspection:'检验',maintenance:'下次保养'},
      shiftsT:'班次与活动', shiftsNote:'工时来自班次管理，合计由运营审批。',
      shiftCols:['日期','班次','上班','下班','工时','路线','状态'],
      shifts:[
        {d:'2026年7月27日',w:'06:00–14:00',in:'05:52',out:'——',h:'——',route:'RT-2607-A',st:'route'},
        {d:'2026年7月26日',w:'06:00–14:00',in:'05:58',out:'14:12',h:'8.2',route:'RT-2606-A',st:'closed'},
        {d:'2026年7月25日',w:'06:00–14:00',in:'06:04',out:'13:48',h:'7.7',route:'RT-2605-B',st:'closed'},
        {d:'2026年7月24日',w:'—',in:'—',out:'—',h:'—',route:'—',st:'off'}
      ],
      shiftStates:{route:'进行中',closed:'已结束',off:'休息日',review:'审核中'},
      shiftTotals:[{l:'本期工时',v:'——'},{l:'已审批工时',v:'——'},{l:'审核中工时',v:'——'},{l:'已完成停靠',v:'——'}],
      suspendT:'停用与在职状态', suspendNote:'停用将阻止开始班次与路线派单。该操作须填写原因并记入审计日志。',
      suspendReasonT:'停用原因',
      suspendReasons:['证件过期','事件调查中','违反规程','司机申请','无法排班','车辆不可用','身份核验待处理','人力资源决定'],
      suspendUntil:'有效期至', suspendNotes:'档案备注', suspendNotesPh:'将保留在记录中的说明',
      suspendBtn:'停用司机', reinstateBtn:'恢复司机',
      suspendDone:'司机已停用。变更记入审计日志；在人事服务接入前不会持久保存。',
      reinstateDone:'司机已恢复。变更记入审计日志；在人事服务接入前不会持久保存。',
      suspendNeedsReason:'请选择停用原因。',
      historyT:'在职记录',
      history:[
        {t:'驾驶证过期后恢复',m:'2026年5月12日 · 人力资源'},
        {t:'因证件过期停用',m:'2026年4月28日 · 合规'},
        {t:'登记为司机',m:'2024年3月14日 · 人力资源'}
      ],
      rows:[
        {n:'E. Rivera',id:'DRV-0412',v:'Van 04 · PR-8842',hub:'圣胡安站',shift:'06:00–14:00',doc:'ok',st:'route'},
        {n:'J. Mejía',id:'DRV-0418',v:'Van 07 · PR-9104',hub:'圣胡安站',shift:'06:00–14:00',doc:'soon',st:'route'},
        {n:'A. Castillo',id:'DRV-0423',v:'Van 09 · PR-7719',hub:'卡瓜斯站',shift:'14:00–22:00',doc:'ok',st:'active'},
        {n:'P. Rivas',id:'DRV-0431',v:'Van 11 · PR-6620',hub:'卡瓜斯站',shift:'—',doc:'ok',st:'available'},
        {n:'M. Solano',id:'DRV-0437',v:'—',hub:'圣多明各站',shift:'—',doc:'expired',st:'suspended'},
        {n:'R. Núñez',id:'DRV-0442',v:'Van 15 · RD-2284',hub:'圣多明各站',shift:'08:00–16:00',doc:'ok',st:'offduty'}
      ],
      pending:'司机登记与离职需要人事服务。本页面的变更不会持久保存。'
    },
    inc: {
      title:'事件', sub:'在办案件的类型、严重程度、证据、调查负责人、成本与处理结果。',
      searchPh:'按案件、货件或司机搜索', filters:['全部','待处理','调查中','高严重度','有成本','已结案'],
      counted:'条匹配', empty:'没有事件符合所选筛选条件。', emptyHint:'请更改筛选条件或清除搜索词。',
      cols:['案件','货件','类型','严重程度','上报时间','调查人','状态','操作'],
      view:'查看案件', newCase:'新建案件', backList:'返回列表',
      sev:{low:'低',med:'中',high:'高',critical:'紧急'},
      states:{open:'待处理',investigating:'调查中',pending:'等待信息',resolved:'已处理',closed:'已结案',rejected:'已驳回'},
      tabs:['详情','证据','调查','成本','处理结果'],
      detailT:'案件详情',
      fields:{id:'案件',ship:'货件',type:'类型',sev:'严重程度',when:'上报时间',by:'上报人',driver:'司机',vehicle:'车辆',route:'路线',stop:'停靠点',place:'地点',desc:'描述'},
      types:['货物损坏','件数缺失','投递尝试失败','地址问题','延误','交通事故','失窃或丢失','车辆故障','违反规程'],
      descVal:'包裹到达时纸箱已打开，内容物移位。收件人拒收，司机在现场记录了状态。',
      safetyT:'安全与第三方',
      safety:[{l:'人员受伤',v:'无'},{l:'警方介入',v:'无'},{l:'保险报案',v:'待处理'},{l:'第三方涉及',v:'无'}],
      evidenceT:'案件证据', evidenceNote:'证据来自司机端与交付档案，仅可追加。',
      evidence:[
        {n:'损坏照片',src:'司机端',st:'ok'},
        {n:'现场包裹照片',src:'交付档案',st:'ok'},
        {n:'收件人签名',src:'交付档案',st:'missing'},
        {n:'位置与时间',src:'Amazon Location',st:'ok'},
        {n:'事件视频',src:'—',st:'missing'}
      ],
      evCols:['项目','来源','状态'],
      evStates:{ok:'可查看',missing:'未采集',restricted:'受限'},
      investT:'调查', investNote:'每次更新都记录作者与日期，历史仅可追加。',
      investFields:{owner:'指派调查人',opened:'开案时间',due:'答复承诺',contact:'客户沟通',finding:'初步结论'},
      investVals:{owner:'C. Méndez · 运营',opened:'2026年7月25日 · 10:12',due:'2026年7月28日',contact:'已于2026年7月25日通知',finding:'包装未达到堆叠货物标准。'},
      timelineT:'案件动态',
      timeline:[
        {t:'已从司机端接收证据',m:'2026年7月25日 · 10:14 · E. Rivera'},
        {t:'案件已指派调查',m:'2026年7月25日 · 10:40 · 运营'},
        {t:'已通知客户',m:'2026年7月25日 · 11:05 · 客户支持'},
        {t:'已记录初步结论',m:'2026年7月26日 · 09:20 · C. Méndez'}
      ],
      costT:'案件成本', costNote:'金额为参考值。退款与赊账须经批准，不能在本页面发起。',
      costCols:['项目','责任方','金额','状态'],
      costs:[
        {n:'货物申报价值',who:'保险',v:'——',st:'pending'},
        {n:'重新发运',who:'TR3SLOG',v:'——',st:'pending'},
        {n:'客户赊账',who:'财务',v:'——',st:'blocked'},
        {n:'保险自付额',who:'TR3SLOG',v:'——',st:'pending'}
      ],
      costStates:{pending:'待确定',approved:'已批准',blocked:'须经批准',rejected:'已驳回'},
      costTotals:[{l:'预计成本',v:'——'},{l:'保险承担',v:'——'},{l:'自行承担',v:'——'}],
      resolT:'处理结果', resolNote:'结案不会关闭交付，也不会发起付款。交付须凭完整证据关闭。',
      resolReasonT:'采取的处理方式',
      resolOptions:['重新发运','客户赊账','已申请退款','保险理赔','TR3SLOG 无责任','流程调整','司机培训','重复案件'],
      resolNotes:'结案说明', resolNotesPh:'将保留在档案中的说明',
      preventT:'预防措施', preventPh:'由该案件产生的流程变更或控制',
      closeBtn:'结案', reopenBtn:'重开案件',
      closeDone:'案件已结案。处理结果记入审计日志；在案件服务接入前不会持久保存。',
      reopenDone:'案件已重开。变更记入审计日志。',
      needsResolution:'请选择采取的处理方式。',
      needsEvidence:'无法结案：缺少必需证据。',
      rows:[
        {id:'CS-0231',ship:'TR3-260729-EUAL-08744',type:0,sev:'high',when:'7月25日 · 10:12',owner:'C. Méndez',st:'investigating',cost:true},
        {id:'CS-0230',ship:'TR3-260729-RDPC-08790',type:2,sev:'med',when:'7月24日 · 16:40',owner:'A. Rojas',st:'pending',cost:false},
        {id:'CS-0229',ship:'TR3-260729-PRSJ-08698',type:1,sev:'high',when:'7月23日 · 09:05',owner:'C. Méndez',st:'investigating',cost:true},
        {id:'CS-0228',ship:'TR3-260729-EUAL-08651',type:4,sev:'low',when:'7月21日 · 14:22',owner:'A. Rojas',st:'resolved',cost:false},
        {id:'CS-0227',ship:'TR3-260729-RDPC-08604',type:7,sev:'critical',when:'7月19日 · 07:48',owner:'R. Vega',st:'closed',cost:true}
      ],
      pending:'案件的创建与正式结案需要事件服务。本页面的变更不会持久保存。'
    }
  };
})();
