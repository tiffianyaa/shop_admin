<template>
  <div class="roles">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--表格组件 -->
    <el-table :data="roleList">
      <el-table-column type="expand">
        <template slot-scope="{row}">
          <span v-if="row.children.length===0">暂无权限</span>
          <!-- 一级权限 -->
          <el-row v-for="l1 in row.children" :key="l1.id" class="l1">
            <el-col :span="4">
              <el-tag closable @close="handleClose(row,l1.id)">{{l1.authName}}</el-tag>
            </el-col>
            <el-col :span="20">
              <!-- 二级权限 -->
              <el-row v-for="l2 in l1.children" :key="l2.id" class="l2">
                <el-col :span="4">
                  <el-tag closable type="success" @close="handleClose(row,l2.id)">{{l2.authName}}</el-tag>
                </el-col>
                <el-col :span="20">
                  <!-- 三级权限 -->
                  <span v-for="l3 in l2.children" :key="l3.id">
                    <el-tag
                      closable
                      type="warning"
                      class="l3"
                      @close="handleClose(row,l3.id)"
                    >{{l3.authName}}</el-tag>
                  </span>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column type="index"></el-table-column>
      <el-table-column label="角色名称" prop="roleName"></el-table-column>
      <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="{row}">
          <!-- {{row}} -->
          <el-button type="primary" plain class="el-icon-edit" size="mini"></el-button>
          <el-button type="danger" plain class="el-icon-delete" size="mini"></el-button>
          <el-button
            type="success"
            plain
            class="el-icon-check"
            size="mini"
            @click="showAssignDialog(row)"
          >分配权限</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分配权限对话框 -->
    <el-dialog title="角色授权" :visible.sync="dialogVisible" width="30%">
      <!-- 树形菜单 -->
      <el-tree
        :data="data"
        show-checkbox
        default-expand-all
        node-key="id"
        ref="tree"
        highlight-current
        :props="defaultProps"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="assignRight">分配</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      roleList: [],
      dialogVisible: false,
      data: [],
      defaultProps: {
        children: 'children',
        label: 'authName'
      },
      roleId: ''
    }
  },
  methods: {
    async getRoleList() {
      let res = await this.axios.get('roles')
      let {
        meta: { status },
        data
      } = res
      if (status === 200) {
        this.roleList = data
      }
    },
    async handleClose(row, rightId) {
      let res = await this.axios.delete(`roles/${row.id}/rights/${rightId}`)
      let {
        data,
        meta: { status }
      } = res
      if (status === 200) {
        // ★★★★★★如果重新渲染的话，展开行会闭合，用户体验不好，所以应该只重新渲染当前角色
        // this.getRoleList()
        // 可以用更新数据后后台返回的数据替换原来的数据
        row.children = data
        this.$message.success('取消权限成功')
      } else {
        this.$message.error('取消权限失败')
      }
    },
    async showAssignDialog(row) {
      // 保存角色id
      this.roleId = row.id
      this.dialogVisible = true
      let res = await this.axios.get('rights/tree')
      console.log(res)
      let {
        meta: { status },
        data
      } = res
      if (status === 200) {
        this.data = data
      }
      // 让节点选中
      // 如果是一级二级权限选中了他们的子节点页都选中了
      // 所以只能让所有的三级权限都选中(回显)
      let ids = []
      row.children.forEach(l1 => {
        l1.children.forEach(l2 => {
          l2.children.forEach(l3 => {
            ids.push(l3.id)
          })
        })
      })
      this.$refs.tree.setCheckedKeys(ids)
    },
    async assignRight() {
      // 获取所有被选中权限的id
      let checkedKeys = this.$refs.tree.getCheckedKeys()
      // 获取所有半选中权限的id
      let halfCheckedKeys = this.$refs.tree.getHalfCheckedKeys()
      let rids = checkedKeys.concat(halfCheckedKeys)
      // 后台需要的是字符串
      rids = rids.join()
      let res = await this.axios.post(`roles/${this.roleId}/rights`, { rids })
      console.log(res)
      let {
        meta: { status }
      } = res
      if (status === 200) {
        this.$message.success('角色分配成功')
        // 重新渲染树状列表
        this.getRoleList()
        this.dialogVisible = false
      } else {
        this.$message.error('角色分配失败')
      }
    }
  },
  created() {
    this.getRoleList()
  }
}
</script>

<style lang="less" scoped>
.l1 {
  margin: 10px 0;
  border-bottom: 1px dotted #ccc;
  .l2 {
    margin-bottom: 10px;
    .l3 {
      margin-bottom: 10px;
      margin-right: 10px;
    }
  }
}
</style>
