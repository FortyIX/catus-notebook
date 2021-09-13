<template>
<div class="mainPage">
  <div class="mainWindow">
      <div class="note-display-area">
          <el-scrollbar height="600px" class="note-container">

            <Note v-for="li in listOfNotes" :key="li.id" :contents="li.content" :tag="li.tag" :notebook="li.notebook" :date="li.date" :isdone="li.isdone"/>  
            
          </el-scrollbar>
 
      </div>

      <el-dialog v-model="newNotePromptVisible" center>
        <el-form :model="form" label-position="left" label-width="120px">
 
            <el-form-item label="Activity time" hidden>
              <el-date-picker
                      v-model="noteOnEdit.date"
                      type="datetime"
                      placeholder="Select date and time"
                      :shortcuts="shortcuts"
                      size="large"
                      disabled="true"
                      
                    >
              </el-date-picker>
          </el-form-item>
          <el-form-item label="What to note" :label-width="formLabelWidth">
            <el-input type="textarea" v-model="noteOnEdit.content" autocomplete="off"></el-input>
          </el-form-item>

        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <!-- <el-button @click="newNotePromptVisible = false">Cancel</el-button>
            <el-button type="primary" @click="newNotePromptVisible = false"
              >Confirm</el-button
            > -->
            <el-icon style="width: 2em; height: 2em; margin-right: 5px;" @click="testRes"><circle-check-filled /></el-icon>
            <el-popover placement="bottom" :width="400" trigger="click">
            <template #reference>
                <el-icon style="width: 2em; height: 2em; margin-right: 5px;"><price-tag /></el-icon>
            </template>
            <el-tag type="success">Tag 2</el-tag> <el-tag type="success">Tag 2</el-tag>     
          </el-popover>
          <el-icon style="width: 2em; height: 2em; margin-right: 5px;"><timer/></el-icon>
  
          </span>
        </template>
      </el-dialog>

      <div class="note-timeline-area"></div>
  </div>
</div> 
</template>

<script lang="ts">
import {NoteStruct} from '../NoteStruct';
import { Options, Vue } from 'vue-class-component';
import {Database} from '../database';
import bus from '../bus'
import Note from './Note.vue';
import { CircleCheckFilled,CaretBottom,PriceTag,Timer} from '@element-plus/icons'


@Options({
    components:{
      Note,
      CircleCheckFilled,
      CaretBottom,
      PriceTag,
      Timer
    }
})




export default class MainPage extends Vue {

  newNotePromptVisible = false;
  listOfNotes: Array<NoteStruct> = [];
  tagsFinder? : any;


  db! : Database;
  noteOnEdit = {
    content : '',
    tag:'',
    notebook:'',
    date:1000000,
    isDone:0
  };
  shortcuts = [
          {
            text: 'Today',
            value: new Date(),
          },
          {
            text: 'Yesterday',
            value: () => {
              const date = new Date()
              date.setTime(date.getTime() - 3600 * 1000 * 24)
              return date
            },
          },
          {
            text: 'A week ago',
            value: () => {
              const date = new Date()
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7)
              return date
            },
          },
        ];

  mounted(){

     bus.on('add-note-event',(data) => {
      this.newNotePromptVisible = true;
      //this.addNote();
     }) 

     this.db = new Database();
    //  this.addTag(1,'first');
     this.fetchData(this.db);
     

  }

  public addNote() : void {
       var time = new Date();
       var newEntry = new NoteStruct("This is a test message for testing the performance of the note","first day-second day-third class", "default notebook-my notebook", time.getTime(),1)
       this.listOfNotes.push(newEntry);
       
       //add note contents and date to the note storage 
       this.db.notes.add({content: newEntry.content,tag:newEntry.tag, notebook: newEntry.notebook, date: newEntry.date, isdone:newEntry.isdone},).then(() => {
          //success
       }).catch(e => {
           console.log(e);
       });    

  }


  public addTag(id:number,tag:string) : void {
      //bula
  }

  public fetchData(db: Database) : void{


     var noteData = db.notes.toArray().then(notes => {
        notes.forEach(note => {
          this.listOfNotes.push(new NoteStruct(
            note.content,note.tag, note.notebook,note.date,note.isdone
          ));
        }
        )
     });
    
  }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.mainWindow{
    height: 655px;
    width: 100%;
    background: green;
}

.note-display-area{
  position: relative;
  height: 655px;
  width: 600px;
  background:white;
}

.note-timeline-area{
  position: relative;
  height: 655px;
  width: 310px;
  bottom: 655px;
  left: 600px;
  background: yellow;

}

.notes{
  width: 600px;
  position: relative;
  right:-30px;
}

.note-container{
  width: 600px;
  position: relative;
  bottom: 650px;
}

.notes-text{
  font-size: 13px;

}

.note-opt{
  width: inherit;
  height: 10px;
}

.note-taker{
  position: relative;
  bottom: 650px;
}



</style>
