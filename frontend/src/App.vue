<template>
  <div id="app">
    <Header />
    
    <router-view />
    
    </div>
</template>

<script>
import Header from './components/AppHeader.vue'

export default {
  name: 'App',
  components: {
    Header,
  }
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  background-color: white;
}

#app {
  background-color: white;
  min-height: 100vh;
}

router-view {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;

  display: flex;
  align-items: center;
  justify-content: center;
}
</style>