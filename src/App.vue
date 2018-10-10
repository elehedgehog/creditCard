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
* {
  margin: 0;
  padding: 0;
}
html, body {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  /* min-height: 100%; */
  height: 100%;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  width: 100%;
  height: 100%;

}
.loading-layer {
  display: flex;
  justify-content: center;
}
</style>
