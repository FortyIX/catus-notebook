<template>
<div class="mainPage">
  <div class="mainWindow">
  </div>    
</div> 
</template>

<script lang="ts">
import {NoteStruct} from '../NoteStruct';
import { Options, Vue } from 'vue-class-component';
import {Database} from '../database';
import bus from '../bus'
import { ElMessage } from 'element-plus';

import { CircleCheckFilled,CaretBottom,PriceTag,Timer,Notebook, NoSmoking} from '@element-plus/icons'




export default class CanladerPage extends Vue {


}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.mainWindow{
    height: 665px;
    width: 100%;
    position: relative;
    bottom: 6px;
    background: white;
}


</style>
