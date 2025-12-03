<template>
  <header class="header">
    <div class="logo" @click="home"><img src="../assets/logo.png" width="35px">Meetify</div>
  </header>
</template>

<style>

  .header {
    width: 100%;
    height: 55px;
    background-color: var(--primary);
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px;
    border-bottom: 3px solid black;
  }

  .logo {
    font-size: var(--sub_h1);
    font-weight: 700;
    color: var(--text);
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 8px;
  }
</style>

<script>
export default {
  methods: {
    home() {
      this.$router.push({ 
        name: 'CreateEvent', 
      });
    }
  }
}
</script>