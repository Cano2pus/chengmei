<template>
  <div class="content">
    <div class="content-top disflex">
      <div>
        <el-button type="primary" size="mini">添加</el-button>
        <el-button type="danger" size="mini" @click="deleteSelected">删除</el-button>
      </div>
      <div>
        <el-input placeholder="请输入关键字" prefix-icon="el-icon-search" v-model="search" size="mini"></el-input>
      </div>
    </div>
    <el-table :data="tabledata" style="width: 100%" @selection-change="selectionChange" tooltip-effect="dark">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column label="图片" width="80">
        <template slot-scope="scope">
          <img :src="scope.row.img" alt class="tableimg" />
        </template>
      </el-table-column>
      <el-table-column label="名称" prop="good_name"></el-table-column>
      <el-table-column label="价格" prop="price" width="100"></el-table-column>
      <el-table-column label="状态" width="80">
        <template slot-scope="scope">
          <span v-if="scope.row.status == 1">正常</span>
          <span v-if="scope.row.status == 3">禁用</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="250">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="edit(scope.row)">编辑</el-button>
          <el-button type="warning" size="mini" @click="banrow(scope.row)">禁用</el-button>
          <el-button type="danger" size="mini" @click="deleterow(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      background
      layout="prev, pager, next"
      :total="totalpage"
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
      search: "", // 搜索关键词
      tabledata: [],
      page: 1,
      size: 5,
      totalpage: 0,
      multiple: [],
      form: {}
    };
  },

  methods: {
    getList(_page, _size) {
      axios({
        method: "post",
        url: this.$store.getters.getDomain + "api/admin/goodList",
        data: {
          token: this.$store.getters.getToken,
          page: _page,
          size: _size
        }
      }).then(res => {
        this.tabledata = res.data.data.data;
        this.totalpage = res.data.data.count;
      });
    },
    requestHandle(_data, _url){
      axios({
        method: "post",
        url: this.$store.getters.getDomain + _url,
        data: _data
      }).then(res => {
        if (res.data.code == 2000) {
          this.$message.success("操作成功");
          if (this.page == Math.ceil(this.totalpage / this.size)) {
            this.page = Math.ceil((this.totalpage - 1) / this.size);
          }
          this.getList(this.page.toString(), this.size.toString());
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    selectionChange(val){
      this.multiple = val;
    },
    pageChange(page){
      this.page = page;
      this.getList(this.page.toString(), this.size.toString());
    },
    deleteSelected(){
      this.multiple.forEach(item => {
        this.deleterow(item);
      })
    },
    deleterow(row){
      let data = {
        token: this.$store.getters.getToken,
        good_id: row.good_id
      }
      this.requestHandle(data, "api/admin/deleteGood");
    },
    banrow(row){
      let data = {
        token: this.$store.getters.getToken,
        good_id: row.good_id
      }
      this.requestHandle(data, "api/admin/banGood");
    },
    edit(row){
      this.form = row;
      this.$router.push({
        name: "detail",
        params: this.form
      })
    }
  },

  mounted() {
    this.getList(this.page.toString(), this.size.toString());
  }
};
</script>
<style scoped>
.tableimg {
  max-width: 100px;
  max-height: 50px;
}

.disflex {
  display: flex;
  justify-content: space-between;
}
</style>
<style>
</style>