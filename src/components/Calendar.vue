<template>
    <el-calendar class="calendar-body" v-model="currentDate"></el-calendar>
</template>

<script lang="ts">
import {NoteStruct} from '../NoteStruct';
import { Options, Vue } from 'vue-class-component';
import {Database} from '../database';
import bus from '../bus'
import { ElMessage } from 'element-plus';

import { CircleCheckFilled,CaretBottom,PriceTag,Timer,Notebook, NoSmoking} from '@element-plus/icons'


export default class Calendar extends Vue {
  currentDate = new Date();

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.mainWindow{
    height: 665px;
    width: 100%;
    bottom: 6px;
}
.calendar-body{
    height: 100px;
    width: 100%;  
    resize: vertical;
}

</style>
