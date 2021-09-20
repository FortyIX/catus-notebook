<template>
    <div class="mainWindow">
    <FullCalendar :key="nRender" ref="fullCalendar" :options="calendarOptions" />
    </div>
</template>

<script lang="ts">
import'@fullcalendar/core/vdom';
import FullCalendar from '@fullcalendar/vue3';
import dayGridPlugin from '@fullcalendar/daygrid';
import listPlugin from '@fullcalendar/list'; 
import interactionPlugin from '@fullcalendar/interaction'; 

import bus from '../bus';
import {NoteStruct} from '../NoteStruct';
import { Options, Vue } from 'vue-class-component';
import {Database} from '../database';


@Options({
    components:{
       FullCalendar, 
       dayGridPlugin,
       listPlugin     
    }
})


export default class CalendarPage extends Vue {
  nRender = 0;
  isCalendar = false;
  db! : Database;
  calendarOptions = {
        plugins: [ dayGridPlugin,listPlugin],
        initialView: 'listDay',
        weekends: true, // initial value,
        dayMaxEventRows: true,
        events: [{
          title:'',
          start: ''
        }]
  }

  mounted() {

    this.db = new Database();
    this.getNoteData(this.db);

    bus.on('load_full_calendar',() => {
      this.getNoteData(this.db);      
    })
  }

  public reRenderCalender(){
    this.nRender += 1;
  }

  public getNoteData(db : Database){

    this.calendarOptions.events = [];
    db.notes.toArray().then(notes => {
      notes.forEach(note => {
        
        var rawTime = note.date;
        if(rawTime != -1){
          var time = new Date(rawTime);
          this.calendarOptions.events.push({
            title : note.reminderMsg,
            start : this.parseTime(time)
          })
        }
      });

      this.reRenderCalender();
    })
  }

  public parseTime(time : Date) : string {
    
    return `${time.getFullYear()}-`+
    `${String(time.getMonth() + 1).length == 1 ? '0' + String(time.getMonth() + 1) : String(time.getMonth() + 1)}-`+
    `${time.getDate().toString().length == 1 ? '0' + time.getDate().toString() : time.getDate().toString()}T`+
    `${time.getHours().toString().length == 1 ? '0' + time.getHours().toString() : time.getHours().toString()}:`+
    `${time.getMinutes().toString().length == 1 ? '0' + time.getMinutes().toString() : time.getMinutes().toString()}:`+
    `${time.getSeconds().toString().length == 1 ? '0' + time.getSeconds().toString() : time.getSeconds().toString()}`;
  }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.mainWindow{
    height: 70%;
    width: 850px;

}

.calendar-view{
  float: right;
  position: absolute;
  /* bottom: 665px; */
}


</style>
