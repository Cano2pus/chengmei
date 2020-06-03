<template>
  <div class="content">
    <mavon-editor ref="md" v-model="context" :toolBar="toolBar" @change="change" @imgAdd="imgadd"></mavon-editor>
    <el-button type="primary" class="submit" @click="submit">提交</el-button>
  </div>
</template>
<script>
import axios from "axios";
export default {
  data() {
    return {
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
  methods: {
    change(value, render) {
      this.html = render;
    },
    submit() {
      axios({
        method: "post",
        url: this.$store.getters.getDomain + "/api/admin/aboutUsAddModify",
        data: {
          token: this.$store.getters.getToken,
          info: this.html,
        }
      }).then(res => {
        if (res.data.code == 2000) {
          this.$message.success("修改成功");
        } else {
          this.$message.error(res.data.msg);
        }
      });
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
    }
  },
  mounted() {
    axios({
      method: "post",
      url: this.$store.getters.getDomain + "/api/admin/aboutUs",
      data: {
        token: this.$store.getters.getToken,
      }
    }).then(res => {
      if (res.data.code == 2000) {
        this.context = res.data.data.info;
      } else {
        this.$message.error(res.data.msg);
      }
    });
  }
};
</script>
<style>
.submit {
  margin-top: 20px;
}
</style>