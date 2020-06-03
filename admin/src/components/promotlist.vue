<template>
  <div class="content">
    <div class="content-top disflex">
      <div>
        <el-button type="info" size="mini" icon="el-icon-refresh" @click="sort">排序</el-button>
        <el-button type="success" size="mini" icon="el-icon-check" @click="add">添加</el-button>
        <el-button type="danger" size="mini" icon="el-icon-delete" @click="deleteAll">删除</el-button>
      </div>
      <div>
        <el-input placeholder="请输入关键字" prefix-icon="el-icon-search" v-model="search" size="mini"></el-input>
      </div>
    </div>
    <el-table ref="table" :data="tableData" style="width: 100%" @selection-change="selectionChange">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column prop="title" label="促销商品"></el-table-column>
      <el-table-column prop="vice_title" label="副标题"></el-table-column>
      <el-table-column label="图片">
        <template slot-scope="scope">
          <img :src="scope.row.pic" alt class="tableimg" />
        </template>
      </el-table-column>
      <el-table-column prop="promotion_price" label="促销价格"></el-table-column>
      <el-table-column prop="hot" label="是否上首页">
        <template slot-scope="scope">
          <p v-if="scope.row.hot == 1">是</p>
          <p v-else>否</p>
        </template>
      </el-table-column>
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
          <el-button type="default" size="mini" @click="edit(scope.row)">编辑</el-button>
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
    <!-- dialog -->
    <el-dialog :title="title" :visible.sync="dialogVisible">
      <el-form :model="form">
        <el-form-item label="促销栏目：" class="disinb">
          <el-select v-model="form.promotion_id" class="adv">
            <el-option
              v-for="item in promotions"
              :key="item.title"
              :label="item.title"
              :value="item.promotion_id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="促销商品：" class="disinb">
          <el-autocomplete
            class="inline-input"
            value-key="good_name"
            v-model="compete"
            :fetch-suggestions="querySearch"
            :trigger-on-focus="false"
            placeholder="请输入内容"
            @select="handleSelect"
          ></el-autocomplete>
        </el-form-item>
        <el-form-item label="标题：">
          <el-input v-model="form.title"></el-input>
        </el-form-item>
        <el-form-item label="副标题：">
          <el-input v-model="form.vice_title"></el-input>
        </el-form-item>
        <el-form-item label="促销价格：">
          <el-input v-model="form.price"></el-input>
        </el-form-item>
        <el-form-item label="是否上首页：">
          <el-select v-model="form.hot" class="adv">
            <el-option label="是" :value="1"></el-option>
            <el-option label="否" :value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <template>
            <el-upload
              class="pic"
              :action="url"
              :show-file-list="false"
              :before-upload="beforeAvatarUpload"
              :on-success="handleAvatarSuccess"
              name="img"
            >
              <img v-if="form.pic" :src="form.pic" alt />
              <i v-else class="el-icon-plus pic-uploader-icon"></i>
            </el-upload>
          </template>
        </el-form-item>
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
      tableData: [],
      index: 1,
      size: 5,
      total: 0,
      title: "",
      dialogVisible: false,
      form: {
        promotion_id: "",
        good_id: "",
        title: "",
        price: "",
        vice_title: "",
        pic: "",
        hot: ""
      },
      url: this.$store.getters.getDomain + "api/savePic",
      multipleSelection: [],
      search: "",
      promotions: [],
      compete: ""
    };
  },
  watch: {
    search: function(val) {
      if (val) {
        let reg = new RegExp(val);
        this.tableData = this.tableData.filter(function(item) {
          return reg.test(item.title);
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
        url: this.$store.getters.getDomain + "api/admin/promotionGoodList",
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
    querySearch(queryString, cb) {
      axios({
        method: "POST",
        url: this.$store.getters.getDomain + "api/admin/goodList",
        data: {
          token: this.$store.getters.getToken,
          search: queryString
        }
      }).then(res => {
        cb(res.data.data.data);
      });
    },
    handleSelect(item) {
      this.form.good_id = item.good_id;
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
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
    handleAvatarSuccess(res, file) {
      if (res.code == 2000) {
        this.form.pic = this.$store.getters.getDomain + res.data;
      } else {
        this.$message.error("图片上传失败");
      }
    },
    pageChange(page) {
      this.index = page;
      this.getList(this.index.toString(), this.size.toString());
    },
    edit(val) {
      this.dialogVisible = true;
      this.title = "编辑";
      this.form = {
        promotion_id: val.promotion_id,
        good_id: val.good_id,
        title: val.title,
        vice_title: val.vice_title,
        pic: val.pic,
        price: val.promotion_price,
        hot: val.hot
      };
      this.getGoodName(val.good_id)
      console.log(this.compete);
      
      this.form.id = val.id;
    },
    getGoodName(id){
      axios({
        method: "post",
        url: this.$store.getters.getDomain + "api/admin/goodInfo",
        data: {
          token: this.$store.getters.getToken,
          good_id: id
        }
      }).then(res => {
        this.compete = res.data.data.good_name;
      })
    },
    confirm() {
      this.dialogVisible = false;
      let data = {
        token: this.$store.getters.getToken,
        promotion_id: this.form.promotion_id,
        good_id: this.form.good_id,
        title: this.form.title,
        vice_title: this.form.vice_title,
        pic: this.form.pic,
        promotion_price: this.form.price,
        hot: this.form.hot
      };
      if (this.title == "编辑") {
        data.id = this.form.id;
      }
      this.request(data, "/api/admin/promotionGoodAddModify");
    },
    ban(val) {
      let data = {
        token: this.$store.getters.getToken,
        id: val.id
      };
      this.request(data, "/api/admin/promotionGoodBan");
    },
    selectionChange(val) {
      this.multipleSelection = val;
    },
    deleteAll() {
      this.multipleSelection.forEach(element => {
        let data = {
          token: this.$store.getters.getToken,
          id: element.id
        };
        this.request(data, "/api/admin/promotionGoodDelete");
      });
    },
    dele(val) {
      let data = {
        token: this.$store.getters.getToken,
        id: val.id
      };
      this.request(data, "/api/admin/promotionGoodDelete");
    },
    add() {
      this.dialogVisible = true;
      this.title = "添加";
      this.form = {
        title: "",
        vice_title: "",
        pic: ""
      };
      this.compete = ""
    },
    sort() {
      this.$refs.table.sort("title", "ascending");
    }
  },
  mounted() {
    this.getList(this.index.toString(), this.size.toString());

    // 获取促销栏目
    axios({
      method: "POST",
      url: this.$store.getters.getDomain + "api/admin/promotionTyepList",
      data: {
        token: this.$store.getters.getToken
      }
    }).then(res => {
      if (res.data.code == 2000) {
        this.promotions = res.data.data.data;
      } else {
        this.$message.error(res.data.msg);
      }
    });
  }
};
</script>
<style>
.tableimg {
  max-width: 100px;
  max-height: 50px;
}
.pic .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.pic .el-upload:hover {
  border-color: #409eff;
}
.pic-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.pic img {
  width: 178px;
  height: 178px;
  display: block;
}
.showicon {
  width: 50px;
  height: 50px;
  border-radius: 50%;
}
.disflex {
  display: flex;
  justify-content: space-between;
}
.inline-input {
  width: 100%;
}
</style>