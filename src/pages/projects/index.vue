<template>
  <div>
    <el-breadcrumb class="_mb2">
      <el-breadcrumb-item>项目列表</el-breadcrumb-item>
    </el-breadcrumb>
  
    <div v-loading='$isAjax.init'>
      <div class="_mt3"
           v-for='(t,tKey) in map.archiveType'
           :key='tKey'>
        <h5>
          {{t}}的项目
          <span class="_text">[{{archiveLists[tKey].length}}]</span>
        </h5>
        <el-row :gutter="10"
                class="_mt1">
          <el-col :span='6'
                  v-for='project in archiveLists[tKey]'
                  :key='project.id'>
            <card :title='`${project.address} [${project.houseType} ${project.area}㎡]`'
                  :to="{name:'projects-pid-budgets',params:{pid:project.id}}"
                  to-title="进入项目"
                  :type='archiveThemeMap[tKey]'>
              <el-row>
                {{project.username}} {{map.gender[project.gender]}}
              </el-row>
              <el-row class="_mt1">
                <el-col :span="18"
                        class="_text">
                  {{project.mobile}}
                </el-col>
                <el-col :span="6">
                  <el-button @click='handleEdit(project)'
                             type='text'
                             class="_p0">
                    编辑
                  </el-button>
                  <el-button @click='handleDelete(project)'
                             :loading='$isAjax.delete && currentDelId === project.id'
                             type='text'
                             class="_p0 _text-danger">
                    删除
                  </el-button>
                </el-col>
              </el-row>
              <p class='_mt1 _text'>
                <span class="_fr">
  
                </span>
              </p>
            </card>
          </el-col>
          <el-col :span='6'
                  v-if='+tKey===1'>
            <card-plus @click='handleAdd'>
  
            </card-plus>
          </el-col>
        </el-row>
      </div>
    </div>
  
    <!--dialog-->
    <dialog-wrapper title='项目'
                    v-model='showDialog'
                    :mode='opt'
                    @submit='submit(row)'
                    :loading='$isAjax.create || $isAjax.update'>
      <el-form :model='row'
               :rules='rules'
               label-width='80px'>
        <h4>客户信息</h4>
        <hr>
        <el-form-item label='客户名称'
                      class="_mt1"
                      prop="username">
          <el-input placeholder='请输入客户名称'
                    v-focus
                    v-if="showDialog"
                    v-model='row.username'>
          </el-input>
        </el-form-item>
        <el-form-item label='联系电话'
                      prop="mobile">
          <el-input placeholder='请输入联系电话'
                    v-model='row.mobile'></el-input>
        </el-form-item>
        <el-form-item label='性别'
                      prop="gender">
          <el-select v-model='row.gender'>
            <el-option v-for='(g,gKey) in map.gender'
                       :key='gKey'
                       :label='g'
                       :value='+gKey'>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label='客户邮箱'
                      prop="email">
          <el-input placeholder='请输入客户邮箱'
                    v-model='row.email'>
          </el-input>
        </el-form-item>
        <h4>项目信息</h4>
        <hr>
        <el-form-item label='项目地址'
                      prop="address"
                      class="_mt1">
          <el-input placeholder='请输入项目地址'
                    v-model='row.address'>
          </el-input>
        </el-form-item>
        <el-form-item label='房型'
                      prop="houseType">
          <el-input placeholder='请输入项目房型(例如：三房两厅)'
                    v-model='row.houseType'>
          </el-input>
        </el-form-item>
        <el-form-item label='套内面积'
                      prop="area">
          <el-input-number :min='10'
                           :step="10"
                           :debounce="800"
                           v-model.number="row.area">
          </el-input-number>
          <span class="_ml1">平方米</span>
        </el-form-item>
        <el-form-item label='状态'
                      v-if="opt==='edit'">
          <el-select v-model='row.archiveType'>
            <el-option v-for='(t,tKey) in map.archiveType'
                       :key='tKey'
                       :label='t'
                       :value='+tKey'>
            </el-option>
          </el-select>
        </el-form-item>
  
      </el-form>
    </dialog-wrapper>
  </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  data () {
    return {
      row: {},
      initialRow: {
        username: '',
        mobile: '',
        gender: '',
        address: '',
        email: '',
        area: 10,
        houseType: '',
        archiveType: 1
      },
      archiveThemeMap: {
        1: 'primary',
        2: 'default',
        3: 'warning',
        4: 'success'
      },

      opt: 'add',
      showDialog: false,

      rules: {
        username: [
          { required: true, message: '客户名称不能为空' }
        ],
        mobile: [
          { required: true, message: '手机号不能为空' },
        ],
        gender: [
          { required: true, message: '性别不能为空' }
        ],
        address: [
          { required: true, message: '地址不能为空' }
        ],
        houseType: [
          { required: true, message: '房型不能为空' }
        ]
      }
    }
  },
  computed: {
    ...mapGetters('projects', ['$isAjax', 'archiveLists', 'currentDelId', 'map']),
  },
  metaInfo: {
    title: '项目列表'
  },
  created () {
    this.init()
  },
  methods: {
    ...mapActions('projects', ['init', 'create', 'update', 'delete']),
    handleAdd () {
      this.opt = 'add'
      this.showDialog = true
      this.row = this.$utils.deepCopy(this.initialRow)
    },
    handleEdit (data) {
      this.opt = 'edit'
      this.showDialog = true
      this.row = this.$utils.deepCopy(data)
    },
    handleDelete (row) {
      this.$confirm('确认删除？').then(() => {
        this.delete(row.id).then(() => {
          this.$message.success('删除项目成功')
        })
      })
    },
    submit (row) {
      if (this.opt === 'add') {
        this.create(row).then(() => {
          this.$message.success('创建项目成功')
          this.closeDialog()
        })
      }
      if (this.opt === 'edit') {
        this.update(row).then(() => {
          this.$message.success('更新项目信息成功')
          this.closeDialog()
        })
      }
    },
    closeDialog () {
      this.showDialog = false
    }
  }
}
</script>



