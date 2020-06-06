<template>
  <div class="hello" :style="style">
    <div class="login">
      <p>Login</p>
      <el-input placeholder="请输入账号" prefix-icon="el-icon-user" v-model="account"></el-input>
      <el-input placeholder="请输入密码" type="password" prefix-icon="el-icon-lock" v-model="pw"></el-input>
      <el-button type="primary" @click="login" class="loginbtn">登录</el-button>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  data() {
    return {
      account: "",
      pw: "",
      style: {
        height: `${document.documentElement.clientHeight}px`,
        background: 'url("' + require("@/assets/bg.jpeg") + '") no-repeat',
        backgroundSize: "cover"
      }
    };
  },
  methods:{
    login(){
      axios({
        method: "POST",
        url: this.$store.getters.getDomain + "api/admin/login",
        data: {
          name: this.account,
          pw: this.pw
        }
      }).then( res => {
        console.log(res);
        
          sessionStorage.setItem("token", res.data.data.token);
          sessionStorage.setItem("logined", res.data.data.admin_name);
          this.$store.commit("setToken", res.data.data.token);
          this.$router.push({name: 'index'});
      })
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.hello{
  display: flex;
  justify-content: center;
  align-items: center;
}
.login{
  width: 20%;
  display: flex;
  flex-direction: column;
  border: 1px solid #eee;
  padding: 30px;
  border-radius: 4px;
  background-color: rgba(255,255,255,.05);
}
.login p{
  color: white;
  font-size: 40px;
  text-align: center;
}
.login .el-input{
  margin: 15px 0;
}
</style>
