const constant = {
  INSURANCE_TYPE: [
    // 保险类型
    {
      value: "EMPLOYER",
      label: "雇主责任"
    }
  ],
  CERT_TYPE: [
    // 证件类型
    {
      label: "统一社会信用代码证",
      value: "SOCIAL_CODE"
    },
    {
      label: "组织机构代码证",
      value: "ORG_CODE"
    }
  ],
  SPECIAL_TEXT:
    "本保单承保的被保险人雇员年龄范围16-65周岁，本保单累计保险责任限额为2000万，每次事故保险责任限额为1000万；\n\n" +
    "<#if JOB_CODE!=''>本保单仅承保《中国人寿财产保险股份有限职业分类表》中${JOB_CODE}职业雇员，<#if JOB_CODE!='1-5类' && JOB_CODE!='1-6类' && JOB_CODE!='5类'&& JOB_CODE!='6类'>投保工种均不涉及2米及2米以上高处作业，作业高度超过2米（含）发生的事故不属于保险责任，</#if>且保险人严格按投保人提供的人员职业类别办理保险，对超出投保时约定或隐瞒被保险人真实职业类别的情形时，保险人将根据《保险法》第十六条之规定对发生保险事故不承担赔偿或给付保险金责任；</#if>\n\n" +
    "<#if SOCIAL_SECURITY!=''>${SOCIAL_SECURITY}</#if>\n\n" +
    "<#if DISABILITY_LEVEL_DISABILITY_LEVEL_KEY!=''>兹双方同意，本保单伤残等级对照国家发布的《职工工伤与职业病致残程度鉴定标准》（GB/T 16180-2014）确定，伤残等级比例为：${DISABILITY_LEVEL_DISABILITY_LEVEL_KEY}；</#if>\n\n" +
    "<#if MEDICAL_CHARGE_DEDUCTION!=''>本保单被保险人雇员就诊医院仅包含二级或二级以上的公立医院及保险人认可的医院。每次事故医疗费${MEDICAL_CHARGE_DEDUCTION}；</#if>\n\n" +
    "<#if MEDICAL_CHARGE_PRIVATE_HOSPITAL!=''>本保单已扩展承保私立医院保险责任，被保险人雇员在具备医保或工伤定点资格的非公立医院就诊，医疗费用可在保单限额内获得赔偿。每次事故${MEDICAL_CHARGE_DEDUCTION}；</#if>\n\n" +
    "<#if SELF_MEDICINE_INSU_PRICE!=''>本保单已扩展承保自费药保险条款，每人责任限额为${SELF_MEDICINE_INSU_PRICE}，每次事故${MEDICAL_CHARGE_DEDUCTION}；</#if>\n\n" +
    "<#if EXTEND_HOUR_INSU_PRICE!=''>${EXTEND_HOUR_INSU_PRICE}</#if>\n\n" +
    "<#if LOSS_OF_WORK_TIME_DAILY_INSU_PRICE!=''>本保单误工费为${LOSS_OF_WORK_TIME_DAILY_INSU_PRICE},赔付标准不高于本人实际工资水平且以保单列明的限额为限,每次事故免赔${LOSS_OF_WORK_TIME_DEDUCTION}；</#if>\n\n" +
    "<#if HOSPITAL_ALLOWANCE_DAILY_INSU_PRICE!=''>本保单住院津贴为${HOSPITAL_ALLOWANCE_DAILY_INSU_PRICE},每次事故免赔${HOSPITAL_ALLOWANCE_DEDUCTION}；</#if>\n\n" +
    "<#if THIRD_PARTY_RESPONSIBILITY_INSU_PRICE!=''>本保单已扩展第三者责任条款，${THIRD_PARTY_RESPONSIBILITY_INSU_PRICE}。医疗免赔200元或者医疗费用限额的10%，两者取高者。财产免赔500元或者财产损失限额的10%，两者取高者；</#if>\n\n" +
    "<#if AUTO_POLICY_NEW_EMPLOYEE_AUTO_POLICY_KEY!=''>${AUTO_POLICY_NEW_EMPLOYEE_AUTO_POLICY_KEY}</#if>\n\n" +
    "<#if OVERSEAS_BUSINESS_TRIP_INSU_PRICE!=''>${OVERSEAS_BUSINESS_TRIP_INSU_PRICE}</#if>\n\n" +
    "本保单被保险人应在保险事故发生后48小时内报案,如超出48小时报案导致保险人无法核实事故真实情况,则保险人有权拒赔",
  // 雇主c新增有无社保
  SPECIAL_C_TEXT:
    "本保单承保的被保险人雇员年龄范围16-65周岁，本保单累计保险责任限额为2000万，每次事故保险责任限额为1000万；\n\n" +
    "<#if JOB_CODE!=''>本保单仅承保《中国人寿财产保险股份有限职业分类表》中${JOB_CODE}职业雇员，<#if JOB_CODE!='1-5类' && JOB_CODE!='1-6类' && JOB_CODE!='5类'&& JOB_CODE!='6类'>投保工种均不涉及2米及2米以上高处作业，作业高度超过2米（含）发生的事故不属于保险责任，</#if>且保险人严格按投保人提供的人员职业类别办理保险，对超出投保时约定或隐瞒被保险人真实职业类别的情形时，保险人将根据《保险法》第十六条之规定对发生保险事故不承担赔偿或给付保险金责任；</#if>\n\n" +
    "<#if SOCIAL_SECURITY!=''>${SOCIAL_SECURITY}</#if>\n\n" +
    "<#if DISABILITY_LEVEL_DISABILITY_LEVEL_KEY!=''>兹双方同意，本保单伤残等级对照国家发布的《职工工伤与职业病致残程度鉴定标准》（GB/T 16180-2014）确定，伤残等级比例为：${DISABILITY_LEVEL_DISABILITY_LEVEL_KEY}；</#if>\n\n" +
    "<#if MEDICAL_CHARGE_DEDUCTION!=''>本保单被保险人雇员就诊医院仅包含二级或二级以上的公立医院及保险人认可的医院。每次事故医疗费${MEDICAL_CHARGE_DEDUCTION}；</#if>\n\n" +
    "<#if MEDICAL_CHARGE_PRIVATE_HOSPITAL!=''>本保单已扩展承保私立医院保险责任，被保险人雇员在具备医保或工伤定点资格的非公立医院就诊，医疗费用可在保单限额内获得赔偿。每次事故${MEDICAL_CHARGE_DEDUCTION}；</#if>\n\n" +
    "<#if SELF_MEDICINE_INSU_PRICE!=''>本保单已扩展承保自费药保险条款，每人责任限额为${SELF_MEDICINE_INSU_PRICE}，每次事故${MEDICAL_CHARGE_DEDUCTION}；</#if>\n\n" +
    "<#if EXTEND_HOUR_INSU_PRICE!=''>${EXTEND_HOUR_INSU_PRICE}</#if>\n\n" +
    "<#if LOSS_OF_WORK_TIME_DAILY_INSU_PRICE!=''>本保单误工费为${LOSS_OF_WORK_TIME_DAILY_INSU_PRICE},赔付标准不高于本人实际工资水平且以保单列明的限额为限,每次事故免赔${LOSS_OF_WORK_TIME_DEDUCTION}；</#if>\n\n" +
    "<#if HOSPITAL_ALLOWANCE_DAILY_INSU_PRICE!=''>本保单住院津贴为${HOSPITAL_ALLOWANCE_DAILY_INSU_PRICE},每次事故免赔${HOSPITAL_ALLOWANCE_DEDUCTION}；</#if>\n\n" +
    "<#if THIRD_PARTY_RESPONSIBILITY_INSU_PRICE!=''>本保单已扩展第三者责任条款，${THIRD_PARTY_RESPONSIBILITY_INSU_PRICE}。医疗免赔200元或者医疗费用限额的10%，两者取高者。财产免赔500元或者财产损失限额的10%，两者取高者；</#if>\n\n" +
    "<#if AUTO_POLICY_NEW_EMPLOYEE_AUTO_POLICY_KEY!=''>${AUTO_POLICY_NEW_EMPLOYEE_AUTO_POLICY_KEY}</#if>\n\n" +
    "<#if OVERSEAS_BUSINESS_TRIP_INSU_PRICE!=''>${OVERSEAS_BUSINESS_TRIP_INSU_PRICE}</#if>\n\n" +
    "本保单被保险人应在保险事故发生后48小时内报案,如超出48小时报案导致保险人无法核实事故真实情况,则保险人有权拒赔",
  INFORM_TEXT:
    "1.本保险合同适用于《中国人寿财产保险股份有限公司职业分类表》中雇主责任险职业类别为${JOB_CODE}职业的被保险人，<#if JOB_CODE!='1-5类' && JOB_CODE!='1-6类' && JOB_CODE!='5类'&& JOB_CODE!='6类'>投保工种均不涉及2米及2米以上高处作业，作业高度超过2米（含）发生的事故不属于保险责任，</#if>且保险人严格按投保人提供的人员职业类别办理保险，对超出投保时约定或隐瞒被保险人真实职业类别的情形时，保险人将根据《保险法》第十六条之规定对发生保险事故不承担赔偿或给付保险金责任；\n\n" +
    "2.投保人可登录保险人官方网站，或通过保险人服务电话、营业网点核实保险合 同信息及查询保险理赔信息。请务必详细阅读保险条款，特别注意特别约定、重要告知、责任免除等内容。若对查询结果有异议，可致电保险人服务电话咨询；\n\n" +
    "3.本保单适用条款：<#if DEATH_DISABILITY!exists>《中国人寿财产保险股份有限公司雇主责任保险(A)条款》、</#if><#if EXTEND_HOUR!exists>《中国人寿财产保险股份有限公司雇主责任保险附加二十四小时扩展条款（人身意外扩展条款）》、</#if><#if THIRD_PARTY_RESPONSIBILITY!exists>《中国人寿财产保险股份有限公司雇主责任保险（A）附加第三者责任保险条款》、</#if><#if HOSPITAL_ALLOWANCE!exists>《中国人寿财产保险股份有限公司雇主责任保险附加住院津贴保险条款》、</#if><#if LOSS_OF_WORK_TIME!exists>《中国人寿财产保险股份有限公司雇主责任保险(A)附加误工补助赔偿保险（B）条款》、</#if><#if DISABILITY_LEVEL!exists>《中国人寿财产保险股份有限公司责任保险附加伤残赔偿比例调整条款》、</#if><#if OVERSEAS_BUSINESS_TRIP!exists>《中国人寿财产保险股份有限公司雇主责任保险附加海外出差条款》、</#if><#if AUTO_POLICY!exists>《中国人寿财产保险股份有限公司雇主责任保险附加自动承保新雇员条款》、</#if><#if SELF_MEDICINE!exists>《中国人寿财产保险股份有限公司雇主责任保险附加自费药保险条款》</#if>；\n\n" +
    "4.收到本保险单后请仔细核对，如有错误请及时向本公司办理更正手续。",
  // 0：份额计入1：全额计入2：全额承担
  SERVICE_CHARGE: [
    // 手续费计入方式
    {
      label: "份额计入",
      value: 0
    },
    {
      label: "全额计入",
      value: 1
    },
    {
      label: "全额承担",
      value: 2
    }
  ],
  RELEASE_SEQUENCE: [
    // 投放顺序
    {
      label: "不投放",
      value: 0
    },
    {
      label: "1",
      value: 1
    },
    {
      label: "2",
      value: 2
    },
    {
      label: "3",
      value: 3
    },
    {
      label: "4",
      value: 4
    }
  ],
  // UNIT-共保，JOIN-联保
  UNDERWRITING_TYPE: [
    {
      label: "主共",
      value: "JOIN-true"
    },
    {
      label: "从共",
      value: "JOIN-false"
    },
    {
      label: "主联",
      value: "UNIT-true"
    },
    {
      label: "从联",
      value: "UNIT-false"
    }
  ],
  // 联保场景
  JOINT_SCENE: [
    {
      label: "共保",
      value: "COINSURANCE"
    },
    {
      label: "联保",
      value: "JOINSURANCE"
    },
    {
      label: "共联保",
      value: "COJOINSURANCE"
    }
  ]
};
export default constant;
