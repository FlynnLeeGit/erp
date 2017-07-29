<template>
  <div v-loading='$isAjax.init'>
    <el-row :gutter="10">
      <el-col :span='6'
              v-for='(b,index) in list'
              :key='b.id'>
        <card :title='b.name'
              type='default'
              :to="{name:'projects-pid-budgets-bid-items',params:{pid,bid:b.id}}"
              :to-title="'进入'+b.name">
          <p>
            <span>定额版本库:{{b.version}}</span>
            <span class="_ml1 _text">({{versionMap[b.version]}})</span>
          </p>
          <p class="_mt1">{{b.description}}</p>
          <p class='_mt1 _text'>
            劳务利润率 {{b.rateOfArtificialProfit * 100 }}%
            <br>公司利润率 {{b.rateOfCompanyProfit * 100 }}%
            <span class="_fr">
              <el-button @click.stop='handleEdit(b)'
                         type='text'
                         class="_p0">
                编辑
              </el-button>
              <el-button @click.stop='handleDelete(b)'
                         :loading='$isAjax.delete && currentDelId === b.id'
                         type='text'
                         class="_p0 _text-danger">
                删除
              </el-button>
            </span>
          </p>
        </card>
      </el-col>
      <el-col :span='6'>
        <card-plus style="height:160px;"
                   @click='handleAdd'>
        </card-plus>
      </el-col>
    </el-row>
  
    <!--dialog-->
    <dialog-wrapper title='预算'
                    v-model='showDialog'
                    :mode='opt'
                    :loading='$isAjax.create || $isAjax.update || $isAjax.copy'
                    @submit='submit(row)'>
      <el-form :model='row'
               :rules='rules'
               label-width='90px'>
        <el-form-item label='名称'
                      prop="name">
          <el-input placeholder='请输入预算名称'
                    v-model='row.name'></el-input>
        </el-form-item>
        <el-form-item label='说明'
                      prop='description'>
          <el-input placeholder='请输入该预算说明'
                    v-model='row.description'>
          </el-input>
        </el-form-item>
  
        <el-form-item label="从已有预算拷贝?">
          <el-switch v-model="row.isCopy">
          </el-switch>
        </el-form-item>
  
        <section v-if="row.isCopy">
          <el-form-item label="拷贝的预算">
            <el-select v-model="row.projectBudgetId">
              <el-option v-for="b in list"
                         :key="b.id"
                         :label="b.name"
                         :value="b.id">
              </el-option>
            </el-select>
          </el-form-item>
  
          <el-form-item label="使用的版本">
            <el-select v-model="row.useNewVersion">
              <el-option label="保留"
                         :value="0">
              </el-option>
              <el-option label="最新"
                         :value="1">
              </el-option>
            </el-select>
          </el-form-item>
        </section>
  
        <section v-else>
          <el-form-item label='劳务利润率'>
            <el-input-number placeholder='请输入劳务利润率'
                             :disabled="opt==='edit'"
                             :step='1'
                             :min='0'
                             :max="100"
                             v-model='row._rateOfArtificialProfit'>
            </el-input-number>
          </el-form-item>
          <el-form-item label='公司利润率'>
            <el-input-number placeholder='请输入公司利润率'
                             :disabled="opt==='edit'"
                             :min='0'
                             :max="100"
                             :step='1'
                             v-model='row._rateOfCompanyProfit'>
            </el-input-number>
          </el-form-item>
          <el-form-item label='定额版本库'>
            <el-select disabled
                       v-model='selectedVersion'>
              <el-option v-for='v in versionList'
                         :key='v.id'
                         :label='v.description'
                         :value='v.version'>
              </el-option>
            </el-select>
          </el-form-item>
        </section>
  
      </el-form>
    </dialog-wrapper>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
export default {
  data () {
    return {
      selectedVersion: '',

      row: {},
      initialRow: {
        name: '',
        description: '',
        rateOfArtificialProfit: 0.1,
        _rateOfArtificialProfit: 10,
        rateOfCompanyProfit: 0.3,
        _rateOfCompanyProfit: 30,

        isCopy: false,
        projectBudgetId: '',
        useNewVersion: 0
      },
      opt: 'add',
      showDialog: false,
      rules: {
        name: [
          { required: true, message: '名称不能为空' }
        ],
        description: [
          { required: true, message: '预算说明不能为空' }
        ]
      }
    }
  },
  created () {
    this.init(this.pid).then(() => {
      this.selectedVersion = this.versionList[this.versionList.length - 1].version
    })
  },
  computed: {
    ...mapGetters('quota/release', {
      versionList: 'list',
      versionMap: 'map'
    }),
    ...mapGetters('projects/_pid/budgets', ['$isAjax', 'list', 'currentDelId']),
    pid () {
      return +this.$route.params.pid
    }
  },
  methods: {
    ...mapActions('projects/_pid/budgets', ['init', 'create', 'update', 'delete', 'copy']),
    handleAdd () {
      this.opt = 'add'
      this.showDialog = true
      this.row = this.$utils.deepCopy(this.initialRow)
    },
    handleEdit (data) {
      this.opt = 'edit'
      this.showDialog = true
      this.row = this.$utils.deepCopy(data)
      this.row._rateOfArtificialProfit = data.rateOfArtificialProfit * 100
      this.row._rateOfCompanyProfit = data.rateOfCompanyProfit * 100
    },
    handleDelete (row) {
      this.$confirm('确认删除？')
        .then(() => {
          this.delete({
            pid: this.pid,
            bid: row.id
          }).then(() => {
            this.$message.success('删除成功')
          })
        })
    },
    submit (data) {
      if (this.opt === 'add') {
        if (data.isCopy) {
          this.submitCopy(data)
        } else {
          this.submitAdd(data)
        }
      }
      if (this.opt === 'edit') {
        this.submitEdit(data)
      }
    },
    submitAdd (data) {
      data.rateOfArtificialProfit = data._rateOfArtificialProfit / 100
      data.rateOfCompanyProfit = data._rateOfCompanyProfit / 100
      this.create({
        pid: this.pid,
        data
      }).then(() => {
        this.$message.success('添加成功！')
        this.closeDialog()
      })
    },
    submitEdit (data) {
      this.update(data).then(() => {
        this.$message.success('更新成功！')
        this.closeDialog()
      })
    },
    submitCopy (data) {
      this.copy({ pid: this.pid, data }).then(() => {
        this.$message.success('拷贝预算成功')
        this.closeDialog()
      })
    },
    closeDialog () {
      this.showDialog = false
    }
  }
}

</script>

