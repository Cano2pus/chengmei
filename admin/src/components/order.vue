<template>
  <div class="content">
    <div class="content-top disflex">
      <div>
        <el-button type="info" size="mini" @click="refresh">刷新</el-button>
        <el-button type="success" size="mini" @click="opertion(0)">全部订单</el-button>
        <el-button type="danger" size="mini" @click="opertion(1)">待发货</el-button>
        <el-button type="danger" size="mini" @click="opertion(2)">待收货</el-button>
        <el-button type="danger" size="mini" @click="opertion(3)">已完成</el-button>
        <el-button type="danger" size="mini" @click="opertion(4)">已取消</el-button>
      </div>
      <div>
        <el-input placeholder="请输入关键字" prefix-icon="el-icon-search" v-model="search" size="mini"></el-input>
      </div>
    </div>

    <el-table :data="tabledata" style="width: 100%">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column label="图片">
        <template slot-scope="scope">
          <img :src="scope.row.img" alt />
        </template>
      </el-table-column>
      <el-table-column label="商品名称" prop="good_name"></el-table-column>
      <el-table-column label="价格" prop="price"></el-table-column>
      <el-table-column label="收货人" prop="name"></el-table-column>
      <el-table-column label="收货地址">
        <template
          slot-scope="scope"
        >{{scope.row.procince}}{{scope.row.city}}{{scope.row.area}}{{scope.row.detailed}}</template>
      </el-table-column>
      <el-table-column label="发货状态">
        <template slot-scope="scope">
          <span v-if="scope.row.state == 1">待发货</span>
          <span v-if="scope.row.state == 2">待收货</span>
          <span v-if="scope.row.state == 3">已完成</span>
          <span v-if="scope.row.state == 4">已取消</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="250">
        <template slot-scope="scope">
          <el-button type="default" size="mini" @click="fahuo(scope.row)">发货</el-button>
          <el-button type="danger" size="mini" @click="delelterow(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      background
      layout="prev, pager, next"
      :total="total"
      :page-size="data.size"
      @current-change="pageChange"
    ></el-pagination>
  </div>
</template>
<script>
import axios from "axios";
export default {
  data() {
    return {
      tabledata: [],
      search: "",
      total: 0,
      data: {
          token: this.$store.getters.getToken,
          page: 1,
          size: 5
      }
    };
  },
  methods: {
    getList() {
      axios({
        method: "post",
        url: this.$store.getters.getDomain + "api/admin/userOrderList",
        data: this.data
      }).then(res => {
        if (res.data.code == 2000) {
          this.tabledata = res.data.data.data;
          this.total = res.data.data.count;
        }
      });
    },
    refresh() {
      this.getList();
    },
    pageChange(page) {
      this.data.page = page;
      this.refresh();
    },
    fahuo(row) {
      axios({
        method: "post",
        url: this.$store.getters.getDomain + "api/admin/deliveryGood",
        data: {
          token: this.$store.getters.getToken,
          id: row.order_id
        }
      }).then(res => {
        if (res.data.code == 2000) {
          this.$message.success("发货成功");
        } else {
          this.$message.success("发货失败");
        }
      });
    },
    opertion(val){
        this.data.state = val;
        this.getList();
    },
    delelterow(row){
        console.log(row.order_id);
        
    }
  },
  mounted() {
    this.getList();
    console.log(this.data);
    
  }
};
</script>
<style>
.disflex {
  display: flex;
  justify-content: space-between;
}
.el-table .cell img {
  width: 100px;
}
</style>