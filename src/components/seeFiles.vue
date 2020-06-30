<template>
  <div>
      <iframe :src="url" frameborder="0"></iframe>
  </div>
</template>

<script>
export default {
    name: 'seeFiles',
    data(){
        return{
            url:this.$route.query.url
        }
    }
}
</script>

<style lang="less">
iframe{
    width: 100vw;
    height:100vh;
}
</style>
