<template>
  <el-dialog :visible.sync='visible'
             title="pdf文档生成">
    <el-form label-width='120px'>
      <el-form-item label='甲方名称'>
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
        <el-input v-model='form.designer'>
  
        </el-input>
      </el-form-item>
      <el-form-item label='设计师电话'>
        <el-input v-model='form.designerMobile'>
  
        </el-input>
      </el-form-item>
      <el-form-item label='乙方代表'>
        <el-input v-model='form.partyBName'>
  
        </el-input>
      </el-form-item>
      <el-form-item label='乙方电话'>
        <el-input v-model='form.partyBMobile'>
  
        </el-input>
      </el-form-item>
      <el-form-item label='税金'>
        <el-input v-model='form.tax'>
  
        </el-input>
      </el-form-item>
  
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
  
      <el-form-item label='五、总造价'>
        <span class="_text">
          {{totalConst}} 元
        </span>
      </el-form-item>
  
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
        <span class="_ml1">[水电验收完成后支付(一+五)*40%+二]</span>
      </el-form-item>
  
      <el-form-item label='三期款'>
        <span class="_text">
          {{thirdPayment}} 元
        </span>
        <span class="_ml1">[泥木验收完成后支付(一+五)*50%]</span>
      </el-form-item>
  
      <el-form-item label='尾款'>
        <span class="_text">
          {{lastPayment}} 元
        </span>
        <span class="_ml1">[竣工验收完成后支付(一+五)*10%]</span>
      </el-form-item>
  
    </el-form>
    <div slot='footer'
         class="dialog-footer">
  
      <el-button @click="close()">取 消</el-button>
      <el-button type="primary"
                 :loading="isCreating"
                 @click="submitCreate()">
        <span v-if="isCreating">生成中...</span>
        <span v-else>生成</span>
      </el-button>
      <el-button v-show='pdfUrl && !isCreating'
                 type="text">
        <a :href="pdfUrl"
           style="color:inherit;"
           target="_blank">点击查看pdf</a>
      </el-button>
    </div>
  </el-dialog>
</template>
<script>
import { createPdf } from './api'
export default {
  data () {
    return {
      visible: false,
      isCreating: false,
      // 预算id
      bid: 0,
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
      matAndArtTotalPrice: 0
    }
  },
  computed: {
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
    open (bid, matAndArtTotalPrice) {
      this.bid = bid
      this.matAndArtTotalPrice = matAndArtTotalPrice
      this.visible = true
    },
    close () {
      this.visible = false
    },
    submitCreate () {
      this.isCreating = true
      const sendData = Object.assign(this.form, {
        totalConst: this.totalConst,
        firstPayment: this.firstPayment,
        secondPayment: this.secondPayment,
        thirdPayment: this.thirdPayment,
        lastPayment: this.lastPayment
      })
      createPdf(this.bid, sendData)
        .then(({ data }) => {
          this.pdfUrl = window.URL.createObjectURL(data)
          this.isCreating = false
        })
        .catch(() => {
          this.isCreating = false
        })
    }
  }
}
</script>
