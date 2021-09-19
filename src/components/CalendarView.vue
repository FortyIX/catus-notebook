<template>
<div class="mainPage">
  <div class="mainWindow">
    <div class="calendar-view">
    <Calendar />
    </div>
  </div>    
</div> 
</template>

<script lang="ts">
import {NoteStruct} from '../NoteStruct';
import { Options, Vue } from 'vue-class-component';
import {Database} from '../database';
import bus from '../bus'
import { ElMessage } from 'element-plus';
import Calendar from './Calendar.vue';
import { CircleCheckFilled,CaretBottom,PriceTag,Timer,Notebook, NoSmoking} from '@element-plus/icons'

@Options({
    components:{
       Calendar      
    }
})




export default class CalendarPage extends Vue {

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.mainWindow{
    height: 665px;
    width: 100%;
    bottom: 6px;
}

.calendar-view{
  float: right;
  position: absolute;
  /* bottom: 665px; */
}


</style>
