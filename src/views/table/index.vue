<template>
    <div class="app-container">
        <el-table
                v-loading="listLoading"
                :data="list"
                element-loading-text="Loading"
                border
                fit
                highlight-current-row
        >
            <el-table-column type="expand">
                <template slot-scope="props">
                    <el-form label-position="left" inline class="demo-table-expand">
                        <div v-for="(v,k) in props.row.menu">
                            <el-form-item label="商品名称">
                                <span>{{ v.menus_name }}</span>
                            </el-form-item>
                            <el-form-item label="类别">
                                <span>{{ v.class_name }}</span>
                            </el-form-item>
                            <el-form-item label="数量">
                                <span>${{ v.order_info_money/100 }} X {{ v.num }}</span>
                            </el-form-item>
                        </div>
                    </el-form>
                </template>
            </el-table-column>
            <el-table-column align="center" label="ID" width="95">
                <template slot-scope="scope">
                    {{ scope.row.id }}
                </template>
            </el-table-column>
            <el-table-column label="电话">
                <template slot-scope="scope">
                    {{ scope.row.phone }}
                </template>
            </el-table-column>
            <el-table-column label="姓名" width="110" align="center">
                <template slot-scope="scope">
                    <span>{{ scope.row.name }}</span>
                </template>
            </el-table-column>
            <el-table-column label="地址" width="110" align="center">
                <template slot-scope="scope">
                    {{ scope.row.address }}
                </template>
            </el-table-column>
            <el-table-column label="用餐人数" width="110" align="center">
                <template slot-scope="scope">
                    {{ scope.row.people }}
                </template>
            </el-table-column>
            <el-table-column label="送餐时间" width="110" align="center">
                <template slot-scope="scope">
                    {{ scope.row.time }}分
                </template>
            </el-table-column>
            <el-table-column label="备注" width="110" align="center">
                <template slot-scope="scope">
                    {{ scope.row.remark }}
                </template>
            </el-table-column>
            <el-table-column label="消费税" width="110" align="center">
                <template slot-scope="scope">
                    {{ scope.row.tax/100 }}
                </template>
            </el-table-column>
            <el-table-column label="外卖费" width="110" align="center">
                <template slot-scope="scope">
                    {{ scope.row.ship/100 }}
                </template>
            </el-table-column>
            <el-table-column label="金额" width="110" align="center">
                <template slot-scope="scope">
                    {{ scope.row.money/100 }}
                </template>
            </el-table-column>
            <!--<el-table-column class-name="status-col" label="Status" width="110" align="center">
                <template slot-scope="scope">
                    <el-tag :type="scope.row.status | statusFilter">{{ scope.row.status }}</el-tag>
                </template>
            </el-table-column>-->
            <el-table-column align="center" prop="created_at" label="下单时间" width="200">
                <template slot-scope="scope">
                    <i class="el-icon-time"/>
                    <span>{{ scope.row.created_at }}</span>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
  import { getList } from '@/api/table'

  export default {
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
        list: null,
        listLoading: true,
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
      fetchData() {
        this.listLoading = true
        getList(this.pages).then(response => {
          this.list = response.data.data
          this.listLoading = false
        })
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
