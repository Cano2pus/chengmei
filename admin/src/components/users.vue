<template>
  <div class="content">
    <div class="content-top disflex">
      <div>
        <el-button type="info" size="mini" icon="el-icon-refresh" @click="sort">排序</el-button>
      </div>
      <div>
        <el-input placeholder="请输入关键字" prefix-icon="el-icon-search" v-model="search" size="mini"></el-input>
      </div>
    </div>
    <el-table ref="table" :data="tableData" style="width: 100%">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column prop="user_id" label="ID"></el-table-column>
      <el-table-column prop="nick_name" label="账号"></el-table-column>
      <el-table-column label="状态">
        <template slot-scope="scope">
          <p v-if="scope.row.status == 1">正常</p>
          <p v-else>禁用</p>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="250">
        <template slot-scope="scope">
          <el-button
            v-if="scope.row.status == 1"
            type="default"
            size="mini"
            @click="ban(scope.row)"
          >禁用</el-button>
          <el-button
            v-if="scope.row.status == 3"
            type="default"
            size="mini"
            @click="ban(scope.row)"
          >启用</el-button>
          <el-button type="danger" size="mini" @click="dele(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      layout="prev, pager, next"
      :total="total"
      :page-size="size"
      @current-change="pageChange"
    ></el-pagination>

  </div>
</template>
<script>
import axios from "axios";
export default {
  data() {
    return {
      tableData: [],
      index: 1,
      size: 5,
      total: 0,
      search: ""
    };
  },
  watch: {
    search: function(val) {
      if (val) {
        let reg = new RegExp(val);
        this.tableData = this.tableData.filter(function(item) {
          return reg.test(item.user_account);
        });
      } else {
        this.getList(this.index.toString(), this.size.toString());
      }
    }
  },
  methods: {
    getList(_page, _size) {
      axios({
        method: "POST",
        url: this.$store.getters.getDomain + "api/admin/userList",
        data: {
          token: this.$store.getters.getToken,
          page: _page,
          size: _size
        }
      }).then(res => {
        if (res.data.code == 2000) {
          this.tableData = res.data.data.data;
          this.total = res.data.data.count;
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    request(_data, _url) {
      axios({
        method: "POST",
        url: this.$store.getters.getDomain + _url,
        data: _data
      }).then(res => {
        if (res.data.code == 2000) {
          this.$message.success("操作成功");
          if (this.index == Math.ceil(this.total / this.size)) {
            this.index = Math.ceil((this.total - 1) / this.size);
          }
          this.getList(this.index.toString(), this.size.toString());
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    pageChange(page) {
      this.index = page;
      this.getList(this.index.toString(), this.size.toString());
    },
    ban(val) {
      let data = {
        token: this.$store.getters.getToken,
        id: val.user_id
      };
      this.request(data, "/api/admin/userAccountBan");
    },
    dele(val) {
      let data = {
        token: this.$store.getters.getToken,
        id: val.user_id
      };
      this.request(data, "/api/admin/userAccountDelete");
    },
    sort(){
        this.$refs.table.sort("user_id", "ascending");
    }
  },
  mounted() {
    this.getList(this.index.toString(), this.size.toString());
  }
};
</script>
<style>
.disflex {
  display: flex;
  justify-content: space-between;
}
</style>