<template>
    <div class="mainWindow">
    <FullCalendar :key="nRender" ref="fullCalendar" :options="calendarOptions" />
    </div>
</template>

<script lang="ts">
import'@fullcalendar/core/vdom';
import FullCalendar from '@fullcalendar/vue3';
import dayGridPlugin from '@fullcalendar/daygrid';

import bus from '../bus';
import {NoteStruct} from '../NoteStruct';
import { Options, Vue } from 'vue-class-component';
import {Database} from '../database';


@Options({
    components:{
       FullCalendar, 
       dayGridPlugin     
    }
})


export default class CalendarPage extends Vue {
  nRender = 0;
  isCalendar = false;
  calendarOptions = {
        plugins: [ dayGridPlugin],
        initialView: 'dayGridMonth',
        weekends: false // initial value
  }

  mounted() {
    bus.on('load_full_calendar',() => {
      this.reRenderCalender();  
    })
  }

  public reRenderCalender(){
    this.nRender += 1;
  }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.mainWindow{
    height: 550px;
    width: 850px;

}

.calendar-view{
  float: right;
  position: absolute;
  /* bottom: 665px; */
}


</style>
