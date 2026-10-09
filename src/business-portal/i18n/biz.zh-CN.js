// 企业客户门户 (41–50) — 简体中文
(function () {
  var root = window.TR3S_I18N = window.TR3S_I18N || {}; var d = root['zh-CN'] = root['zh-CN'] || {};
  d.biz = {
    shell: { portal:'企业门户', company:'Comercial Bayamón LLC', account:'账户 BIZ-0241 · 管理员', signout:'退出登录', searchPh:'搜索运单、地点或员工', section:{ops:'运营',finance:'账务',admin:'管理'} },
    nav: { dash:'面板', shipments:'运单', bulk:'批量导入', recurring:'定期配送', locations:'地点', team:'团队', roles:'角色与权限', reports:'报表', billing:'账务账户', invoices:'对账单与账单' },
    common: { export:'导出', pdf:'PDF', excel:'Excel', save:'保存', cancel:'取消', confirm:'确认', back:'返回', next:'继续', view:'查看', download:'下载', add:'添加', invite:'邀请', edit:'编辑', remove:'移除', pause:'暂停', resume:'恢复', active:'启用', inactive:'停用', pending:'待处理', approved:'已批准', empty:'当前筛选条件下暂无数据。', loading:'加载中…', required:'请填写必填字段。', audit:'审计记录', lastUpdate:'最近更新', restricted:'您的角色无权访问。', savedOk:'更改已保存。', exportOk:'导出已生成。' },
    dash: {
      title:'账户总览', period:'2026年7月',
      kpis:[{l:'在途运单',v:'14'},{l:'待取件',v:'4'},{l:'派送中',v:'6'},{l:'本月运量',v:'248'},{l:'成功率',v:'97.6%'},{l:'未结余额',v:'$1,343.00'}],
      perfT:'绩效摘要',
      perf:[{l:'平均送达时长',v:'1.8 天'},{l:'派送失败',v:'3'},{l:'待处理索赔',v:'1'}],
      invoicesT:'最近账单', quickT:'快捷操作',
      quick:['创建运单','批量导入','预约取件','查看报表'],
      alertsT:'提醒',
      alerts:[{t:'账单即将到期',d:'INV-1044 将在 3 天后到期 · $1,025.00'},{t:'地址待核对',d:'2 个地点缺少派送说明。'}]
    },
    ship: {
      title:'公司运单', searchPh:'按运单号搜索',
      filters:{status:'状态',location:'地点',date:'日期',service:'服务',employee:'员工'},
      statuses:['全部','运输中','派送中','已送达','异常'],
      cols:['运单号','线路','服务','员工','状态','凭证'],
      bulkT:'批量操作', bulk:['导出所选','申请取件','下载凭证'],
      selected:'项已选择', exception:'异常', evidence:'查看凭证',
      rows:[
        {id:'TR3-260729-PRSJ-08821',route:'迈阿密 → 圣胡安',svc:'拼箱',emp:'L. Ortiz',st:6,exc:false},
        {id:'TR3-260729-RDPC-08790',route:'圣胡安 → 蓬塞',svc:'末端配送',emp:'L. Ortiz',st:7,exc:false},
        {id:'TR3-260729-EUAL-08744',route:'迈阿密 → 圣多明各',svc:'海运',emp:'R. Colón',st:8,exc:true},
        {id:'TR3-260729-EUAL-08702',route:'巴亚蒙 → 卡瓜斯',svc:'本地配送',emp:'R. Colón',st:0,exc:false},
        {id:'TR3-260729-PRSJ-08698',route:'迈阿密 → 奥兰多',svc:'陆路货运',emp:'M. Díaz',st:8,exc:false}
      ]
    },
    bulk: {
      title:'批量导入运单', steps:['文件','校验','预览','确认'],
      dropT:'拖入 CSV 或 Excel 文件', dropNote:'每批最多 500 行 · .csv、.xlsx',
      template:'下载模板', file:'shipments-july.csv · 128 行',
      validationT:'字段与地址校验',
      checks:[{l:'必填字段',v:'12 / 12'},{l:'地址已校验',v:'124 / 128'},{l:'发现重复',v:'2'},{l:'错误行',v:'4'}],
      errorsT:'错误报告',
      errors:[{row:'第 18 行',msg:'邮编与所填城市不匹配。'},{row:'第 46 行',msg:'同一文件内运单参考重复。'},{row:'第 91 行',msg:'缺少收件人电话。'},{row:'第 112 行',msg:'申报重量超出服务限制。'}],
      downloadErrors:'下载错误报告',
      previewT:'批次预览', previewNote:'确认批次后才会创建运单。',
      cols:['行','收件人','目的地','服务','重量','状态'],
      preview:[
        {r:'1',to:'Farmacia Del Valle',dest:'圣胡安, PR',svc:'末端配送',w:'12 磅',ok:true},
        {r:'2',to:'Tienda Caguas Centro',dest:'卡瓜斯, PR',svc:'本地配送',w:'34 磅',ok:true},
        {r:'18',to:'Colmado La Loma',dest:'蓬塞, PR',svc:'本地配送',w:'8 磅',ok:false},
        {r:'46',to:'E-shop Isla Verde',dest:'卡罗利纳, PR',svc:'末端配送',w:'22 磅',ok:false}
      ],
      confirmBtn:'确认批次', confirmed:'批次已确认：创建 124 个运单，排除 4 行。',
      historyT:'导入历史',
      history:[{f:'shipments-june.csv',d:'2026年6月30日',n:'211 个运单',st:'已完成'},{f:'shipments-may.csv',d:'2026年5月31日',n:'186 个运单',st:'已完成'}]
    },
    rec: {
      title:'定期配送', create:'创建计划',
      freqT:'频率', freq:['每日','每周','每两周','每月'],
      f:{pickup:'取件地点',dest:'派送地点',svc:'服务类型',window:'首选时间窗',contact:'指定联系人'},
      cols:['计划','频率','起点','目的地','时间窗','状态'],
      rows:[
        {id:'RC-014',freq:'每周 · 周一',from:'巴亚蒙南部仓库',to:'4 家门店',w:'08:00 – 11:00',st:'启用'},
        {id:'RC-011',freq:'每日',from:'迈阿密中心',to:'圣胡安枢纽',w:'14:00 – 17:00',st:'启用'},
        {id:'RC-008',freq:'每月 · 1 日',from:'卡瓜斯办公室',to:'2 个地点',w:'11:00 – 14:00',st:'已暂停'}
      ],
      historyT:'执行记录',
      history:[{d:'2026年7月21日',n:'RC-014 · 4 次派送',st:'已完成'},{d:'2026年7月14日',n:'RC-014 · 4 次派送',st:'已完成'},{d:'2026年7月7日',n:'RC-014 · 3 次派送 · 1 次失败',st:'存在异常'}]
    },
    loc: {
      title:'企业地点', add:'添加地点',
      types:['门店','仓库','办公室','取件中心','账单'],
      cols:['地点','类型','联系人','营业时间','状态'],
      instructionsT:'派送说明',
      rows:[
        {n:'巴亚蒙南部仓库',type:1,addr:'巴亚蒙 167 号公路 4.2 公里',c:'R. Colón · +1 787 555 0142',h:'周一至周六 · 7:00 – 17:00',active:true,ins:'请在后侧装卸区交付。'},
        {n:'卡瓜斯中心门店',type:0,addr:'卡瓜斯 Betances 街 88 号',c:'M. Díaz · +1 787 555 0177',h:'周一至周日 · 9:00 – 20:00',active:true,ins:'请联系当班主管。'},
        {n:'圣胡安办公室',type:2,addr:'圣胡安 Roosevelt 大道 1204 号',c:'L. Ortiz · +1 787 555 0118',h:'周一至周五 · 8:00 – 18:00',active:true,ins:'二楼前台接收。'},
        {n:'迈阿密中心',type:3,addr:'1234 Logistics Way, 迈阿密, FL',c:'J. Pérez · +1 786 555 0102',h:'周一至周五 · 8:00 – 19:00',active:false,ins:'暂无派送说明。'}
      ]
    },
    team: {
      title:'企业团队成员', invite:'邀请员工',
      roles:['企业所有者','企业管理员','运单经理','账务经理','只读'],
      cols:['员工','角色','地点','最近登录','状态'],
      f:{email:'员工邮箱',role:'角色',loc:'指定地点',finance:'限制财务访问',ship:'限制运单访问'},
      suspend:'停用', reactivate:'恢复', removeAccess:'移除权限',
      invited:'邀请已发送。',
      rows:[
        {n:'Lourdes Ortiz',e:'l.ortiz@bayamon.com',role:0,loc:'圣胡安办公室',last:'今天 · 09:42',st:'启用'},
        {n:'Rafael Colón',e:'r.colon@bayamon.com',role:2,loc:'巴亚蒙南部仓库',last:'今天 · 08:10',st:'启用'},
        {n:'María Díaz',e:'m.diaz@bayamon.com',role:3,loc:'卡瓜斯中心门店',last:'昨天 · 17:26',st:'启用'},
        {n:'Jorge Pérez',e:'j.perez@bayamon.com',role:4,loc:'迈阿密中心',last:'7月12日 · 11:04',st:'已停用'}
      ]
    },
    perm: {
      title:'角色与权限', note:'权限变更会记录在账户审计历史中。',
      items:['创建运单','审批运单','查看追踪','管理地点','查看账单','进行付款','导出报表','管理团队','提交索赔','访问集成'],
      matrix:[
        [1,1,1,1,1,1,1,1,1,1],
        [1,1,1,1,1,1,1,1,1,1],
        [1,1,1,1,0,0,1,0,1,0],
        [0,0,1,0,1,1,1,0,1,0],
        [0,0,1,0,0,0,0,0,0,0]
      ],
      allowed:'允许', denied:'无权限'
    },
    rep: {
      title:'企业报表', period:'周期', periods:['最近 30 天','本季度','年初至今'],
      cards:[
        {l:'运单量',v:'248',n:'较上期 +18%'},
        {l:'周期费用',v:'$18,420',n:'平均每单 $74.28'},
        {l:'按地点费用',v:'4 个地点',n:'最高：巴亚蒙南部仓库'},
        {l:'派送绩效',v:'97.6%',n:'目标 95%'},
        {l:'派送失败',v:'3',n:'2 改期 · 1 退回'},
        {l:'平均送达时长',v:'1.8 天',n:'取件至送达'},
        {l:'服务使用',v:'6 项服务',n:'使用最多：末端配送'},
        {l:'索赔与异常',v:'1',n:'审核中'},
        {l:'线路绩效',v:'12 条线路',n:'按权限可见'}
      ],
      exportT:'导出', exportNote:'导出会遵循您的角色权限。'
    },
    bill: {
      title:'账务账户',
      profileT:'开票资料', contactsT:'账务联系人', methodT:'支付方式',
      termsT:'付款条件', creditT:'信用额度', balanceT:'未结余额',
      statementsT:'对账单', taxT:'税务信息', autopayT:'自动付款', notifT:'账务通知',
      f:{legal:'法定名称',ein:'税号 / RNC',address:'开票地址',email:'开票邮箱',phone:'电话'},
      values:{legal:'Comercial Bayamón LLC',ein:'66-0421887',address:'巴亚蒙 167 号公路 4.2 公里, PR 00961',email:'billing@bayamon.com',phone:'+1 787 555 0118'},
      contacts:[{n:'María Díaz',r:'账务经理',e:'m.diaz@bayamon.com'},{n:'Lourdes Ortiz',r:'企业所有者',e:'l.ortiz@bayamon.com'}],
      method:'尾号 4242 的卡 · 有效期 09/2028', terms:'30 天账期', credit:'$25,000.00', balance:'$1,343.00',
      autopayOn:'到期自动扣款', autopayOff:'手动付款',
      notifs:['新账单已开具','到期提醒','已收到付款','费用被质疑'],
      taxNote:'税务文件依据各次作业所属辖区开具。'
    },
    inv: {
      title:'对账单、账单与收据',
      periodT:'对账周期', periods:['2026年7月','2026年6月','2026年5月'],
      cols:['单据','运单','开具日期','金额','状态',''],
      tabs:['账单','贷记','调整','退款','争议'],
      statuses:{paid:'已支付',pending:'待支付',overdue:'已逾期',credit:'贷记',adjust:'调整',refund:'已退款',disputed:'争议中'},
      pay:'支付', receipt:'收据', invoice:'账单', statement:'下载对账单',
      dispute:'提出争议', disputed:'该费用已标记为争议。',
      rows:[
        {id:'INV-1044',ship:'TR3-260729-PRSJ-08821',d:'2026年7月24日',a:'$1,025.00',st:'pending',tab:0},
        {id:'INV-1043',ship:'TR3-260729-RDPC-08790',d:'2026年7月21日',a:'$318.00',st:'overdue',tab:0},
        {id:'INV-1042',ship:'TR3-260729-EUAL-08744',d:'2026年7月14日',a:'$1,240.00',st:'paid',tab:0},
        {id:'CR-0112',ship:'TR3-260729-PRSJ-08698',d:'2026年7月12日',a:'-$85.00',st:'credit',tab:1},
        {id:'AJ-0090',ship:'TR3-260729-EUAL-08744',d:'2026年7月10日',a:'-$45.00',st:'adjust',tab:2},
        {id:'RF-0031',ship:'TR3-260729-EUAL-08621',d:'2026年7月2日',a:'$210.00',st:'refund',tab:3},
        {id:'INV-1039',ship:'TR3-260729-PRSJ-08590',d:'2026年6月28日',a:'$96.00',st:'disputed',tab:4}
      ]
    }
  };
})();
