<template>
  <div class="checkbox-components">
    <!--    <el-checkbox-group v-model="commissionCheck">-->
    <!--    是否是查看-->
    <div v-if="routeType !=='look'">
      <div v-if="checkData.selectKeyName">
        <el-checkbox
          :label="item.orderNum"
          style="margin: 0 30px 16px 0"
          v-for="(item, index) in checkData.selectorOptionMngInfos"
          v-if="item.value !== 'NOT_SELECTED'"
          :key="index"
          :disabled="item.disabled"
          @change="changeOption(item.change, item.option)"
          v-model="item.change"
        >
          <div v-if="!item.diy">
            <span
              :class="checkData.deductible || checkData.peopleNum || checkData.third || checkData.hospitalized || checkData.tardy || checkData.auto || checkData.overseas ? 'option-style-deductible' : 'option-style'"
            >{{item.option}}</span>
            <el-input
              v-if="checkData.selectorOptionMngInfos[index].adjustFactor !== undefined"
              :disabled="item.disabled"
              placeholder="填写对应系数"
              @change="clearNoNum(checkData.selectorOptionMngInfos[index].adjustFactor, 0 ,index, 'adjustFactor')"
              v-model="checkData.selectorOptionMngInfos[index].adjustFactor"
            >
              <template slot="append">倍</template>
            </el-input>
          </div>
          <div v-else>
            <div v-if="checkData.deductible" class="deductible-diy">
              <!--          免赔比例区分自定义-->
              <span>免赔</span>
              <el-input
                placeholder="填写免赔金额"
                @change="blurInput(checkData.selectorOptionMngInfos[index].option1, index, 'first', 'deductible')"
                v-model="checkData.selectorOptionMngInfos[index].option1"
                :disabled="item.disabled"
              >
                <template slot="append">元</template>
              </el-input>
              <span>-</span>
              <el-input
                v-model="checkData.selectorOptionMngInfos[index].option2"
                @change="blurInput(checkData.selectorOptionMngInfos[index].option2, index, 'second', 'deductible')"
                :placeholder="'填写' + checkData.selectKeyName"
                :disabled="item.disabled"
              >
                <template slot="append">%</template>
              </el-input>
              <span>赔付-</span>
              <!-- v-number:2=`'checkData.selectorOptionMngInfos' + ${index} + '.adjustFactor'` -->
              <el-input
                placeholder="填写对应系数"
                :disabled="item.disabled"
                @change="clearNoNum(checkData.selectorOptionMngInfos[index].adjustFactor, 0 ,index, 'adjustFactor')"
                v-model="checkData.selectorOptionMngInfos[index].adjustFactor"
              >
                <template slot="append">倍</template>
              </el-input>
            </div>
            <div v-else-if="checkData.peopleNum" class="deductible-diy">
              <!--          人数系数调整自定义-->
              <!-- <span>自定义</span> -->
              <el-input
                placeholder="填写人数"
                :disabled="item.disabled"
                @change="blurInput(checkData.selectorOptionMngInfos[index].option1, index, 'first', 'peopleNum')"
                v-model="checkData.selectorOptionMngInfos[index].option1"
              >
                <template slot="append">人</template>
              </el-input>
              <span>-</span>
              <el-input
                :disabled="item.disabled"
                v-model="checkData.selectorOptionMngInfos[index].option2"
                @change="blurInput(checkData.selectorOptionMngInfos[index].option2, index, 'second', 'peopleNum')"
                placeholder="填写人数"
              >
                <template slot="append">人</template>
              </el-input>
              <span>-</span>
              <!-- v-number:2=`'checkData.selectorOptionMngInfos' + ${index} + '.adjustFactor'` -->
              <el-input
                placeholder="填写对应系数"
                :disabled="item.disabled"
                @change="clearNoNum(checkData.selectorOptionMngInfos[index].adjustFactor, 0 ,index, 'adjustFactor')"
                v-model="checkData.selectorOptionMngInfos[index].adjustFactor"
              >
                <template slot="append">倍</template>
              </el-input>
            </div>
            <div v-else-if="checkData.third" class="deductible-diy">
              <!-- 三者责任 -->
              <span>累计赔偿限额</span>
              <el-input
                placeholder="填写金额"
                :disabled="item.disabled"
                @change="blurInput(checkData.selectorOptionMngInfos[index].option1, index, 'first', 'third')"
                v-model="checkData.selectorOptionMngInfos[index].option1"
              >
                <template slot="append">万</template>
              </el-input>
              <span>，每次事故限额</span>
              <el-input
                :disabled="item.disabled"
                v-model="checkData.selectorOptionMngInfos[index].option2"
                @change="blurInput(checkData.selectorOptionMngInfos[index].option2, index, 'second', 'third')"
                placeholder="填写金额"
              >
                <template slot="append">万</template>
              </el-input>
              <span>，其中医疗费用</span>
              <el-input
                :disabled="item.disabled"
                v-model="checkData.selectorOptionMngInfos[index].option3"
                @change="blurInput(checkData.selectorOptionMngInfos[index].option3, index, 'third', 'third')"
                placeholder="填写金额"
              >
                <template slot="append">万</template>
              </el-input>
              <span>，财产损失</span>
              <el-input
                :disabled="item.disabled"
                v-model="checkData.selectorOptionMngInfos[index].option4"
                @change="blurInput(checkData.selectorOptionMngInfos[index].option4, index, 'four', 'third')"
                placeholder="填写金额"
              >
                <template slot="append">万</template>
              </el-input>
              <span>-</span>
              <!-- v-number:2=`'checkData.selectorOptionMngInfos' + ${index} + '.adjustFactor'` -->
              <el-input
                placeholder="填写对应系数"
                :disabled="item.disabled"
                @change="clearNoNum(checkData.selectorOptionMngInfos[index].adjustFactor, 0 ,index, 'adjustFactor')"
                v-model="checkData.selectorOptionMngInfos[index].adjustFactor"
              >
                <template slot="append">倍</template>
              </el-input>
            </div>
            <div v-else-if="checkData.hospitalized" class="deductible-diy">
              <!-- 住院津贴 -->
              <span>免赔</span>
              <el-input
                placeholder="填写天数"
                :disabled="item.disabled"
                @change="blurInput(checkData.selectorOptionMngInfos[index].option1, index, 'first', 'hospitalized')"
                v-model="checkData.selectorOptionMngInfos[index].option1"
              >
                <template slot="append">天</template>
              </el-input>
              <span>，每次事故累计不超过</span>
              <el-input
                :disabled="item.disabled"
                v-model="checkData.selectorOptionMngInfos[index].option2"
                @change="blurInput(checkData.selectorOptionMngInfos[index].option2, index, 'second', 'hospitalized')"
                placeholder="填写天数"
              >
                <template slot="append">天</template>
              </el-input>
              <span>，累计赔偿不超过</span>
              <el-input
                :disabled="item.disabled"
                v-model="checkData.selectorOptionMngInfos[index].option3"
                @change="blurInput(checkData.selectorOptionMngInfos[index].option3, index, 'third', 'hospitalized')"
                placeholder="填写天数"
              >
                <template slot="append">天</template>
              </el-input>
              <span>-</span>
              <!-- v-number:2=`'checkData.selectorOptionMngInfos' + ${index} + '.adjustFactor'` -->
              <el-input
                placeholder="填写对应系数"
                :disabled="item.disabled"
                @change="clearNoNum(checkData.selectorOptionMngInfos[index].adjustFactor, 0 ,index, 'adjustFactor')"
                v-model="checkData.selectorOptionMngInfos[index].adjustFactor"
              >
                <template slot="append">倍</template>
              </el-input>
            </div>
            <div v-else-if="checkData.tardy" class="deductible-diy">
              <!-- 误工 -->
              <span>免赔</span>
              <el-input
                placeholder="填写天数"
                :disabled="item.disabled"
                @change="blurInput(checkData.selectorOptionMngInfos[index].option1, index, 'first', 'tardy')"
                v-model="checkData.selectorOptionMngInfos[index].option1"
              >
                <template slot="append">天</template>
              </el-input>
              <span>，累计赔偿不超过</span>
              <el-input
                :disabled="item.disabled"
                v-model="checkData.selectorOptionMngInfos[index].option2"
                @change="blurInput(checkData.selectorOptionMngInfos[index].option2, index, 'second', 'hospitalized')"
                placeholder="填写天数"
              >
                <template slot="append">天</template>
              </el-input>
              <span>-</span>
              <!-- v-number:2=`'checkData.selectorOptionMngInfos' + ${index} + '.adjustFactor'` -->
              <el-input
                placeholder="填写对应系数"
                :disabled="item.disabled"
                @change="clearNoNum(checkData.selectorOptionMngInfos[index].adjustFactor, 0 ,index, 'adjustFactor')"
                v-model="checkData.selectorOptionMngInfos[index].adjustFactor"
              >
                <template slot="append">倍</template>
              </el-input>
            </div>
            <!-- tardy -->
            <!-- hospitalized -->
            <!-- <div v-else-if="checkData">

            </div>-->
            <div v-else style="display: flex; align-items: center">
              <span>自定义</span>
              <el-input
                style="margin-left: 10px"
                v-model="checkData.selectorOptionMngInfos[index].option1"
                :disabled="item.disabled"
                :placeholder="'填写' + checkData.selectKeyName"
                @change="clearNoNum(checkData.selectorOptionMngInfos[index].option1, 0, index, 'option1')"
              >
                <template slot="append">{{unitText}}</template>
              </el-input>
              <span style="margin-left: 10px">-</span>
              <el-input
                style="margin-left: 10px"
                placeholder="填写对应系数"
                :disabled="item.disabled"
                @change="clearNoNum(checkData.selectorOptionMngInfos[index].adjustFactor, 0 ,index, 'adjustFactor')"
                v-model="checkData.selectorOptionMngInfos[index].adjustFactor"
              >
                <template slot="append">倍</template>
              </el-input>
            </div>
          </div>
        </el-checkbox>
        <!--              <el-checkbox v-if="diyCommission" >-->

        <!--              </el-checkbox>-->
        <el-button
          type="text"
          icon="el-icon-plus"
          v-if="diyShow"
          @click="addCommission"
          :disabled="checkData.disabled"
        >自定义添加</el-button>
      </div>
      <div v-else>
        <el-row :gutter="16">
          <el-col
            :span="12"
            style="margin-bottom: 16px"
            :key="'0'+ index"
            v-for="(item, index) in checkData.selectorOptionMngInfos"
          >
            <span>{{item.option}}：</span>
            <el-input
              placeholder="填写对应系数"
              @change="clearNoNum(checkData.selectorOptionMngInfos[index].adjustFactor, 0 ,index, 'adjustFactor')"
              v-model="checkData.selectorOptionMngInfos[index].adjustFactor"
            >
              <template slot="append">倍</template>
            </el-input>
          </el-col>
        </el-row>
      </div>
    </div>
    <div v-else>
      <el-checkbox
        :label="item.orderNum"
        v-if="!item.diy && item.value !== 'NOT_SELECTED'"
        disabled
        style="margin: 0 30px 16px 0"
        v-for="(item, index) in checkData.selectorOptionMngInfos"
        :key="'00' + index"
        v-model="item.change"
      >
        <span
          style="display: inline-block;padding: 0 10px; text-align: center;line-height: 32px"
        >{{item.option}}</span>
        <span>-</span>
        <span style="margin-left: 10px">对应系数：</span>
        <span>{{checkData.selectorOptionMngInfos[index].adjustFactor}}</span>
      </el-checkbox>
    </div>
    <!--    </el-checkbox-group>-->
  </div>
</template>

<script>
export default {
  name: "DiyCheck",
  props: {
    parentData: {
      type: Object,
      required: true
    },
    diyShow: {
      type: Boolean,
      required: false // 不需要显示就不需要传
    },
    parentAll: {
      type: Object,
      required: false
    },
    parentIndex: {
      type: Number,
      required: false
    },
    childIndex: {
      type: Number,
      required: false
    }
  },
  data() {
    return {
      checkData: {},
      commissionCheck: [],
      deductibleMoney: "", // 免赔比例金额
      routeType: "", // 路由type
      unitText: "" // 单位
    };
  },
  created() {
    this.initData();
  },
  methods: {
    initData() {
      this.checkData = JSON.parse(JSON.stringify(this.parentData));
      switch (this.checkData.selectKey) {
        case "DEDUCTION_RATE":
          this.checkData.deductible = true;
          break;
      }
      let routeData = this.$route.query;
      this.routeType = routeData.type;
      let unitText = ""; // 单位
      if (!this.parentAll) {
        unitText = "%";
      } else {
        switch (this.parentAll.clauseKey) {
          case "HOSPITAL_ALLOWANCE":
            unitText = "元/天";
            break;
          case "DEATH_DISABILITY":
            unitText = "万元";
            break;
          case "MEDICAL_CHARGE":
            unitText = "万元";
            break;
          case "LEGAL_CHARGE":
            unitText = "万元";
            break;
          case "LOSS_OF_WORK_TIME":
            unitText = "元/天";
            break;
          case "THIRD_PARTY_RESPONSIBILITY":
            unitText = "万元";
            break;
            case 'SELF_MEDICINE': 
            unitText = '万元';
            break;
        }
      }
      this.unitText = unitText;
    },
    clearNoNum(val, type, index, key) {
      console.log(this.checkData, 'val', val)
      // 限制用户输入
      // let unitText = ''; // 单位
      if (this.checkData.third) { // 有就是三者的，需要保留4位小数

      }
      let money = null;
      let unitText = this.unitText;
      // type是区分手续费还是职业类别的
      if (key === "option" || key === "option1" || key === "option2") {
        let money = parseFloat(this.getData(val));

        if (unitText === "%") {
          if (money >= 100) {
            this.checkData.selectorOptionMngInfos[index].option =
              100 + unitText;
            this.checkData.selectorOptionMngInfos[index][key] = 100;
            this.checkData.selectorOptionMngInfos[index].value = 100;
            return false;
          }
        } else if (unitText === "万元") {
          if (money > 10000) {
            this.checkData.selectorOptionMngInfos[index].option =
              10000 + unitText;
            this.checkData.selectorOptionMngInfos[index][key] = 10000;
            this.checkData.selectorOptionMngInfos[index].value = 10000;
            return false;
          }
        } else if (unitText === "元/天") {
          if (money > 100000000) {
            // 一乙
            this.checkData.selectorOptionMngInfos[index].option =
              100000000 + unitText;
            this.checkData.selectorOptionMngInfos[index][key] = 100000000;
            this.checkData.selectorOptionMngInfos[index].value = 100000000;
            return false;
          }
        }
        // if (this.parentAll.clauseKey === 'THIRD_PARTY_RESPONSIBILITY') { // 三者责任
        //   this.checkData.selectorOptionMngInfos[index].option = '兹双方同意，本保单附加第三者责任保险条款';
        // } else {

        // }
        this.checkData.selectorOptionMngInfos[index].option =
          this.getData(val) + unitText;
        this.checkData.selectorOptionMngInfos[index][key] = this.getData(val);
        if (unitText === "万元") {
          this.checkData.selectorOptionMngInfos[index].value =
            this.getData(val) * 10000;
        } else {
          this.checkData.selectorOptionMngInfos[index].value = this.getData(
            val
          );
        }
      } else {
        if (key) {
          this.checkData.selectorOptionMngInfos[index][key] = this.getData(val);
        }
      }
      this.checkData = JSON.parse(JSON.stringify(this.checkData));
    },
    getData(val) {
      val = val.replace(/[^\d.]/g, ""); //清除“数字”和“.”以外的字符
      val = val.replace(/\.{2,}/g, "."); //只保留第一个. 清除多余的
      val = val
        .replace(".", "$#$")
        .replace(/\./g, "")
        .replace("$#$", ".");
        if (this.checkData.third) {
          // 三者需要保留4位小数
          val = val.replace(/^(.*\..{4}).*$/,"$1"); //只能输入4个小数
        } else {
          val = val.replace(/^(\-)*(\d+)\.(\d\d).*$/, "$1$2.$3"); //只能输入两个小数
        }
      
      if (val > 999999999) {
        val = 999999999;
      }
      return String(val);
    },
    addCommission() {
      // 新增自定义手续费
      // this.diyCommission = true;
      let len = this.checkData.selectorOptionMngInfos.length;
      this.checkData.selectorOptionMngInfos.push({
        orderNum: len + 1,
        option: "",
        adjustFactor: "",
        diy: true,
        change: false,
        value: ""
      });
    },
    commitData() {
      // 传给父页面数据
      // 过滤没有选中的数据
      let that = this;
      // this.checkData = JSON.parse(JSON.stringify(this.parentData));
      let newData = this.checkData.selectorOptionMngInfos.filter(
        (item, index) => {
          return item.change;
        }
      );
      if (this.parentData.selectorKeyRuleConfigMngInfos) {
        this.checkData.selectorKeyRuleConfigMngInfos = JSON.parse(
          JSON.stringify(this.parentData.selectorKeyRuleConfigMngInfos)
        );
      }
      let messageShow = true;
      if (newData.length === 0) {
        // this.checkData.selectorOptionMngInfos = JSON.parse(JSON.stringify(newData))
        this.$emit(
          "allData",
          this.checkData,
          this.parentIndex,
          this.childIndex
        );
        return false;
      } else {
        // 至少有一个勾选的
        for (let i = 0; i < newData.length; i++) {
          if (!newData[i].option || !newData[i].adjustFactor) {
            if (newData[i].option !== "暂不考虑") {
              messageShow = false;
              break;
            }
          }
        }
      }
      if (!messageShow) {
        // 至少 勾选了一个，但是没填完信息
        let newCheckData = JSON.parse(JSON.stringify(this.checkData));
        newCheckData.selectorOptionMngInfos = JSON.parse(
          JSON.stringify(newData)
        );
        this.$emit("allData", newCheckData, this.parentIndex, this.childIndex);
      } else {
        // 填完了勾选的信息
        // this.checkData.selectorOptionMngInfos = JSON.parse(JSON.stringify(newData))
        let optionData = newData.filter(item => {
          return item.option === "暂不考虑";
        });
        if (optionData.length > 0) {
          // 就是存在暂不考虑
          newData = JSON.parse(JSON.stringify([]));
        }
        // debugger
        let newCheckData = JSON.parse(JSON.stringify(this.checkData));
        newCheckData.selectorOptionMngInfos = JSON.parse(
          JSON.stringify(newData)
        );
        this.$emit("allData", newCheckData, this.parentIndex, this.childIndex);
      }
    },
    blurInput(val, index, type, parentValue) {
      // parentValue是哪一个的需要修改
      let text = "";
      if (parentValue === "deductible") {
        if (type === "first") {
          // 第一个
          text = "免赔" + val + "元"; // 我也不晓得text干嘛的，有点懵
          this.checkData.selectorOptionMngInfos[index].option1 = val;
        } else {
          text = val + "%赔付";
          this.checkData.selectorOptionMngInfos[index].option2 = val;
        }
        if (
          this.checkData.selectorOptionMngInfos[index].option1 &&
          this.checkData.selectorOptionMngInfos[index].option2
        ) {
          this.checkData.selectorOptionMngInfos[index].option =
            "免赔" +
            this.checkData.selectorOptionMngInfos[index].option1 +
            "元" +
            this.checkData.selectorOptionMngInfos[index].option2 +
            "%赔付";
        }
        this.checkData.selectorOptionMngInfos[index].value = "0";
      } else if (parentValue === "peopleNum") {
        // 人数调整系数
        // 只能是整数
        val = parseInt(this.getData(val));
        if (type === "first") {
          text = val;
          this.checkData.selectorOptionMngInfos[index].option1 = val;
        } else {
          text = val + "人(含)";
          this.checkData.selectorOptionMngInfos[index].option2 = val;
        }
        if (
          this.checkData.selectorOptionMngInfos[index].option1 &&
          this.checkData.selectorOptionMngInfos[index].option2
        ) {
          if (
            parseInt(this.checkData.selectorOptionMngInfos[index].option1) >=
            parseInt(this.checkData.selectorOptionMngInfos[index].option2)
          ) {
            this.$message.warning("请填写正确的区间范围！");
            this.checkData.selectorOptionMngInfos[index].option1 = null;
            // return false;
            // this.checkData.selectorOptionMngInfos[index].option1 = 0;
          }
          this.checkData.selectorOptionMngInfos[index].option =
            this.checkData.selectorOptionMngInfos[index].option1 +
            "-" +
            this.checkData.selectorOptionMngInfos[index].option2 +
            "人(含)";
          this.checkData.selectorOptionMngInfos[index].value =
            Number(this.checkData.selectorOptionMngInfos[index].option1) + 1;
        }
      } else if (parentValue === "third") {
        // 三者责任
        if (type === "first") {
          // 第一个
          text = "累计赔偿限额" + val + "万元，"; // 我也不晓得text干嘛的，有点懵
          this.checkData.selectorOptionMngInfos[index].option1 = val;
        } else if (type === "second") {
          text = "每次事故限额" + val + "万元，";
          this.checkData.selectorOptionMngInfos[index].option2 = val;
        } else if (type === "third") {
          text = "其中医疗费用" + val + "万元，";
          this.checkData.selectorOptionMngInfos[index].option3 = val;
        } else if (type === "four") {
          text = "财产损失" + val + "万元，";
          this.checkData.selectorOptionMngInfos[index].option4 = val;
        }
        if (
          this.checkData.selectorOptionMngInfos[index].option1 &&
          this.checkData.selectorOptionMngInfos[index].option2 &&
          this.checkData.selectorOptionMngInfos[index].option3 &&
          this.checkData.selectorOptionMngInfos[index].option4
        ) {
          this.checkData.selectorOptionMngInfos[index].option =
            "累计赔偿限额" +
            this.checkData.selectorOptionMngInfos[index].option1 +
            "万元，每次事故限额" +
            this.checkData.selectorOptionMngInfos[index].option2 +
            "万元，其中医疗费用" +
            this.checkData.selectorOptionMngInfos[index].option3 +
            "万元，财产损失" +
            this.checkData.selectorOptionMngInfos[index].option4;
        }
        this.checkData.selectorOptionMngInfos[index].value = this.checkData.selectorOptionMngInfos[index].option1 * 10000;
      } else if ( parentValue === 'hospitalized') {
          // 住院津贴的免赔比例
           val = parseInt(this.getData(val));
          if (type === "first") {
          // 第一个
          // text = "免赔" + val + "天，每次事故累计不超过"; // 我也不晓得text干嘛的，有点懵
          this.checkData.selectorOptionMngInfos[index].option1 = val;
        } else if (type === "second") {
          // text = "每次事故限额" + val + "万元，";
          this.checkData.selectorOptionMngInfos[index].option2 = val;
        } else if (type === "third") {
          // text = "其中医疗费用" + val + "万元，";
          this.checkData.selectorOptionMngInfos[index].option3 = val;
        }
        if (
          this.checkData.selectorOptionMngInfos[index].option1 &&
          this.checkData.selectorOptionMngInfos[index].option2 &&
          this.checkData.selectorOptionMngInfos[index].option3
        ) {
          this.checkData.selectorOptionMngInfos[index].option =
            "免赔" +
            this.checkData.selectorOptionMngInfos[index].option1 +
            "天，每次事故累计不超过" +
            this.checkData.selectorOptionMngInfos[index].option2 +
            "天，累计赔偿不超过" +
            this.checkData.selectorOptionMngInfos[index].option3 +
            "天"
        }
        this.checkData.selectorOptionMngInfos[index].value = "0";
      } else if (parentValue === 'tardy') {
        // 误工 免赔比例
         val = parseInt(this.getData(val));
          if (type === "first") {
          // 第一个
          // text = "免赔" + val + "天，每次事故累计不超过"; // 我也不晓得text干嘛的，有点懵
          this.checkData.selectorOptionMngInfos[index].option1 = val;
        } else if (type === "second") {
          // text = "每次事故限额" + val + "万元，";
          this.checkData.selectorOptionMngInfos[index].option2 = val;
        }
        if (
          this.checkData.selectorOptionMngInfos[index].option1 &&
          this.checkData.selectorOptionMngInfos[index].option2 
        ) {
          this.checkData.selectorOptionMngInfos[index].option =
            "免赔" +
            this.checkData.selectorOptionMngInfos[index].option1 +
            "天，累计赔偿不超过" +
            this.checkData.selectorOptionMngInfos[index].option3 +
            "天"
        }
        this.checkData.selectorOptionMngInfos[index].value = "0";
      }
    },
    changeOption(val, option) {
      this.checkData.disabled = option === "暂不考虑" && val;
      this.checkData.selectorOptionMngInfos.forEach(item => {
        if (val && option === "暂不考虑") {
          // 如果是选了暂不考虑就把除了暂不考虑的都disabled，其他就放出来
          if (item.option !== "暂不考虑") {
            item.disabled = true;
          }
        } else {
          item.disabled = false;
        }
      });
      // console.log('12312312')
      this.$emit("changeCheck", this.checkData.selectorOptionMngInfos);
    }
  }
};
</script>

<style scoped lang="scss">
.checkbox-components {
  .deductible-diy {
    span {
      // 为了让免赔比例样式统一
      line-height: 32px;
    }
  }
  .el-input {
    width: 150px;
  }
  .option-style {
    display: inline-block;
    width: 85px;
    text-align: center;
    line-height: 32px;
  }
  .option-style-deductible {
    display: inline-block;
    padding: 0 10px;
    text-align: center;
    line-height: 32px;
  }
}
</style>
