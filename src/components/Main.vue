<template>
  <div class="mainWindow">
      <h1> This is the main page</h1>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';





export default class Main extends Vue {
  msg!: string

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.mainWindow{
    height: 700px;
    width: 100%;
    background: green;
}
</style>
