<template>
  <div>
    <div class="navbar" :style="style">
      <p class="navbar-header">诚美商贸后台</p>
      <el-menu
        background-color="#2d3e4e"
        :default-active="$router.path"
        text-color="#fff"
        router
        :unique-opened="true"
        active-text-color="#5ccec6"
        ref="elmenu"
      >
        <template>
          <el-input placeholder="搜索菜单" suffix-icon="el-icon-search" v-model="search" class="search"></el-input>
        </template>
        <el-col v-for="(item, index) in searched" :key="index">
          <template v-if="item.hasOwnProperty('submenu')">
            <el-submenu :index="String(index)">
              <template slot="title">
                <i :class="item.icon"></i>
                <span>{{item.name}}</span>
              </template>
              <el-menu-item
                v-for="(item2, index2) in item.submenu"
                :key="index2"
                :index="item2.path"
                @click="setCrumbs(item2)"
              >
                <i :class="item2.icon"></i>
                <span>{{item2.name}}</span>
              </el-menu-item>
            </el-submenu>
          </template>
          <template v-else>
            <el-menu-item @click="setCrumbs(item)" :index="item.path">
              <i :class="item.icon"></i>
              <span>{{item.name}}</span>
            </el-menu-item>
          </template>
        </el-col>
      </el-menu>
    </div>
    <div class="main" :style="style">
      <div class="fix">
        <div class="main-top">
          <div class="main-top-left">
            <span class="iconfont icon-mianbaoxie"></span>
            <ul class="crumbs">
              <li v-for="(crumb, crumbIndex) in crumbs" :key="crumbIndex">
                <router-link :to="{path: crumb.path}">
                  <i :class="crumb.icon"></i>
                  {{crumb.name}}
                </router-link>
              </li>
            </ul>
          </div>
          <div class="currentName">
            <p>
              你好 {{name}}
              <i @click="logout">注销</i>
            </p>
          </div>
        </div>
      </div>
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      name: "",
      style: {
        height: `${document.documentElement.clientHeight}px`
      },
      search: "",
      menu: [
        {
          name: "商品列表",
          icon: "iconfont icon-shangpin",
          submenu: [
            {
              name: "商品上架",
              icon: "iconfont icon-renwu",
              path: "/index/goods"
            },
            {
              name: "商品分类",
              icon: "iconfont icon-leimupinleifenleileibie",
              path: "/index/goods_list"
            }
          ]
        },
        { name: "banner", icon: "iconfont icon-banner", path: "/index/banner" },
        {
          name: "促销",
          icon: "iconfont icon-market",
          submenu: [
            {
              name: "促销栏目",
              icon: "iconfont icon-lanmu",
              path: "/index/promotColumn"
            },
            {
              name: "促销列表",
              icon: "iconfont icon-list",
              path: "/index/promotlist"
            }
          ]
        },
        {
          name: "用户管理",
          icon: "iconfont icon-yonghu",
          submenu: [
            {
              name: "用户信息",
              icon: "iconfont icon-yonghu",
              path: "/index/users"
            }
          ]
        },
        {
          name: "订单管理",
          icon: "iconfont icon-yonghu",
          submenu: [
            {
              name: "订单信息",
              icon: "iconfont icon-yonghu",
              path: "/index/order"
            }
          ]
        },
        {
          name: "账号管理",
          icon: "iconfont icon-admin",
          submenu: [
            {
              name: "后台管理账号",
              icon: "iconfont icon-admin",
              path: "/index/account"
            }
          ]
        },
        {
          name: "关于我们",
          icon: "iconfont icon-aboutus",
          path: "/index/about"
        },
        { name: "广告", icon: "iconfont icon-guanggao", path: "/index/adv" }
      ],
      searched: [], // 搜索结果
      crumbs: []
    };
  },
  methods: {
    handleOpen(list) {
      for (let i = 0; i < list.length; i++) {
        if (list[i].hasOwnProperty("submenu")) {
          this.$refs.elmenu.open(i);
        }
      }
    },
    handleClose() {
      this.$refs.elmenu.close(0);
    },
    setCrumbs(value) {
      for (let i = 0; i < this.crumbs.length; i++) {
        if (this.crumbs[i].name == value.name) {
          this.crumbs.splice(i, 1);
        }
      }
      this.crumbs.push(value);
    },
    logout() {
      this.$router.push({ name: "login" });
      sessionStorage.setItem("logined", "");
      sessionStorage.setItem("token", "");
    }
  },
  watch: {
    search: function(value) {
      var reg = new RegExp(value);
      if (value == "") {
        this.searched = this.menu;
        this.handleClose();
      } else {
        this.searched = [];
        // 搜索一级导航
        for (let i = 0; i < this.menu.length; i++) {
          if (this.menu[i].name.match(reg)) {
            this.searched.push(this.menu[i]);
          }
        }

        // 搜索二级导航
        if (this.searched.length == 0) {
          for (let i = 0; i < this.menu.length; i++) {
            if (this.menu[i].hasOwnProperty("submenu")) {
              for (let j = 0; j < this.menu[i].submenu.length; j++) {
                if (this.menu[i].submenu[j].name.match(reg)) {
                  this.searched.push(this.menu[i].submenu[j]);
                }
              }
            }
          }
        }

        this.handleOpen(this.searched);
      }
    }
  },
  mounted() {
    this.name = sessionStorage.getItem("logined");
    this.searched = this.menu;
  }
};
</script>

<style>
.logo {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  margin-right: 20px;
}
.navbar {
  text-align: left;
  width: 220px;
  background-color: #2d3e4e;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  z-index: 200;
}
.currentName {
  display: inline-block;
  vertical-align: top;
  margin-left: 20px;
  min-width: 170px;
}
.currentName p {
  color: white;
  line-height: 1.6;
  line-height: 49px;
}
.currentName i {
  margin-left: 10px;
  font-style: normal;
  cursor: pointer;
}

.el-menu {
  border: 0;
  padding: 10px;
  box-sizing: border-box;
}
.el-menu-item i {
  color: white;
  margin-right: 10px;
}
.search {
  margin: 20px 0;
}
.search input {
  background-color: rgba(255, 255, 255, 0.2);
  border: 0;
  color: white;
}
.el-submenu__title i {
  color: white;
  margin-right: 10px;
}
.navbar-header {
  color: white;
  text-align: center;
  background-color: #2d3e4e;
  border-bottom: 1px solid #465a78;
  font-size: 22px;
  padding: 10px 0;
}
.main {
  text-align: left;
  margin-left: 220px;
  background-color: #fff;
}
.fix{
  height: 50px;
}
.main-top {
  background-color: #5ccec6;
  height: 50px;
  display: flex;
  justify-content: space-between;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
}
.navbar-header {
  background-color: #5ccec6;
}
.main-top-left {
  display: flex;
  align-items: center;
  height: 100%;
  /* padding-left: 10px; */
}
.main-top span {
  color: white;
  font-size: 18px;
}
.crumbs {
  display: inline-block;
  margin-left: 220px;
  height: 100%;
}
.crumbs i {
  margin-right: 3px;
}
.crumbs li {
  display: inline-block;
  height: 100%;
}
.crumbs a {
  display: block;
  padding: 0 10px;
  color: white;
  height: 100%;
  line-height: 49px;
  font-size: 13px;
}
.crumbs a.router-link-active {
  background-color: #4dafa8;
}

.content {
  padding: 20px;
}
.content-top {
  margin-bottom: 10px;
}
.el-pagination {
  text-align: right;
  margin-top: 20px;
}
.el-pagination::after {
  clear: none;
}
.el-dialog__header {
  background-color: #545c64;
  height: 22px;
}
.el-dialog__title,
.el-dialog__headerbtn .el-dialog__close {
  color: white;
}
.el-form-item__label {
  float: none;
  text-align: left;
}
.adv.el-select {
  width: 100%;
}
.disinb {
  display: inline-block;
  width: 49%;
}
</style>