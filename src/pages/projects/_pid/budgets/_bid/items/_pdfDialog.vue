<template>
  <el-dialog :visible.sync='visible'
             title="pdf文档生成">
  
    <el-form label-width='120px'>
      <h3>基本信息</h3>
      <hr>
      <el-form-item label='甲方名称'
                    v-focus
                    v-if="visible"
                    class="_mt1">
        <el-input v-model='form.partyAName'
                  placeholder="请输入甲方名称">
        </el-input>
      </el-form-item>
  
      <el-form-item label='甲方电话'>
        <el-input v-model='form.partyAMobile'
                  placeholder="请输入甲方电话">
        </el-input>
      </el-form-item>
  
      <el-form-item label='甲方邮箱'>
        <el-input v-model='form.partyAEmail'
                  placeholder="请输入甲方邮箱">
        </el-input>
      </el-form-item>
  
      <el-form-item label='套内面积'>
        <el-input-number v-model='form.area'
                         :min="0"
                         :step='10'>
        </el-input-number>
        <span class="_ml1">平方米 [步进10]</span>
      </el-form-item>
  
      <el-form-item label='施工地址'>
        <el-input v-model='form.address'
                  placeholder="请输入地址">
        </el-input>
      </el-form-item>
  
      <el-form-item label='房型'>
        <el-input v-model='form.houseType'
                  placeholder="请输入房型">
        </el-input>
      </el-form-item>
  
      <el-form-item label='设计师'>
        <el-input v-model='form.designer'
                  placeholder="请输入设计师姓名">
  
        </el-input>
      </el-form-item>
      <el-form-item label='设计师电话'>
        <el-input v-model='form.designerMobile'
                  placeholder="请输入设计师电话">
  
        </el-input>
      </el-form-item>
      <el-form-item label='乙方代表'>
        <el-input v-model='form.partyBName'
                  placeholder="请输入乙方代表姓名">
  
        </el-input>
      </el-form-item>
      <el-form-item label='乙方电话'>
        <el-input v-model='form.partyBMobile'
                  placeholder="请输入乙方电话">
  
        </el-input>
      </el-form-item>
  
      <h3>装修工程造价</h3>
      <hr>
      <el-form-item label='一、半包施工项(含辅材人工)'>
        <span class="_text">{{matAndArtTotalPrice}} 元</span>
      </el-form-item>
  
      <el-form-item label='二、甲指乙供材料'>
        <el-input-number v-model='form.aToBMaterial'
                         :min="0"
                         :step="1000"
                         :debounce="800">
        </el-input-number>
        <span class="_mt1">元 [步进1000]</span>
      </el-form-item>
  
      <el-form-item label='三、甲指甲供材料'>
        <el-input-number v-model='form.aNairMaterial'
                         :min="0"
                         :step="1000"
                         :debounce="800">
        </el-input-number>
        <span class="_mt1">元 [步进1000]</span>
  
      </el-form-item>
  
      <el-form-item label='四、配套措施与管理费'>
        <el-input-number v-model='form.facilitiesManagementPrice'
                         :min="0"
                         :step="1000"
                         :debounce="800">
        </el-input-number>
        <span class="_mt1">元 [步进1000]</span>
      </el-form-item>
  
      <el-form-item label='五、税金'>
        <el-input-number v-model='form.tax'
                         :min="0"
                         :step="100"
                         :debounce="800">
        </el-input-number>
        <span class="_mt1">元 [步进100]</span>
      </el-form-item>
  
      <el-form-item label='六、总造价'>
        <span class="_text">
          {{totalConst}} 元
        </span>
        <span class="_mt1">[一 + 二 + 四 + 五]</span>
      </el-form-item>
  
      <h3>付款方式</h3>
      <hr>
      <el-form-item label='首付款'>
        <span class="_text">
          {{firstPayment}} 元
        </span>
        <span class="_ml1">[签订合同支付第四项全额]</span>
      </el-form-item>
  
      <el-form-item label='二期款'>
        <span class="_text">
          {{secondPayment}} 元
        </span>
        <span class="_ml1">[水电验收完成后支付(一 + 五) * 40% + 二]</span>
      </el-form-item>
  
      <el-form-item label='三期款'>
        <span class="_text">
          {{thirdPayment}} 元
        </span>
        <span class="_ml1">[泥木验收完成后支付(一 + 五) * 50%]</span>
      </el-form-item>
  
      <el-form-item label='尾款'>
        <span class="_text">
          {{lastPayment}} 元
        </span>
        <span class="_ml1">[竣工验收完成后支付(一 + 五) * 10%]</span>
      </el-form-item>
  
    </el-form>
    <div slot='footer'
         class="dialog-footer">
  
      <el-button @click="close()">取 消</el-button>
      <el-button type="primary"
                 :loading="$isAjax.create_pdf"
                 @click="submitCreate()">
        <span v-if="$isAjax.create_pdf">生成中...</span>
        <span v-else>生成</span>
      </el-button>
      <el-button v-show='pdfUrl && !$isAjax.create_pdf'
                 type="text">
        <a :href="pdfUrl"
           style="color:inherit;"
           target="_blank">点击查看pdf[{{createTime}}]</a>
      </el-button>
    </div>
  </el-dialog>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
export default {
  data () {
    return {
      visible: false,
      // 预算id
      form: {
        partyAName: '',
        partyAMobile: '',
        partyAEmail: '',
        area: 0,
        address: '',
        houseType: '',
        designer: '',
        designerMobile: '',
        partyBName: '',
        partyBMobile: '',
        tax: 0,
        aToBMaterial: 0,
        aNairMaterial: 0,
        facilitiesManagementPrice: 0
      },
      pdfUrl: '',
      createTime: '',
      matAndArtTotalPrice: 0
    }
  },
  computed: {
    ...mapGetters('projects/_pid', ['projectInfo']),
    ...mapGetters('projects/_pid/budgets/_bid/items', ['$isAjax']),
    bid () {
      return +this.$route.params.bid
    },
    totalConst () {
      return (this.matAndArtTotalPrice + this.form.aToBMaterial + this.form.facilitiesManagementPrice + this.form.tax).toFixed(2)
    },
    firstPayment () {
      return this.form.facilitiesManagementPrice.toFixed(2)
    },
    secondPayment () {
      return ((this.matAndArtTotalPrice + this.form.tax) * 0.4 + this.form.aToBMaterial).toFixed(2)
    },
    thirdPayment () {
      return ((this.matAndArtTotalPrice + this.form.tax) * 0.5).toFixed(2)
    },
    lastPayment () {
      return ((this.matAndArtTotalPrice + this.form.tax) * 0.1).toFixed(2)
    },
  },
  methods: {
    ...mapActions('projects/_pid/budgets/_bid/items', ['create_pdf']),
    initForm (projectInfo) {
      this.form.area = this.projectInfo.area
      this.form.address = this.projectInfo.address
      this.form.houseType = this.projectInfo.houseType
      this.form.partyAName = this.projectInfo.username
      this.form.partyAMobile = this.projectInfo.mobile
      this.form.partyAEmail = this.projectInfo.email
      this.form.designer = this.projectInfo.user.name
      this.form.designerMobile = this.projectInfo.user.mobile
    },
    open (matAndArtTotalPrice) {
      this.matAndArtTotalPrice = matAndArtTotalPrice
      this.initForm()
      this.visible = true
    },
    close () {
      this.visible = false
    },
    submitCreate () {
      const sendData = Object.assign(this.form, {
        totalConst: this.totalConst,
        firstPayment: this.firstPayment,
        secondPayment: this.secondPayment,
        thirdPayment: this.thirdPayment,
        lastPayment: this.lastPayment
      })
      this.create_pdf({
        bid: this.bid,
        data: sendData
      })
        .then(({ data }) => {
          this.pdfUrl = window.URL.createObjectURL(data)
          this.createTime = new Date().toLocaleTimeString()
        })
    }
  }
}
</script>
