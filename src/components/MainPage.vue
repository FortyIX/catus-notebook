<template>
  <div class="mainWindow">
      <div class="note-display-area">
          <el-scrollbar height="500px" class="note-container">

            <Note v-for="li in listOfNotes" :key="li" :contents="li.content"/>  
            
          </el-scrollbar>
 
      </div>
      <div class="note-timeline-area"></div>
  </div>
</template>

<script lang="ts">
import {NoteStruct} from '../NoteStruct';
import { Options, Vue } from 'vue-class-component';
import {Database} from '../database';
import bus from '../bus'
import Note from './Note.vue';


@Options({
    components:{
      Note
    }
})




export default class MainPage extends Vue {

  listOfNotes: Array<NoteStruct> = [];
  db! : Database;

  mounted(){

     bus.on('add-note-event',(data) => {
       this.addNote();
     }) 

     this.db = new Database();
     this.fetchData(this.db);

  }

  public addNote() : void {
       var time = new Date();
       var newEntry = new NoteStruct("This is a test message for testing the performance of the note","first day","default", time.getTime(),1)
       this.listOfNotes.push(newEntry);
       
       this.db.notes.add({content: newEntry.content, tag:newEntry.tag,notebook:newEntry.notebook, date: newEntry.date, isdone:newEntry.isdone},).then(() => {
          //success
       }).catch(e => {
           console.log(e)
       });    

  }

  public fetchData(db: Database) : void{
     var noteData = db.notes.toArray().then(notes => {
        notes.forEach(note => {
          this.listOfNotes.push(new NoteStruct(
            note.content,note.tag,note.notebook,note.date,note.isdone
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
    height: 610px;
    width: 100%;
    background: green;
}

.note-display-area{
  position: relative;
  height: 610px;
  width: 600px;
  background:white;
}

.note-timeline-area{
  position: relative;
  height: 610px;
  width: 300px;
  bottom: 610px;
  left: 600px;
  background: yellow;

}

.notes{
  width: 500px;
  position: relative;
  right:-30px;
}

.note-container{
  width: 600px;
  position: relative;
  bottom: 600px;
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
