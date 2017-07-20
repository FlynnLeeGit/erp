<template>
  <div>
    <el-breadcrumb>
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
            <card :title='project.address'
                  :type='archiveThemeMap[tKey]'>
              <el-button @click='goDetail(project)'
                         type='info'
                         slot='header-slot'
                         class="_fr"
                         size='small'>
                进入项目
              </el-button>
  
              <span>{{project.username}} {{map.gender[project.gender]}}</span>
              <p class='_mt1 _text'>
                {{project.mobile}}
                <span class="_fr">
                  <el-button @click.stop='handleEdit(project)'
                             type='text'
                             class="_p0">
                    编辑
                  </el-button>
                  <el-button @click.stop='handleDelete(project)'
                             :loading='$isAjax.delete && currentDelId === project.id'
                             type='text'
                             class="_p0 _text-danger">
                    删除
                  </el-button>
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
    <el-dialog title='创建项目'
               :visible.sync='showDialog'>
      <el-form :model='row'
               label-width='80px'>
        <h4>客户信息</h4>
        <hr>
        <el-form-item label='客户名称'
                      class="_mt1">
          <el-input placeholder='请输入客户名称'
                    v-model='row.username'></el-input>
        </el-form-item>
        <el-form-item label='联系电话'>
          <el-input placeholder='请输入联系电话'
                    v-model='row.mobile'></el-input>
        </el-form-item>
        <el-form-item label='性别'>
          <el-select v-model='row.gender'>
            <el-option v-for='(g,gKey) in map.gender'
                       :key='gKey'
                       :label='g'
                       :value='+gKey'>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label='客户邮箱'>
          <el-input placeholder='请输入客户邮箱'
                    v-model='row.email'>
          </el-input>
        </el-form-item>
        <h4>项目信息</h4>
        <hr>
        <el-form-item label='项目地址'
                      class="_mt1">
          <el-input placeholder='请输入项目地址'
                    v-model='row.address'>
          </el-input>
        </el-form-item>
        <el-form-item label='房型'>
          <el-input placeholder='请输入项目房型(例如：三房两厅)'
                    v-model='row.houseType'>
          </el-input>
        </el-form-item>
        <el-form-item label='套内面积'>
          <el-input-number :min='0'
                           :step="10"
                           :debounce="800"
                           v-model="row.area">
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
      <div slot='footer'
           class="dialog-footer">
        <el-button @click="cancelDialog()">取 消</el-button>
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
        area: 0,
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
    }
  },
  computed: {
    ...mapGetters('project/list', ['$isAjax', 'archiveLists', 'currentDelId']),
    ...mapGetters('project', ['map'])
  },
  created () {
    this.init()
  },
  methods: {
    ...mapActions('project/list', ['init', 'create', 'update', 'delete']),
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
    submitAdd (row) {
      this.create(row).then(() => {
        this.$message.success('创建项目成功')
        this.cancelDialog()
      })
    },
    submitEdit (row) {
      this.update(row).then(() => {
        this.$message.success('更新项目信息成功')
        this.cancelDialog()
      })
    },
    cancelDialog () {
      this.showDialog = false
    },
    goDetail (project) {
      this.$router.push({
        name: 'project.detail.budget',
        params: {
          pid: project.id
        }
      })
    }
  }
}
</script>



