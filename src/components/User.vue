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
    <el-button type="success" plain @click="showAddDialog">添加用户</el-button>
    <!-- 用户列表 -->
    <el-table :data="usersData" style="width: 100%">
      <el-table-column prop="username" label="姓名" width="160"></el-table-column>
      <el-table-column prop="email" label="邮箱" width="160"></el-table-column>
      <el-table-column prop="mobile" label="电话"></el-table-column>
      <el-table-column prop="mg_state" label="用户状态">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.mg_state"
            active-color="#13ce66"
            @change="changeState(scope.row)"
            inactive-color="#ff4949"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="操作" width="260">
        <template slot-scope="scope">
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="mini"
            plain
            @click="showEditDialog(scope.row)"
          ></el-button>
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
    <!-- 添加用户的对话框 -->
    <el-dialog title="添加用户" :visible.sync="dialogVisible" width="40%">
      <el-form :model="addForm" label-width="80px" :rules="rules" status-icon ref="addForm">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password" placeholder="请输入密码"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email" placeholder="请输入邮箱"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addForm.mobile" placeholder="请输入手机"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改用户的对话框 -->
    <el-dialog title="修改用户" :visible.sync="editDialogVisible" width="40%">
      <el-form :model="editForm" label-width="80px" :rules="rules" status-icon ref="editForm">
        <el-form-item label="用户名">
          <el-tag type="info">{{this.editForm.username}}</el-tag>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email" placeholder="请输入邮箱"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="editForm.mobile" placeholder="请输入手机"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateUser">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      usersData: [],
      query: '',
      currentPage: 1,
      pageSize: 2,
      total: 0,
      dialogVisible: false,
      editDialogVisible: false,
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      editForm: {
        id: '',
        username: '',
        email: '',
        mobile: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 9, message: '长度在3-9之间', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入用户密码', trigger: 'blur' },
          { min: 6, max: 12, message: '长度在6-12之间', trigger: 'blur' }
        ],
        email: [
          { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
        ],
        mobile: [
          {
            pattern: /^1\d{10}$/,
            message: '请输入正确的手机格式',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    async render() {
      let res = await this.axios({
        url: 'users',
        method: 'get',
        params: {
          query: this.query,
          pagenum: this.currentPage,
          pagesize: this.pageSize
        }
      })
      let {
        meta: { status },
        data: { total, users }
      } = res
      if (status === 200) {
        this.total = total
        this.usersData = users
      }
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
    async delUser(id) {
      try {
        await this.$confirm('你确定要删除此用户吗?', '温馨提示', {
          type: 'warning'
        })
        await this.axios({
          url: `users/${id}`,
          method: 'delete'
        })
        if (this.usersData.length <= 1 && this.currentPage > 1) {
          this.currentPage--
        }
        this.render()
        this.$message.success('删除成功!')
      } catch (e) {
        this.$message.info('已取消删除')
      }
    },
    async changeState({ id, mg_state: mgState }) {
      let res = await this.axios({
        url: `users/${id}/state/${mgState}`,
        method: 'put'
      })
      if (res.meta.status === 200) {
        this.$message.success('修改用户状态成功')
      } else {
        this.$message.err('修改用户状态失败')
      }
    },
    showAddDialog() {
      this.dialogVisible = true
    },
    addUser() {
      // 校验表单
      this.$refs.addForm.validate(async valid => {
        console.log(valid)
        if (!valid) return false
        let res = await this.axios({
          url: 'users',
          method: 'post',
          data: this.addForm
        })
        let {
          meta: { status, msg }
        } = res
        if (status === 201) {
          // 重置数据
          this.$refs.addForm.resetFields()
          this.dialogVisible = false
          // 显示最后一页
          this.total++
          this.currentPage = Math.ceil(this.total / this.pageSize)
          this.render()
          this.$message.success('用户创建成功了！')
        } else {
          this.$message.error(msg)
        }
      })
    },
    showEditDialog(row) {
      this.editDialogVisible = true
      this.editForm.id = row.id
      this.editForm.username = row.username
      this.editForm.email = row.email
      this.editForm.mobile = row.mobile
    },
    updateUser() {
      this.$refs.editForm.validate(async valid => {
        if (!valid) return false
        let res = await this.axios({
          url: `users/${this.editForm.id}`,
          method: 'put',
          data: this.editForm
        })
        let {
          meta: { status }
        } = res
        if (status === 200) {
          this.$message.success('恭喜你，更新成功')
          this.$refs.editForm.resetFields()
          this.editDialogVisible = false
          this.render()
        } else {
          this.$message.error('服务器异常')
        }
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
  .input-with-select {
    width: 300px;
    margin-bottom: 10px;
  }
}
</style>
