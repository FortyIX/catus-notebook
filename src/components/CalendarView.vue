<template>
    <div class="mainWindow">
    <FullCalendar :key="nRender" ref="calendarView" :options="calendarOptions" />
    </div>
</template>

<script lang="ts">
import'@fullcalendar/core/vdom';
import FullCalendar, { DateSelectArg } from '@fullcalendar/vue3';
import dayGridPlugin from '@fullcalendar/daygrid';
import listPlugin from '@fullcalendar/list'; 
import interactionPlugin from '@fullcalendar/interaction'; 

import bus from '../bus';
import {CardStruct} from '../dataStructs/CardStruct';
import { Options, Vue } from 'vue-class-component';
import {ref} from "vue";
import {Database} from '../databases/database';


@Options({
    components:{
       FullCalendar, 
       dayGridPlugin,
       listPlugin,
       interactionPlugin     
    }
})


export default class CalendarPage extends Vue {
  //rendering variable 
  nRender = 0;

  //database connector 
  db! : Database;

  //options for the calendar 
  calendarOptions = {
        plugins: [ dayGridPlugin,listPlugin,interactionPlugin],
        locale:'en',
        selectable: true,
        initialView: 'dayGridMonth',
        weekends: true, // initial value,
        dayMaxEventRows: true,
        events: [{
          title:'',
          start: ''
        }],
        dateClick:(info:any) =>{
          this.handleClickedDateEvent(info);
        }
  }


  mounted() {
    
    //connect to the database and obtain all note
    this.db = new Database();
    this.getNoteData(this.db);
    
    /**
     * Listener for the event that load the calendar 
     */
    bus.on('load_full_calendar',() => {
      this.getNoteData(this.db);      
    });

    /**
     * Listener for the event that update the calendar language 
     */
    bus.on('update_language_calendar', (lan) => {
      if (lan == 'cn'){
        this.calendarOptions.locale = "zh-cn";
        this.reRenderCalender();
      }
      else{
        this.calendarOptions.locale = "en";
        this.reRenderCalender();        
      }
    })
  }

  /**
   * rerender the calendar to update 
   */
  public reRenderCalender(){
    this.nRender += 1;
  }

  /**
   * get the note data from the database 
   * @param db The database connector 
   */
  public getNoteData(db : Database){

    this.calendarOptions.events = [];
    db.card.toArray().then(notes => {
      notes.forEach(note => {
        //fetch the date 
        var rawTime = note.date;
        if(rawTime != -1){
          var time = new Date(rawTime);

          //add to the calendar as a new event 
          this.calendarOptions.events.push({
            title : note.reminderMsg,
            start : this.parseTime(time)
          })
        }
      });

      this.reRenderCalender();
    })
  }

  /**
   * Helper function that convert the date format stored in database to the one accepted by the calendar 
   * @param time The date to be converted 
   */
  public parseTime(time : Date) : string {
    
    return `${time.getFullYear()}-`+
    `${String(time.getMonth() + 1).length == 1 ? '0' + String(time.getMonth() + 1) : String(time.getMonth() + 1)}-`+
    `${time.getDate().toString().length == 1 ? '0' + time.getDate().toString() : time.getDate().toString()}T`+
    `${time.getHours().toString().length == 1 ? '0' + time.getHours().toString() : time.getHours().toString()}:`+
    `${time.getMinutes().toString().length == 1 ? '0' + time.getMinutes().toString() : time.getMinutes().toString()}:`+
    `${time.getSeconds().toString().length == 1 ? '0' + time.getSeconds().toString() : time.getSeconds().toString()}`;
  }

  /**
   * Handler for each date click event
   * @param ClickedDate the date clicked  
   */
  public handleClickedDateEvent(ClickedDate : any) : void {
     var calAPi = ClickedDate.view.calendar;
    //alert(ClickedDate.dateStr); 
    calAPi.changeView('listDay',ClickedDate.dateStr)
  }

}
</script>

<style>
.fc .fc-button-primary:disabled {
    color: #fff;
    color: var(--fc-button-text-color, #fff);
    background-color: #2C3E50;
    background-color: #65c294;
    border-color: #65c294;
    border-color: #65c294;
}
.fc .fc-button-primary{
    background-color: #2C3E50;
    background-color: #65c294;
    border-color: #65c294;
    border-color: #65c294;
}

</style>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.mainWindow{
    height: 70%;
    width: 860px;

}

.calendar-view{
  float: right;
  position: absolute;
  /* bottom: 665px; */
}


</style>
