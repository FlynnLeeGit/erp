<template>
  <div>
    <div v-loading='isFetching'>
      <div class="_mt3"
           v-for='(t,tKey) in map.archiveType'
           :key='tKey'>
        <h5>
          {{t}}的项目
          <span class="_text">[{{filterTableData[tKey].length}}]</span>
        </h5>
        <el-row :gutter="10"
                class="_mt1">
          <el-col :span='6'
                  v-for='project in filterTableData[tKey]'
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
                             :loading='isDeleting && delId === project.id'
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
        <el-form-item label='客户名称' class="_mt1">
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
        <el-form-item label='项目地址' class="_mt1">
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
                   :loading='isSubmiting'
                   @click="submitAdd(row)">
          添 加
        </el-button>
        <el-button v-if="opt==='edit'"
                   type="primary"
                   :loading='isSubmiting'
                   @click="submitEdit(row)">
          更 新
        </el-button>
  
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { get, edit, add, del, getMap } from './api'
export default {
  data () {
    return {
      tableData: [],
      map: {},
      isFetching: false,
      isDeleting: false,
      delId: 0,

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
      editRow: {},

      archiveThemeMap: {
        1: 'primary',
        2: 'default',
        3: 'warning',
        4: 'success'
      },


      opt: 'add',
      showDialog: false,
      isSubmiting: false
    }
  },
  created () {
    this.initData()
  },
  computed: {
    filterTableData () {
      const getData = type => this.tableData.filter(p => p.archiveType === type)
      return {
        1: getData(1),
        2: getData(2),
        3: getData(3),
        4: getData(4)
      }
    }
  },
  methods: {
    initData () {
      this.isFetching = true
      return Promise.all([get(), getMap()])
        .then(([one, two]) => {
          this.tableData = one.data
          this.map = two.data.project_info
        })
        .finally(() => {
          this.isFetching = false
        })
    },
    handleAdd () {
      this.opt = 'add'
      this.showDialog = true
      this.row = this.$utils.deepCopy(this.initialRow)
    },
    handleEdit (data) {
      this.opt = 'edit'
      this.showDialog = true
      this.editRow = data
      this.row = this.$utils.deepCopy(this.editRow)
    },
    handleDelete (row) {
      this.delId = row.id
      this.$confirm('确认删除？')
        .then(() => {
          this.isDeleting = true
          return del(row.id)
        })
        .then(() => {
          this.$message.success('删除成功')
          this.tableData.splice(this.tableData.indexOf(row), 1)
        })
        .finally(() => {
          this.isDeleting = false
        })
    },
    submitAdd (row) {
      this.isSubmiting = true
      add(row)
        .then(({ data }) => {
          this.$message.success('添加成功！')
          this.tableData.push(data)
          this.showDialog = false
        })
        .finally(() => {
          this.isSubmiting = false
        })
    },
    submitEdit (row) {
      this.isSubmiting = true
      edit(row)
        .then(({ data }) => {
          this.$message.success('更新成功！')
          this.$utils.replaceObjectFields(this.editRow, data)
          this.showDialog = false
        })
        .finally(() => {
          this.isSubmiting = false
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
        },
        query: {
          name: project.address
        }
      })
    }
  }
}
</script>



