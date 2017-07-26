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
    <el-dialog title='预算'
               :visible.sync='showDialog'>
      <el-form :model='row'
               label-width='100px'>
        <el-form-item label='名称'>
          <el-input placeholder='请输入预算名称'
                    v-model='row.name'></el-input>
        </el-form-item>
        <el-form-item label='说明'>
          <el-input placeholder='请输入该预算说明'
                    v-model='row.description'>
          </el-input>
        </el-form-item>
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
      </el-form>
      <div slot='footer'
           class="dialog-footer">
        <el-button @click="closeDialog()">取 消</el-button>
        <el-button v-if="opt==='add'"
                   type="success"
                   :loading='$isAjax.create'
                   @click="submitAdd(row)">
          添 加
        </el-button>
        <el-button v-if="opt==='edit'"
                   type="primary"
                   :loading='$isAjax.update'
                   @click="submitEdit(row)">
          更 新
        </el-button>
      </div>
    </el-dialog>
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
        _rateOfCompanyProfit: 30
      },
      opt: 'add',
      showDialog: false,
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
    ...mapActions('projects/_pid/budgets', ['init', 'create', 'update', 'delete']),
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
    closeDialog () {
      this.showDialog = false
    }
  }
}

</script>

