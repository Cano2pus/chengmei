<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

body, h1, h2, ul, li, p {
  list-style-type: none;
  padding: 0;
  margin: 0;
  font-weight: normal;
}

a {
  color: #2c3e50;
  text-decoration: none;
}
a:hover{
  color: #42b983;
}

.wrap{
  max-width: 1200px;
  margin: 0 auto;
}
.clearfix::after{
  content: "";
  display: block;
  clear: both;
}
</style>
