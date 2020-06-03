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
      <el-table-column prop="title" label="标题"></el-table-column>
      <el-table-column label="图片">
        <template slot-scope="scope">
          <img :src="scope.row.pic" alt class="tableimg" />
        </template>
      </el-table-column>
      <el-table-column label="目标页面">
        <template slot-scope="scope">{{scope.row.url|subDomain}}</template>
      </el-table-column>
      <el-table-column label="是否上首页">
        <template slot-scope="scope">
          <p v-if="scope.row.is_new == 1">是</p>
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
        <el-form-item label="标题：">
          <el-input v-model="form.title"></el-input>
        </el-form-item>
        <el-form-item label="是否上首页：">
          <el-select v-model="form.is_new" class="adv">
            <el-option label="是" :value="1"></el-option>
            <el-option label="否" :value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="目标页面：">
          <el-input v-model="form.url"></el-input>
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
        title: "",
        is_new: "",
        url: "",
        pic: ""
      },
      url: this.$store.getters.getDomain + "api/savePic",
      multipleSelection: [],
      search: ""
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
        url: this.$store.getters.getDomain + "api/admin/advertList",
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
          this.$message.error("获取促销栏目失败");
        }
      });
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
        title: val.title,
        is_new: val.is_new,
        url: val.url,
        pic: val.pic
      };
      this.form.id = val.advert_id;
    },
    confirm() {
      this.dialogVisible = false;
      let data = {
        token: this.$store.getters.getToken,
        title: this.form.title,
        is_new: this.form.is_new,
        url: this.form.url,
        pic: this.form.pic
      };
      if (this.title == "编辑") {
        data.id = this.form.id;
      }
      this.request(data, "/api/admin/advertAddModify");
    },
    ban(val) {
      let data = {
        token: this.$store.getters.getToken,
        id: val.advert_id
      };
      this.request(data, "/api/admin/advertBan");
    },
    selectionChange(val) {
      this.multipleSelection = val;
    },
    deleteAll() {
      this.multipleSelection.forEach(element => {
        let data = {
          token: this.$store.getters.getToken,
          id: element.advert_id
        };
        this.request(data, "/api/admin/advertDelete");
      });
    },
    dele(val) {
      let data = {
        token: this.$store.getters.getToken,
        id: val.advert_id
      };
      this.request(data, "/api/admin/advertDelete");
    },
    add() {
      this.dialogVisible = true;
      this.title = "添加";
      this.form = {
        title: "",
        is_new: "",
        url: "",
        pic: ""
      };
    },
    sort() {
      this.$refs.table.sort("title", "ascending");
    }
  },
  mounted() {
    this.getList(this.index.toString(), this.size.toString());
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
</style>