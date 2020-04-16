<template>
    <div class="app-container">
        <h4>分类</h4>
        <el-divider></el-divider>
        <input v-model="addClassData.class_name"></input>
        <input v-model="addClassData.class_name_en"></input>
        <el-button @click="addClass()" style="height: 30px; line-height: 5px;">添加</el-button>
        <draggable v-model="class_list" @end="end">
            <transition-group>
                <div v-for="element in class_list"
                     :key="element.id" style="margin-top: 10px">
                    <input v-model="element.class_name"></input>
                    <input v-model="element.class_name_en"></input>
                    <el-button @click="delClass(element.id)" style="height: 30px; line-height: 5px;">删除</el-button>

                </div>
            </transition-group>
        </draggable>
        <el-button @click="sortClass()" style="height: 30px; line-height: 5px;">确定</el-button>
        <el-divider></el-divider>
        <h4>菜单</h4>
        <el-divider></el-divider>
        <el-button @click="editMenuDialogShow()" style="height: 30px; line-height: 5px;">添加</el-button>
        <el-table
                v-loading="listLoading"
                :data="list"
                row-key="id"
                element-loading-text="Loading"
                border
                fit
                highlight-current-row
        >
            <el-table-column align="center" label="ID" width="95">
                <template slot-scope="scope">
                    {{ scope.row.id }}
                </template>
            </el-table-column>
            <el-table-column label="图片" width="110" align="center">
                <template slot-scope="scope">
                    <el-image
                            style="width: 50px; height: 50px"
                            :src="scope.row.img"
                            fit="fill"></el-image>

                </template>
            </el-table-column>
            <el-table-column label="类别" width="110" align="center">
                <template slot-scope="scope">
                    {{ scope.row.class_name }}
                </template>
            </el-table-column>
            <el-table-column label="名称" width="110" align="center">
                <template slot-scope="scope">
                    <span>{{ scope.row.name }}</span>
                </template>
            </el-table-column>

            <el-table-column label="推荐" width="110" align="center">
                <template slot-scope="scope">
                    <span>{{ scope.row.is_thumbs_up }}</span>
                </template>
            </el-table-column>

            <el-table-column label="价格" width="110" align="center">
                <template slot-scope="scope">
                    ${{ scope.row.money/100 }}
                </template>
            </el-table-column>
            <!--<el-table-column class-name="status-col" label="Status" width="110" align="center">
                <template slot-scope="scope">
                    <el-tag :type="scope.row.status | statusFilter">{{ scope.row.status }}</el-tag>
                </template>
            </el-table-column>-->
            <el-table-column align="center" prop="created_at" label="添加时间" width="200">
                <template slot-scope="scope">
                    <i class="el-icon-time"/>
                    <span>{{ scope.row.created_at }}</span>
                </template>
            </el-table-column>

            <el-table-column align="center" prop="created_at" label="操作" width="200">
                <template slot-scope="scope">
                    <el-button
                            style="line-height: 4px; margin-right: 10px;"
                            type="primary"
                            size="mini"
                            @click="editMenus( scope.row )"
                    >编辑
                    </el-button>

                    <!--  <el-button
                              style="line-height: 4px; margin-right: 10px;"
                              type="primary"
                              size="mini"
                              @click="editMenus( scope.row )"
                              v-if=""
                      >隐藏
                      </el-button>
                      <el-button
                              style="line-height: 4px; margin-right: 10px;"
                              type="primary"
                              size="mini"
                              @click="editMenus( scope.row )"
                      >显示
                      </el-button>-->
                </template>
            </el-table-column>
        </el-table>

        <el-dialog
                title="菜品"
                :visible.sync="editMenuDialog"
                width="500px"
        >
            <el-form :model="addMenuData">


                <el-form-item label="类别：" style="position: relative;left: 20px">
                    <el-select v-model="addMenuData.class_id" placeholder="请选择类别" size="mini"
                               style="width: 155px;margin-top:-9px;">
                        <el-option :label="v.class_name" :value="v.id" v-for="v in class_list"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="名称：" prop="name" style="position: relative;left: 20px">
                    <el-input
                            v-model="addMenuData.name"
                            placeholder="名称"
                            size="mini"
                            style="width: 155px;margin-top:-9px;"
                    ></el-input>
                </el-form-item>
                <el-form-item label="英文名称：" prop="name_en" style="position: relative;left: 20px">
                    <el-input
                            v-model="addMenuData.name_en"
                            placeholder="英文名称"
                            size="mini"
                            style="width: 155px;margin-top:-9px;"
                    ></el-input>
                </el-form-item>
                <el-form-item label="价格：" prop="money" style="position: relative;left: 20px">
                    <el-input
                            v-model="addMenuData.money"
                            placeholder="价格"
                            size="mini"
                            style="width: 155px;margin-top:-9px;"
                    ></el-input>
                </el-form-item>
                <el-form-item label="推荐：" style="position: relative;left: 20px">
                    <el-radio v-model="addMenuData.is_thumbs_up" label="1">是</el-radio>
                    <el-radio v-model="addMenuData.is_thumbs_up" label="0">否</el-radio>
                </el-form-item>
                <el-form-item label="显示：" style="position: relative;left: 20px">
                    <el-radio v-model="addMenuData.status" label="1">是</el-radio>
                    <el-radio v-model="addMenuData.status" label="0">否</el-radio>
                </el-form-item>
                <el-form-item label="图片:" style="position: relative;left: 20px">
                    <el-upload
                            ref="upload1"
                            class="upload-demo"
                            action="http://img-cn2.apiserver.cc/upload"
                            multiple
                            :auto-upload="true"
                            :http-request="beforeUpload1"
                            :limit="1"
                            style="width: 280px"
                            :on-success="uploadSuccess"
                    >
                        <el-button size="small" type="primary" class="needsclick">上传</el-button>
                    </el-upload>
                </el-form-item>
                <img :src="addMenuData.img" style="width: 100px;height: 100px;margin-left: 20px;">
                <el-form-item>
                    <el-button
                            type="primary"
                            @click="addMenus"
                            style="height: 30px; line-height: 5px;margin-left: 20px;"
                    >{{addMenuTitle}}
                    </el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>

<script>
  import { getMenu, getPolicyToken, addMenu, editMenu, sortClass, addClass, delClass, sortMenu } from '@/api/table'
  import axios from 'axios'
  import { Message } from 'element-ui'
  import draggable from 'vuedraggable'
  import Sortable from 'sortablejs'

  export default {
    components: {
      draggable,
      Sortable
    },
    filters: {
      statusFilter(status) {
        const statusMap = {
          published: 'success',
          draft: 'gray',
          deleted: 'danger'
        }
        return statusMap[status]
      }
    },
    data() {
      return {
        addClassData: {},
        content: '',
        addMenuTitle: '添加',
        addMenuData: {
          img: ''
        },
        aliyunOssToken: {},
        editMenuDialog: false,
        list: null,
        listLoading: true,
        class_list: [],
        pages: {
          page: 1,
          pageSize: 15
        }
      }
    },
    created() {
      this.fetchData()

    },
    methods: {
      rowDrop() {
        const tbody = document.querySelector('.el-table__body-wrapper tbody')
        Sortable.create(tbody, {
          onEnd: ({ newIndex, oldIndex }) => {
            console.log(newIndex, oldIndex)
            if (newIndex > oldIndex) {
              for (let i = 0; i < this.list.length; i++) {
                if (i > oldIndex) {
                  this.list[i].sort = i - 1
                }
              }
            }
            if (newIndex < oldIndex) {
              //a,b,c,d,e,f,g
              //0,1,2,3,4,5,6
              //a,f,b,c,d,e,g
              //f->g 6->1
              //0,6,1,2,3,4,5
              for (let i = 0; i < this.list.length; i++) {
                if (i >= newIndex) {
                  this.list[i].sort = i + 1
                }
              }

            }
            this.list[oldIndex].sort = newIndex
            console.log(this.list)
            sortMenu({ menu: this.list }).then(response => {
              Message({
                message: response.message,
                type: 'info',
                duration: 5 * 1000
              })
              this.fetchData()
            })
          }
        })
      },
      delClass(id) {
        this.$confirm('此操作将永久删除该分类, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          delClass({ id }).then(response => {
            Message({
              message: response.message,
              type: 'info',
              duration: 5 * 1000
            })
            this.fetchData()
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })

      },
      addClass() {
        this.addClassData.sort = this.class_list.length
        addClass(this.addClassData).then(response => {
          Message({
            message: response.message,
            type: 'info',
            duration: 5 * 1000
          })
          this.fetchData()
        })
      },
      sortClass() {
        console.log(this.class_list)
        sortClass({ class: this.class_list }).then(response => {
          Message({
            message: response.message,
            type: 'info',
            duration: 5 * 1000
          })
          this.fetchData()
        })
      },
      end: function(evt) {
        for (let i = 0; i < this.class_list.length; i++) {
          this.class_list[i].sort = i
        }
      },
      editMenus(data) {

        this.addMenuTitle = '修改'
        this.editMenuDialog = true
        let c = JSON.stringify(data)

        this.addMenuData = JSON.parse(c)
        this.addMenuData.money = this.addMenuData.money / 100
        this.getOssToken()
      },
      editMenuDialogShow() {
        this.addMenuTitle = '添加'
        this.editMenuDialog = true
        this.getOssToken()
        this.addMenuData = {
          img: ''
        }
      },
      addMenus() {
        if (this.addMenuTitle == '添加') {
          this.addMenuData.sort = this.list.length
          addMenu(this.addMenuData).then(response => {
            Message({
              message: response.message,
              type: 'info',
              duration: 5 * 1000
            })
            this.editMenuDialog = false
            this.fetchData()
          })
        } else {
          editMenu(this.addMenuData).then(response => {
            Message({
              message: response.message,
              type: 'info',
              duration: 5 * 1000
            })
            this.editMenuDialog = false
            this.fetchData()
          })
        }

      },
      fetchData() {
        this.listLoading = true
        getMenu(this.pages).then(response => {
          this.list = response.data.menu
          this.class_list = response.data.class
          this.listLoading = false
          this.rowDrop()
        })
      },
      beforeUpload1(file) {
        console.log(file)
        this.aliyunOssToken.key = 'ttttt/' + new Date().getTime() + '/' + this.randomString()
        this.aliyunOssToken.success_action_status = 200
        this.aliyunOssToken.OSSAccessKeyId = this.aliyunOssToken.accessid
        this.aliyunOssToken.file = file.file

        let form = new FormData()
        let arr = []
        let str = ''
        for (let a of Object.keys(this.aliyunOssToken)) {
          arr.push(a)
        }

        for (let b of arr) {
          let val = this.aliyunOssToken[b]
          str += `${b}=${val}`
          form.append(b, val)
        }
        axios({
          url: this.aliyunOssToken.host,
          method: 'post',
          data: form,
          //上传进度
          //onUploadProgress:file.onProgress(progressEvent)
          onUploadProgress: (progressEvent) => {
            file.file.percent = progressEvent.loaded / progressEvent.total * 100 | 0  //百分比
            console.log(progressEvent)
            file.onProgress(file.file)
          }
        }).then(response => {
          file.onSuccess(response, file) //上传成功(打钩的小图标)
        })

      },
      randomString() {
        return (new Date % 9e6).toString(36) + Math.random().toString(36).substring(2, 7)
      },
      getOssToken() {
        getPolicyToken().then(res => {
          if (res.status_code == 200) {
            this.aliyunOssToken = res.data
          }
          console.log(this.aliyunOssToken)
        })
      },
      uploadSuccess(response) {
        //this.ruleForm.template.based.productImageSrc = response.data.url
        this.addMenuData.img = this.aliyunOssToken.host + '/' + this.aliyunOssToken.key
      }
    }
  }
</script>
<style>
    .demo-table-expand {
        font-size: 0;
    }

    .demo-table-expand label {
        width: 90px;
        color: #99a9bf;
    }

    .demo-table-expand .el-form-item {
        margin-right: 0;
        margin-bottom: 0;
        width: 25%;
    }
</style>
