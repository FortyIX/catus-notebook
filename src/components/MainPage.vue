<template>
<div class="mainPage">
  <div class="mainWindow">
      <div class="note-display-area">
          <div v-if="isEmpty" class="welcome"> 
            <div class="welcome-content">  
              <img src="../assets/logo_transparent.png" style="opacity:0.5;" height="180" width="180">
              <p style="color:grey; opacity:0.5;">{{$t('welcomePage.message1')}} <el-icon style="width: 10px; height: 10px; margin-right: 10px; color:grey; position:relative; top:5px;"   :size="20"><expand/></el-icon> {{$t('welcomePage.message2')}}</p>
            </div>
          </div>
          
          <el-scrollbar height="680px" width="800px" class="note-container">
            <Note  v-for="li in listOfNotes" :key="li.id" :contents="li.content" :tag="li.tag" :notebook="li.notebook" :date="li.date" :isdone="li.isdone" :id="li.id"/>  
          </el-scrollbar>
 
      </div>
      <!-- <div class="note-timeline-area"></div> -->
  </div>
</div> 
</template>

<script lang="ts">
import {NoteStruct} from '../dataStructs/NoteStruct';
import { Options, Vue } from 'vue-class-component';
import {Database} from '../databases/database';
import bus from '../bus'
import Note from './Note.vue';
import { ElMessage } from 'element-plus';

import { CircleCheckFilled,CaretBottom,PriceTag,Timer,Notebook, Expand} from '@element-plus/icons'


@Options({

    //filter for displaying notes
    props: {
      noteFilter : String
    },

    //load components
    components:{
      Note,
      CircleCheckFilled,
      CaretBottom,
      PriceTag,
      Expand,
      Timer,
      Notebook
    }
})




export default class MainPage extends Vue {

  //props
  noteFilter! : string;

  //Switches for the logo 
  isEmpty = true;
  isArchiveEmpty = false;
  
  //holder of all notes
  listOfNotes: Array<NoteStruct> = [];
  
  //variables for tag addition
  isAddingNewTag = false;
  newTagData = '';

  //database connector 
  db! : Database;

  //storage for the note editor 
  noteOnEdit = {
    content : '',
    tag:'',
    notebook:'',
    date:1000000,
    isDone:0
  };


  mounted(){
     
     //connect to database and fetch unarchived notes
     this.db = new Database();
     this.fetchDataWithFilter(this.db,this.noteFilter);  
    
    //Listener for the event that add a new note 
    bus.on('add-note-event',() => {
      console.log("add one")
      this.addNote();
     });
    
    //Listener for the event that remove a note on UI 
    bus.on('reload_notes_with_removed_note', (id) => {

        //init the location of the to be removed note
        var tobeRemovedIndex = 0;
        var counter = 0;
        
        //find the note locally 
        this.listOfNotes.forEach(notestruct => {
        if(notestruct.id?.toString() == String(id)){
          tobeRemovedIndex = counter;
        }
        else{
          counter += 1;
        } 
        })

        //remove that note from the storage
        this.listOfNotes.splice(tobeRemovedIndex,1);

        //check if there is note left
        if(this.listOfNotes.length == 0){
          this.isEmpty = true;
        }         

      });

    //Listener for the event that undo a archived note on UI 
    bus.on('reload_notes_with_undo_note', (id)=> {
        this.listOfNotes = [];

        //just refresh the page with archived notes
        this.fetchDataWithFilter(this.db,"archive?bula");

    });

    //listener for reloading all notes
    bus.on('reload_all_notes', () => {
      this.fetchDataWithFilter(this.db,"bulabula");
    })
    
    //Listener for event that filter notes by tag
    bus.on('filter-tag', (tagName) => { 
      this.fetchDataWithFilter(this.db,"tag?"+tagName);
    });

    //Listener for event that filter notes notebook
    bus.on('filter-notebook', (notebookName) => { 
      this.fetchDataWithFilter(this.db,"notebook?"+notebookName);
    });

    //listener for event that remove all archived notes
    bus.on('remove-all-archived-notes', () => {
      this.removeAllArchivedNotes();
    })

  }

  /**
   * Add a new note 
   */
  public addNote() : void {

       if(this.isEmpty){
         this.isEmpty = false;
       } 

       var time = -1;
       var newEntry = new NoteStruct("New note added, click the edit button below to start editing","", "", time,"",0)
       
       
       //add note contents and date to the note storage (update ui first)
       this.db.notes.add({content: newEntry.content,tag:newEntry.tag, notebook: newEntry.notebook, date: newEntry.date, reminderMsg:newEntry.reminderMsg,isdone:newEntry.isdone},).then(() => {
         //and and the latest note to the user interface by retriving the last added note from the database.
         this.db.notes.orderBy("id").reverse().limit(1).toArray().then((newEntry) => {
           this.listOfNotes.push(new NoteStruct(
            newEntry[0].content,newEntry[0].tag, newEntry[0].notebook,newEntry[0].date,newEntry[0].reminderMsg,newEntry[0].isdone,newEntry[0].id
          ))
         })
       }).catch(e => {
           console.log(e);
       });    

  }

  /**
   * Fetch unarchived notes 
   * @param db The database connector 
   */
  public fetchUnarchivedNotes(db: Database) : void{

     var noteData = db.notes.where('isdone').equals(0).toArray().then(notes => {
        notes.forEach(note => {
          this.listOfNotes.push(new NoteStruct(
            note.content,note.tag, note.notebook,note.date,note.reminderMsg,note.isdone,note.id
          ));
        }
        );
      if(this.listOfNotes.length > 0){
        this.isEmpty = false;
      }        
     });
  }
 
  /**
   * Fetch notes with a specfic filter
   * @param db The database connector 
   * @param filter the filter for notes
   */ 
  public fetchDataWithFilter(db:Database, filter:string) : void {
    
    //reset the ui 
    this.listOfNotes = [];


    var cmd: string;
    var param : string;
    
    if(filter != undefined){
      cmd = filter.split('?')[0];
      param = filter.split('?')[1];
    
      switch(cmd){
        case 'archive':
          this._fetchArchived(db);
          break;
      
        case 'tag':
          this._fetchNotesWithTag(db,param);
          break;

        case 'notebook':
          this._fetchNotesWithNotebook(db,param);
          break;

        default:
          this.fetchUnarchivedNotes(db);
          break;

      }
    }
    else{
      this.fetchUnarchivedNotes(db);
    }
  }


  /**
   * Fetch archived notes 
   * @param db The database connector 
   */
  private _fetchArchived(db: Database) : void{

     var noteData = db.notes.where('isdone').equals(1).toArray().then(notes => {
        notes.forEach(note => {
          this.listOfNotes.push(new NoteStruct(
            note.content,note.tag, note.notebook,note.date,note.reminderMsg,note.isdone,note.id
          ));
        }
        );
        this.isEmpty = false;
     });
  }

  /**
   * Fetch all notes with a specfic tag 
   * @param db The database connector 
   * @param tag the tag specfied 
   */
  private _fetchNotesWithTag(db: Database,tag:string) : void{

     var noteData = db.notes.filter((note) => {
       return note.tag.indexOf(tag) != -1 
     }).toArray().then(notes => {
        notes.forEach(note => {
          this.listOfNotes.push(new NoteStruct(
            note.content,note.tag, note.notebook,note.date,note.reminderMsg,note.isdone,note.id
          ));
        }
        );
      if(this.listOfNotes.length > 0){
        this.isEmpty = false;
      }        
     })
  }

  /**
   * Fetch all notes with a specfic notebook
   * @param db The database connector 
   * @param notebook the notebook specfied 
   */
  private _fetchNotesWithNotebook(db: Database,notebook:string) : void{

     var noteData = db.notes.filter((note) => {
       return note.notebook.indexOf(notebook) != -1 
     }).toArray().then(notes => {
        notes.forEach(note => {
          this.listOfNotes.push(new NoteStruct(
            note.content,note.tag, note.notebook,note.date,note.reminderMsg,note.isdone,note.id
          ));
        }
        );
      if(this.listOfNotes.length > 0){
        this.isEmpty = false;
      }
     })
  }

  /**
   * Remove all archived notes 
   */
  public removeAllArchivedNotes() : void {
    console.log("run")
    this.db.notes.where('isdone').equals(1).delete().then(()=> {
      this.fetchDataWithFilter(this.db,"archive?bula");
      ElMessage({
          showClose: true,
          message: 'All your archived notes have been deleteds',
          type: 'success',
        })
    })
  }


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

.note-display-area{
  height: 679px;
  width: 100%;
  position: relative;
  bottom: 6px;
  left:10px;
  background:white;
 
}

/* .note-timeline-area{
  position: relative;
  height: 655px;
  width: 310px;
  bottom: 655px;
  left: 600px;
  background: yellow;

} */

.notes{
  width: 150%;

}

.note-container{
  width: 100%;
  position: fixed;
  margin-top: 10px;
  overflow: hidden;
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

.add-new-tag-tag{
  width:70px;
  vertical-align: bottom;
}

.welcome{
  position: relative;
  top:150px;
  left:210px; ;
  height: 300px;
  width: 500px;
  background:white;
  /* #001B50; */
  opacity:1;
  border-radius: 20px;
}

.welcome-content{
  position: absolute;
  left:90px;
  top:40px;
}

.archive-empty{
  position: relative;
  top:180px;
}





</style>
