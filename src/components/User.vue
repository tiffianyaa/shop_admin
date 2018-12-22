<template>
  <div class="user">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索框 -->
    <el-input placeholder="请输入内容" v-model="query" class="input-with-select">
      <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
    </el-input>
    <el-button type="success" plain>添加用户</el-button>
    <!-- 用户列表 -->
    <el-table :data="usersData" style="width: 100%">
      <el-table-column prop="username" label="姓名" width="160"></el-table-column>
      <el-table-column prop="email" label="邮箱" width="160"></el-table-column>
      <el-table-column prop="mobile" label="电话"></el-table-column>
      <el-table-column prop="mg_state" label="用户状态">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.mg_state" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="操作" width="260">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" size="mini" plain></el-button>
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            plain
            @click="delUser(scope.row.id)"
          ></el-button>
          <el-button type="success" icon="el-icon-check" size="mini" plain>分配角色</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[2, 4, 6, 8]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      background
    ></el-pagination>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  data() {
    return {
      usersData: [],
      query: '',
      currentPage: 1,
      pageSize: 2,
      total: 0
    }
  },
  methods: {
    render() {
      axios({
        url: 'http://localhost:8888/api/private/v1/users',
        method: 'get',
        params: {
          query: this.query,
          pagenum: this.currentPage,
          pagesize: this.pageSize
        },
        headers: {
          Authorization: localStorage.getItem('token')
        }
      }).then(res => {
        console.log(res.data)
        if (res.data.meta.status === 200) {
          this.total = res.data.data.total
          this.usersData = res.data.data.users
        }
      })
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.render()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.render()
    },
    search() {
      this.currentPage = 1
      this.render()
    },
    delUser(id) {
      console.log(id)
      this.$confirm('你确定要删除此用户吗?', '温馨提示', {
        type: 'warning'
      })
        .then(() => {
          axios({
            url: `http://localhost:8888/api/private/v1/users/${id}`,
            method: 'delete',
            headers: {
              Authorization: localStorage.getItem('token')
            }
          }).then(res => {
            if (this.usersData.length <= 1 && this.currentPage > 1) {
              this.currentPage--
            }
            this.render()
            this.$message.success('删除成功!')
          })
        })
        .catch(() => {
          this.$message.info('已取消删除')
        })
    }
  },
  created() {
    this.render()
  }
}
</script>

<style lang="less" scoped>
.user {
  .el-breadcrumb {
    margin: 15px 0;
    padding-left: 10px;
  }
  .el-input {
    width: 300px;
    margin-bottom: 10px;
  }
}
</style>
