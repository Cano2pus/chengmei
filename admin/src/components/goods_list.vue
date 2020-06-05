<template>
  <div class="content">
    <div class="content-top">
      <el-button type="primary" size="mini" @click="dialogVisible = true">添加</el-button>
      <el-button type="danger" size="mini">删除</el-button>
    </div>
    
    <el-table :data="tabledata" style="width: 100%" tooltip-effect="dark">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column label="分类名称">
        <template slot-scope="scope">
          <span v-if="scope.row.parent_id == 0">{{scope.row.type_name}}</span>
          <span v-else>---二级---{{scope.row.type_name}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="250">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="editrow(scope.row)">修改</el-button>
          <el-button type="danger" size="mini" @click="deleterow(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>


    <el-dialog :title="title" :visible.sync="dialogVisible">
      <el-form :model="form">
        <el-form-item label="输入一级栏目名称：">
          <el-input v-model="form.title"></el-input>
        </el-form-item>
        <el-form-item label="选择一级栏目：">
          <el-input v-model="form.type1"></el-input>
        </el-form-item>
        <span style="color: red">提示：不选一级栏目默认一级</span>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirm">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>
<script>
import axios from "axios";
export default {
  data() {
    return {
      tabledata: [],
      title: "",
      dialogVisible: false,
      form: {
        title: "",
        type: []
      }
    };
  },

  methods: {
    getList() {
      axios({
        method: "post",
        url: this.$store.getters.getDomain + "api/admin/goodsTypeList",
        data: {
          token: this.$store.getters.getToken
        }
      }).then(res => {
        this.tabledata = res.data.data;
        this.totalpage = res.data.data.length;
      });
    },
    handleRequest(_data, _url){
      axios({
        method: "post",
        url: this.$store.getters.getDomain + _url,
        data: _data
      }).then(res => {
        if(res.data.code == 2000){
          this.$message.success("操作成功");
        }else{
          this.$message.success(res.data.msg);
        }
        this.getList();
      });
    },
    deleterow(row){
      let data = {
        token: this.$store.getters.getToken,
        id: row.good_type_id
      }
      this.handleRequest(data, "api/admin/deleteGoodtype");
    },
    confirm(){

    }
  },

  mounted() {
    this.getList();  
    
  }
};
</script>
<style scoped>

</style>