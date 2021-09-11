<template>
  <div class="mainFrame">
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';

export default class Frame extends Vue {
  msg!: string

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.mainFrame{
    height: 600px;
    width: 100%;
    background: green;
}
</style>
