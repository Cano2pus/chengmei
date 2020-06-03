<template>
  <div class="content">
    <el-form :model="form">
      <el-form-item label="商品类别：" class="disinline">
        <el-select v-model="form.type_parent_id" placeholder="请选择">
          <el-option
            v-for="item in type"
            :key="item.good_type_id"
            :label="item.type_name"
            :value="item.good_type_id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="商品种类：" class="disinline">
        <el-select v-model="form.type_id" placeholder="请选择">
          <el-option
            v-for="item in type2"
            :key="item.good_type_id"
            :label="item.type_name"
            :value="item.good_type_id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="商品价格：" class="disinline">
        <el-input v-model="form.price"></el-input>
      </el-form-item>
      <el-form-item label="商品库存：" class="disinline">
        <el-input v-model="form.count"></el-input>
      </el-form-item>
      <el-form-item label="热卖商品：">
        <!-- <el-input v-model="form.is_new"></el-input> -->
        <el-select v-model="form.is_new" placeholder="请选择">
          <el-option label="是" :value="1"></el-option>
          <el-option label="否" :value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="商品颜色：">
        <el-input v-model="form.colour"></el-input>
      </el-form-item>
      <el-form-item label="商品种类：">
        <el-input v-model="form.edition"></el-input>
      </el-form-item>
      <el-form-item label="商品封面：">
        <template>
          <el-upload
            class="pic"
            :action="url"
            :show-file-list="false"
            :before-upload="beforeAvatarUpload"
            :on-success="handleAvatarSuccess"
            multiple
            name="img"
          >
            <img v-if="form.img" :src="form.img" alt />
            <i v-else class="el-icon-plus pic-uploader-icon"></i>
          </el-upload>
        </template>
      </el-form-item>
      <el-form-item label="商品图集：">
        <template>
          <el-upload
            class="pic"
            :action="url"
            :show-file-list="false"
            :before-upload="beforeAvatarUpload"
            :on-success="handleAvatarSuccess"
            multiple
            name="img"
          >
            <img v-if="form.img" :src="form.img" alt />
            <i v-else class="el-icon-plus pic-uploader-icon"></i>
          </el-upload>
        </template>
      </el-form-item>
      <el-form-item label="详情：">
          <mavon-editor ref="md" v-model="context" :toolBar="toolBar" @change="change" @imgAdd="imgadd"></mavon-editor>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import axios from "axios";
export default {
  data() {
    return {
      form: {},
      url: this.$store.getters.getDomain + "api/savePic",
      type: [],
      context: "",
      toolBar: {
        bold: true, // 粗体
        italic: true, // 斜体
        header: true, // 标题
        underline: true, // 下划线
        mark: true, // 标记
        superscript: true, // 上角标
        quote: true, // 引用
        ol: true, // 有序列表
        link: true, // 链接
        imagelink: true, // 图片链接
        help: true, // 帮助
        code: true, // code
        subfield: true, // 是否需要分栏
        fullscreen: true, // 全屏编辑
        readmodel: true, // 沉浸式阅读
        /* 1.3.5 */
        undo: true, // 上一步
        trash: true, // 清空
        save: true, // 保存（触发events中的save事件）
        /* 1.4.2 */
        navigation: true // 导航目录
      },
      html: ""
    };
  },
  computed: {
    type2: function() {
      return this.type.filter(item => {
        return item.good_type_id == this.form.type_parent_id;
      })[0].children;
    }
  },
  methods: {
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
    change(value, render) {
      this.html = render;
    },
    imgadd(pos, $file) {
      let formData = new FormData();
      formData.append("img", $file);
      axios({
        method: "post",
        url: "http://api_dev.wanxikeji.cn/api/savePic",
        headers: { "Content-Type": "multipart/form-data" },
        data: formData
      }).then(res => {
        let contextHistory = this.$refs.md.$data.d_history;
        this.context =
          contextHistory[contextHistory.length - 1] +
          `<img src="http://api_dev.wanxikeji.cn/${res.data.data}" style="max-width: 100%">`;
      });
    },
    handleAvatarSuccess(res, file) {
      if (res.code == 2000) {
        this.form.img = this.$store.getters.getDomain + res.data;
      } else {
        this.$message.error("图片上传失败");
      }
    },
    handleType(list, id) {
      let back = [];
      for (let i = 0; i < list.length; i++) {
        if (list[i].parent_id == id) {
          list[i].children = this.handleType(list, list[i].good_type_id);
          back.push(list[i]);
        }
      }
      return back;
    }
  },
  mounted() {
    this.form = this.$route.params;
    if (JSON.stringify(this.form) == "{}") {
      this.$router.push({ name: "goods" });
    }

    axios({
      method: "post",
      url: this.$store.getters.getDomain + "api/admin/goodsTypeList",
      data: {
        token: this.$store.getters.getToken
      }
    }).then(res => {
      this.type = this.handleType(res.data.data, 0);
    });
  }
};
</script>
<style>
.el-select {
  width: 100%;
}
.el-form {
  border: 1px solid #eee;
  border-radius: 6px;
  padding: 20px;
  box-shadow: 0 0 8px 4px rgba(7, 17, 27, 0.1);
}
.disinline {
  width: 49%;
  display: inline-block;
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

.el-form-item::after,
.el-form-item__content::after {
  display: none;
}
</style>