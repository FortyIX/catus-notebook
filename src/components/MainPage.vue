<template>
<div class="mainPage">
  <div class="mainWindow">
      <div class="note-display-area">
          <div v-if="isEmpty" class="welcome"> 
            <div class="welcome-content">  
              <img src="../assets/logo_new_transparent.png" style="opacity:0.5;" height="180" width="180">
              <p style="color:grey; opacity:0.5;">{{$t('welcomePage.message1')}} <el-icon style="width: 10px; height: 10px; margin-right: 10px; color:grey; position:relative; top:5px;"   :size="20"><expand/></el-icon> {{$t('welcomePage.message2')}}</p>
            </div>
          </div>
          
          <el-scrollbar ref="scrollbar" height="680px" width="800px" class="note-container">
            <Card  v-for="li in listOfCards" :key="li.id" :contents="li.content" :submitDate="li.submitDate" :tag="li.tag" :notebook="li.notebook" :date="li.date" :isdone="li.isdone" :id="li.id" :cardType="li.cardType" :cardID="li.cardID"/>  
          </el-scrollbar>
 
      </div>
      <!-- <div class="note-timeline-area"></div> -->
  </div>
</div> 
</template>

<script lang="ts">
import {CardStruct} from '../dataStructs/CardStruct';
import { Options, Vue } from 'vue-class-component';
import {ref} from "vue"
import {Database} from '../databases/database';
import bus from '../bus'
import Card from './Card.vue'
import { ElMessage } from 'element-plus';

import { CircleCheckFilled,CaretBottom,PriceTag,Timer,Notebook, Expand} from '@element-plus/icons'


@Options({

    //filter for displaying notes
    props: {
      noteFilter : String
    },

    //load components
    components:{
      Card,
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
  listOfCards: Array<CardStruct> = [];

  //holder of all date of note creation (to avoid repeated data to be displayed)
  listOfDates: Array<string> = [];

  noteCountEachDay:any = {}

  //variables for tag addition
  isAddingNewTag = false;
  newTagData = '';


  //bottom of scroll bar 
  maxDepth = 0;
  scrollPos = 0;

  //database connector 
  db! : Database;


  mounted(){

     //connect to database and fetch unarchived notes
     this.db = new Database();
     this.fetchDataWithFilter(this.db,this.noteFilter);  
    
    


    //Listener for the event that add a new note 
    bus.on('add-note-event',() => {
      this.addNote();
     });
    
    //Listener for the event that remove a note on UI 
    bus.on('reload_notes_with_removed_note', (id) => {

        //init the location of the to be removed note
        var tobeRemovedIndex = 0;
        var counter = 0;
        
        //find the note locally 
        this.listOfCards.forEach(card => {
        if(card.id?.toString() == String(id)){
            tobeRemovedIndex = counter;
        }
        else{
          counter += 1;
        } 
        })

        //get the number of notes made on the date of the removed one (to decide whether to remove the date label)
        // if(this.noteCountEachDay[this.listOfCards[tobeRemovedIndex].submitDate] > 1){
          
        //   // console.log("reduce exectued")
        //   // console.log(this.noteCountEachDay[this.listOfCards[tobeRemovedIndex].submitDate])
        //   // console.log(this.listOfCards)
        //   // console.log("tobe removed" + tobeRemovedIndex)
        //   // console.log(this.listOfCards[tobeRemovedIndex - 1])
        //   console.log(this.noteCountEachDay)
        // }
        this.noteCountEachDay[this.listOfCards[tobeRemovedIndex].submitDate] -= 1
        if(this.noteCountEachDay[this.listOfCards[tobeRemovedIndex].submitDate] == 0){
          this.listOfDates.splice(this.listOfDates.indexOf(this.listOfCards[tobeRemovedIndex].submitDate),1);
          this.listOfCards.splice(tobeRemovedIndex-1,1);
        }

        //remove that note from the UI
        this.listOfCards.splice(tobeRemovedIndex,1);

        if(Object.keys(this.listOfDates).length == 0){
          this.fetchDataWithFilter(this.db,"bulabula");
        }

        //check if there is note left
        if(this.listOfCards.length == 0){
          this.isEmpty = true;
        }         

      });

    //Listener for the event that undo a archived note on UI 
    bus.on('reload_notes_with_undo_note', (id)=> {
        this.listOfCards = [];

        //just refresh the page with archived notes
        this.fetchDataWithFilter(this.db,"archive?bula");

    });

    //listener for reloading all notes
    bus.on('reload_all_notes', () => {
      this.fetchDataWithFilter(this.db,"bulabula?bula");
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
       var currTime = new Date();
       var submitDateStr = currTime.getUTCDate() + '-' + currTime.getMonth() + '-' + currTime.getFullYear();
       var newEntry = new CardStruct("New note added, click the edit button below to start editing",submitDateStr,"", "", time,"",0)
    
       //add note contents and date to the note storage (update ui first)
       this.db.notes.add({content: newEntry.content,submitDate:submitDateStr,tag:newEntry.tag, notebook: newEntry.notebook, date: newEntry.date, reminderMsg:newEntry.reminderMsg,isdone:newEntry.isdone},).then(() => {
         //and and the latest note to the user interface by retriving the last added note from the database.
         this.db.notes.orderBy("id").reverse().limit(1).toArray().then((newEntry) => {
          if(this.listOfDates.indexOf(submitDateStr) == -1){
            this.listOfDates.push(submitDateStr)
            if(this.noteCountEachDay[submitDateStr] == undefined){
              this.noteCountEachDay[submitDateStr] = 1;
            }
            else{
              this.noteCountEachDay[submitDateStr] += 1;
            }
            this.listOfCards.push(new CardStruct(
              newEntry[0].content,newEntry[0].submitDate,newEntry[0].tag, newEntry[0].notebook,newEntry[0].date,newEntry[0].reminderMsg,newEntry[0].isdone,-99,false,newEntry[0].submitDate
            ))
            this.listOfCards.push(new CardStruct(
              newEntry[0].content,newEntry[0].submitDate,newEntry[0].tag, newEntry[0].notebook,newEntry[0].date,newEntry[0].reminderMsg,newEntry[0].isdone,newEntry[0].id,true,'none'
            ))
          }
          else{
            this.noteCountEachDay[submitDateStr] += 1;
            this.listOfCards.push(new CardStruct(
              newEntry[0].content,newEntry[0].submitDate,newEntry[0].tag, newEntry[0].notebook,newEntry[0].date,newEntry[0].reminderMsg,newEntry[0].isdone,newEntry[0].id,true,'none'
            ))
          }
          console.log(this.noteCountEachDay[submitDateStr])     

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
    console.log('runs')
     var noteData = db.notes.where('isdone').equals(0).toArray().then(notes => {
        notes.forEach(note => {
          if(this.listOfDates.indexOf(note.submitDate) == -1){
              this.listOfDates.push(note.submitDate); 
              this.noteCountEachDay[note.submitDate] = 1;
              this.listOfCards.push(new CardStruct(
                note.content,note.submitDate,note.tag, note.notebook,note.date,note.reminderMsg,note.isdone,-99,false,note.submitDate
              ))          
              this.listOfCards.push(new CardStruct(
                note.content,note.submitDate,note.tag, note.notebook,note.date,note.reminderMsg,note.isdone,note.id,true,'none'
              ))
          }
          else{
              this.noteCountEachDay[note.submitDate] += 1;
              this.listOfCards.push(new CardStruct(
                note.content,note.submitDate,note.tag, note.notebook,note.date,note.reminderMsg,note.isdone,note.id,true,'none'
              ));
          }
        }
        );
      if(this.listOfCards.length > 0){
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
    this.listOfCards = [];

    //reset the list of date
    this.listOfDates = [];

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
          if(this.listOfDates.indexOf(note.submitDate) == -1){
              
              this.listOfDates.push(note.submitDate); 
               this.noteCountEachDay[note.submitDate] = 1;
              this.listOfCards.push(new CardStruct(
                note.content,note.submitDate,note.tag, note.notebook,note.date,note.reminderMsg,note.isdone,-99,false,note.submitDate
              ))          
              this.listOfCards.push(new CardStruct(
                note.content,note.submitDate,note.tag, note.notebook,note.date,note.reminderMsg,note.isdone,note.id,true,'none'
              ))
          }
          else{
              this.noteCountEachDay[note.submitDate] += 1;
              this.listOfCards.push(new CardStruct(
                note.content,note.submitDate,note.tag, note.notebook,note.date,note.reminderMsg,note.isdone,note.id,true,'none'
              ));
          }
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
          if(this.listOfDates.indexOf(note.submitDate) == -1){
              
              this.listOfDates.push(note.submitDate); 
              this.noteCountEachDay[note.submitDate] = 1;
              this.listOfCards.push(new CardStruct(
                note.content,note.submitDate,note.tag, note.notebook,note.date,note.reminderMsg,note.isdone,-99,false,note.submitDate
              ))          
              this.listOfCards.push(new CardStruct(
                note.content,note.submitDate,note.tag, note.notebook,note.date,note.reminderMsg,note.isdone,note.id,true,'none'
              ))
          }
          else{
              this.noteCountEachDay[note.submitDate] += 1;
              this.listOfCards.push(new CardStruct(
                note.content,note.submitDate,note.tag, note.notebook,note.date,note.reminderMsg,note.isdone,note.id,true,'none'
              ));
          }
        }
        );
      if(this.listOfCards.length > 0){
        this.isEmpty = false;
      }        
     })
  }

  /**
   * Fetch all notes within a specfic notebook
   * @param db The database connector 
   * @param notebook the notebook specfied 
   */
  private _fetchNotesWithNotebook(db: Database,notebook:string) : void{

     var noteData = db.notes.filter((note) => {
       return note.notebook.indexOf(notebook) != -1 
     }).toArray().then(notes => {
        notes.forEach(note => {
          if(this.listOfDates.indexOf(note.submitDate) == -1){
              
              this.listOfDates.push(note.submitDate); 
              this.noteCountEachDay[note.submitDate] = 1;
              this.listOfCards.push(new CardStruct(
                note.content,note.submitDate,note.tag, note.notebook,note.date,note.reminderMsg,note.isdone,-99,false,note.submitDate
              ))          
              this.listOfCards.push(new CardStruct(
                note.content,note.submitDate,note.tag, note.notebook,note.date,note.reminderMsg,note.isdone,note.id,true,'none'
              ))
          }
          else{
              this.noteCountEachDay[note.submitDate] += 1;
              this.listOfCards.push(new CardStruct(
                note.content,note.submitDate,note.tag, note.notebook,note.date,note.reminderMsg,note.isdone,note.id,true,'none'
              ));
          }
        }
        );
      if(this.listOfCards.length > 0){
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
