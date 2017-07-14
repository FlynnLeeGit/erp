<template>
  <el-dialog :visible.sync='visible'
             title="pdf文档生成">
    <el-form label-width='140px'
             @submit.native='submit()'>
  
      <el-form-item label='甲方名称'>
        <el-input v-model='form.partyAName'>
  
        </el-input>
      </el-form-item>
      <el-form-item label='甲方电话'>
        <el-input v-model='form.partyAMobile'>
  
        </el-input>
      </el-form-item>
      <el-form-item label='甲方邮箱'>
        <el-input v-model='form.partyAEmail'>
  
        </el-input>
      </el-form-item>
      <el-form-item label='套内面积'>
        <el-input v-model='form.area'>
  
        </el-input>
      </el-form-item>
  
      <el-form-item label='施工地址'>
        <el-input v-model='form.address'>
  
        </el-input>
      </el-form-item>
  
      <el-form-item label='房型'>
        <el-input v-model='form.houseType'>
  
        </el-input>
      </el-form-item>
      <el-form-item label='编制日期'>
        <el-input v-model='form.compileDate'>
  
        </el-input>
      </el-form-item>
      <el-form-item label='公司地址'>
        <el-input v-model='form.companyAddress'>
  
        </el-input>
      </el-form-item>
      <el-form-item label='投诉电话'>
        <el-input v-model='form.complaintsMobile'>
  
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
      <el-form-item label='总造价'>
        <el-input v-model='form.totalConst'>
  
        </el-input>
      </el-form-item>
      <el-form-item label='甲指甲供材料'>
        <el-input v-model='form.aNairMaterial'>
  
        </el-input>
      </el-form-item>
      <el-form-item label='甲指乙供材料'>
        <el-input v-model='form.aToBMaterial'>
  
        </el-input>
      </el-form-item>
      <el-form-item label='配套措施与管理费'>
        <el-input v-model='form.facilitiesManagementPrice'>
  
        </el-input>
      </el-form-item>
      <el-form-item label='首付款'>
        <el-input v-model='form.firstPayment'>
  
        </el-input>
      </el-form-item>
      <el-form-item label='二期款'>
        <el-input v-model='form.secondPayment'>
  
        </el-input>
      </el-form-item>
      <el-form-item label='三期款'>
        <el-input v-model='form.thirdPayment'>
  
        </el-input>
      </el-form-item>
  
      <el-form-item label='尾款'>
        <el-input v-model='form.lastPayment'>
  
        </el-input>
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
        partyAName: 'A',
        partyAMobile: '001',
        partyAEmail: 'a@com',
        area: 0,
        address: 'address',
        houseType: '1ting',
        companyAddress: 'companyAddress',
        complaintsMobile: '002',
        designer: 'designer',
        designerMobile: '003',
        partyBName: 'B',
        partyBMobile: '004',
        tax: 0,
        totalConst: 0,
        aNairMaterial: 0,
        aToBMaterial: 0,
        facilitiesManagementPrice: 0,
        firstPayment: 0,
        secondPayment: 0,
        thirdPayment: 0,
        lastPayment: 0
      },
      pdfUrl: ''
    }
  },
  methods: {
    open (bid) {
      this.bid = bid
      this.visible = true
    },
    close () {
      this.visible = false
    },
    submitCreate () {
      this.isCreating = true
      createPdf(this.bid, this.form)
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
