<template>
    <div class="app-container">
        <el-form ref="form" :model="form" label-width="80px">
            <el-form-item label="标题">
                <el-input v-model="form.title"></el-input>
            </el-form-item>
            <el-form-item label="作者">
                <el-input v-model="form.author"></el-input>
            </el-form-item>
            <el-form-item label="类别">
                <el-radio-group v-model="form.lang" placeholder="类别">
                    <el-radio label="zh">中文</el-radio>
                    <el-radio label="en">英文</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="显示">
                <el-radio-group v-model="form.status" placeholder="类别">
                    <el-radio label="1">显示</el-radio>
                    <el-radio label="0">隐藏</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="显示">
                <el-date-picker
                        v-model="form.created_at"
                        type="date"
                        value-format="yyyy-MM-dd"
                        placeholder="选择日期">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="封面" style="position: relative;">
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
            <el-form-item label="">
                <img :src="form.img" style="height: 200px;" v-if="form.img">
            </el-form-item>
            <el-form-item label="内容">
                <tinymce v-model="form.content" :height="300"/>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="addContents">提交</el-button>
            </el-form-item>
        </el-form>


        <el-table
                v-loading="listLoading"
                :data="list"
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
            <el-table-column label="封面" width="110" align="center">
                <template slot-scope="scope">
                    <el-image
                            style="width: 50px; height: 50px"
                            :src="scope.row.img"
                            fit="fill"></el-image>

                </template>
            </el-table-column>
            <el-table-column label="标题" width="110" align="center">
                <template slot-scope="scope">
                    {{ scope.row.title }}
                </template>
            </el-table-column>
            <el-table-column label="作者" width="110" align="center">
                <template slot-scope="scope">
                    {{ scope.row.author }}
                </template>
            </el-table-column>
            <el-table-column label="类别" width="110" align="center">
                <template slot-scope="scope">
                    <span>{{ scope.row.lang }}</span>
                </template>
            </el-table-column>

            <el-table-column label="显示" width="110" align="center">
                <template slot-scope="scope">
                    {{ scope.row.status }}
                </template>
            </el-table-column>
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
                            @click="editContent( scope.row )"
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
    </div>
</template>

<script>
  import { getMenu, getPolicyToken, addContent, getContent } from '@/api/table'
  import axios from 'axios'
  import { Message } from 'element-ui'
  import Tinymce from '@/components/Tinymce'

  export default {
    components: {
      Tinymce
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
        content: '',
        form: {
          lang: 'zh',
          img: '',
          status: '1'
        },
        list: null,
        listLoading: true,
        pages: {
          page: 1,
          pageSize: 15
        }
      }
    },
    created() {
      this.getOssToken()
      this.fetchData()
    },
    methods: {
      editContent(a) {
        let c = JSON.stringify(a)
        this.form = JSON.parse(c)
        window.scrollTo(0, 0)
      },
      addContents() {
        addContent(this.form).then(response => {
          Message({
            message: response.message,
            type: 'info',
            duration: 5 * 1000
          })
          this.form = {
            lang: 'zh',
            img: '',
            status: '1'
          }
          this.fetchData()
        })
      },
      fetchData() {
        this.listLoading = true
        getContent(this.pages).then(response => {
          this.list = response.data.data
          this.listLoading = false
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
        this.form.img = this.aliyunOssToken.host + '/' + this.aliyunOssToken.key
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
