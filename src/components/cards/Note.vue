<template>
<!-- Each note -->
<el-card :id="id" class="notes" shadow="always">
    <!-- Main body               -->
    <div v-if="!isEditingContent" class="notes-text"><p align="left" :innerHTML="contentParsed"></p></div>
    <Editor v-else :loadedContent="contentParsed" :assignedNote="id"></Editor>
    <br/>

    <!-- Control area -->
    <div class="card-header note-opt">
        <el-space :size="10">
          <!-- Archive and undo archive buttons -->
          <el-icon v-if="archived" style="width: 2em; height: 2em; color:grey;" @click="redoArchive" > <refresh-right/> </el-icon>
          <el-icon v-if="!isEditingContent&&!archived"  style="width: 2em; height: 2em; margin-right: 5px; color:grey;" @click="archive" ><circle-check/></el-icon>
          
          <!-- Finish editing note content button -->
          <el-icon v-if="isEditingContent" style="width: 2em; height: 2em; margin-right: 5px; color:grey;" @click="getContentAndupdateNote(id)" ><circle-check /></el-icon>
          
          <!-- Tags  -->

          <el-icon style="width: 2em; height: 2em; margin-right: 5px; color:grey;" @click="isSelectingTags = true;"><price-tag /></el-icon>


          <!-- Notebook -->
          <el-icon  style="width: 2em; height: 2em; margin-right: 5px; color:grey;" @click="isSelectingNotebooks = true;"><notebook /></el-icon>

          <!-- Time selector   -->
          <el-icon v-if="!isEditingContent" style="width: 2em; height: 2em; color:grey;" @click="openTimeSelector"><timer/></el-icon>

          <!-- Edit button -->
          <el-icon v-if="!isEditingContent" style="width: 2em; height:2em; color:grey;" :size="15" @click="editContent"><edit/></el-icon>

          <el-icon v-if="!isEditingContent" style="width: 2em; height: 2em; color:grey;" :size="15" @click="removeNote"><delete /></el-icon>
        
        </el-space>

    </div>
    <el-dialog v-model="isSelectingTime" v-bind:title="uiText.title">
       <el-form v-if="isReminder">
        <el-form-item v-bind:label="uiText.time" :label-width="labelWidth">
          <el-date-picker
                v-model="dateTimeSelected"
                type="datetime"
                placeholder="Select date and time"
                :shortcuts="shortcuts"
                style="width: 70%;"
              >
          </el-date-picker>
        </el-form-item>
        <el-form-item v-bind:label="uiText.message" :label-width="labelWidth">
          <el-input v-model="reminderMsgShown" autocomplete="off" style="width: 70%;"></el-input>
        </el-form-item>
       </el-form>
      <el-button v-else type="primary" @click="showReminderSetting()" plain
        >{{$t('operationBar.reminder_addReminderBtn')}}</el-button
      >

  <template #footer>
    <span class="dialog-footer">
      <el-button v-if="isReminder" @click="isSelectingTime = false" plain>Cancel</el-button>
      <el-button v-else @click="isSelectingTime = false" plain>Close</el-button>
      <el-button v-if="isReminder" type="primary" @click="confirmReminderInfo" plain
        >Confirm</el-button
      >
    </span>
  </template>
</el-dialog>
<el-dialog v-model="isSelectingNotebooks" v-bind:title="uiText.notebook_title">
    <el-space wrap>
        <el-tag type="info" v-for="notebook in notebooksHolder" :key="notebook" effect="plain" @close="removeNotebook(notebook)" closable>{{notebook}}</el-tag>  
        <el-autocomplete class="add-new-tag-tag"  v-if="isAddingNewNotebook" :fetch-suggestions="notebooksHint" v-model="newNotebookData" @select="handleAutoSelectNotebook" size="mini"  @keyup.enter="confirmInputHandlerforNotebook"></el-autocomplete>
        <el-button v-else class="add-new-tag-btn" size="small" @click="enableNewNotebookInput">+</el-button>   
    </el-space>
</el-dialog>
<el-dialog v-model="isSelectingTags" v-bind:title="uiText.tag_title">
    <el-space wrap>
        <el-tag type="info" v-for="tag in tagsHolder" :key="tag" effect="plain" @close="removeTag(tag)" closable>{{tag}}</el-tag>  
        <el-autocomplete class="add-new-tag-tag" v-if="isAddingNewTag" v-model="newTagData" :fetch-suggestions="tagsHint" size="mini" @select="handleAutoSelectTags"  @keyup.enter="confirmInputHandlerforTag"></el-autocomplete>
        <el-button v-else class="add-new-tag-btn" size="small" @click="enableNewTagInput">+</el-button>
    </el-space> 
</el-dialog>


</el-card>

<br/>
</template>

      
<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { CircleCheck,CaretBottom,PriceTag,Timer,Notebook,Edit,RefreshRight,Delete} from '@element-plus/icons';
import {Database} from '../../databases/database';
import {TimeFormatter} from '../../utils/timeFormatter';

import bus from '../../bus';
import anime from "animejs/lib/anime.es.js";
import { ElMessage } from 'element-plus';
import Editor from './widgets/Editor.vue';
import { useI18n } from 'vue-i18n';


@Options({

    props:{
        contents : String,
        submitDate:String,
        tag : String,
        notebook : String,
        date:Number,
        reminderMsg:String,
        isdone:Number,
        id: Number,
    },
    components:{
      CircleCheck,
      CaretBottom,
      PriceTag,
      Timer,
      Delete,
      Notebook,
      Edit,
      Editor,
      RefreshRight
    }
})



export default class Note extends Vue {

  //props 
  date! : number;
  submitDate!:string;
  reminderMsg! : string;
  tag!:string;
  notebook! : string;
  contents! : string;
  id! : number;
  isdone!:number;
  isShowingAddedDate!:boolean;
  

  //prop wrapper (kind of)
  dateDisplay! : string;
  tagsHolder : string[] = [];
  notebooksHolder : string[] = [];
  contentParsed! : string;
  archived = false;

  submitDateStr = '';

  labelWidth = '70px'

  isSelectingNotebooks = false;
  isSelectingTags = false;


  isEditingContent = false;
  editingContent = '';

  isAddingNewTag = false;
  isAddingNewNotebook = false;
  newTagData = '';
  newNotebookData = '';
  
  isReminder = false;
  dateTimeSelected = new Date() ;
  isSelectingTime = false;
  reminderMsgShown = '';
  existingNotebooks:any = [];
  existingTags:any = [];

  db! : Database;

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
          {
            text: 'An Hour ago',
            value: () => {
              const date = new Date()
              date.setTime(date.getTime() - 3600 * 1000 * 1)
              return date
            },
          },
          {
            text: 'An Hour later',
            value: () => {
              const date = new Date()
              date.setTime(date.getTime() + 3600 * 1000 * 1)
              return date
            },
          },
    ];


  renderedHTMLStylesheet = `
        <style>    
          table {
            border-top: 1px solid #ccc;
            border-left: 1px solid #ccc;
          }
          table td,
          table th {
            border-bottom: 1px solid #ccc;
            border-right: 1px solid #ccc;
            padding: 3px 5px;
          }
          table th {
            border-bottom: 2px solid #ccc;
            text-align: center;
          }


          blockquote {
            display: block;
            border-left: 8px solid #d0e5f2;
            padding: 5px 10px;
            margin: 10px 0;
            line-height: 1.4;
            font-size: 100%;
            background-color: #f1f1f1;
          }

          code {
            display: inline-block;
            *display: inline;
            *zoom: 1;
            background-color: #f1f1f1;
            border-radius: 3px;
            padding: 3px 5px;
            margin: 0 3px;
          }
          pre code {
            display: block;
          }


          ul, ol {
            margin: 10px 0 10px 20px;
          }
        </style>    
        `;

  locale!: any
  t!:any

  uiText= {}


  created(){

    //Obtain the contents shown on the note
    this.contentParsed = this.contents;
    this.editingContent = this.contentParsed;

    //pre check the archive status
    if(this.isdone == 1){
      this.archived = true;
    }


  }

  mounted() {
    //connect to the database 
    this.db = new Database();  


    const {locale,t} = useI18n();
    this.locale = locale;
    this.t = t; 
    this.getLocalizedStrings();


    //set the reminder if there is on 
    this.getReminderInfo();


    // obtain notebooks and tags for this note 
    this.parseNotebooks();
    this.parseTags();

    // obtain the list of notebooks and tags for all notes
    this.fetchNotebookList();
    this.fetchTagsList();
    

    /*
     * Listener for event that removes all notebook on this note
     */
    bus.on('remove-notebook-on-note',(notebook) => {
      
      // Remove the specified notebook and update  
      this.removeNotebook(String(notebook));
      this.existingNotebooks = [];
      this.fetchNotebookList();
    });

    /*
     * Listener for event that removes all tags on this note
     */
    bus.on('remove-tag-on-note',(tag) => {

      // Remove the specified tag and update 
      this.removeTag(String(tag));
      this.existingTags = [];
      this.fetchTagsList();
    });  

    /*
     * Listener for event that update the the auto complete for adding notebook 
     * on this note
     */
    bus.on('update_autocomplete_notebook',() => {

        //update the auto complete (fetch notebook list again)
        this.$nextTick(() => {this.existingNotebooks = [];});
        this.$nextTick(() => {this.fetchNotebookList();});
    });

    /*
     * Listener for event that update the the auto complete for adding tag 
     * on this note
     */
    bus.on('update_autocomplete_tag',() => {

        //update the auto complete (fetch tag list again)
        this.$nextTick(() => {this.existingTags = [];});
        this.$nextTick(() => {this.fetchTagsList();});
    });

    /*
     * Listener for event that transmit edited content from editor and update content
     */
    bus.on('transfer_editing'+String(this.id), (html) => {
      
        var htmlString: any = html;  
        this.updateNote(htmlString)
    });

    /**
     * Listener for event that update the UI language
     */
    bus.on('update_language',() => {
      this.getLocalizedStrings();
    })

  }

  /**
   * get localized data for all labels 
   */
  public getLocalizedStrings() : void {
    this.uiText = {
        addReminerBtn : this.t('operationBar.reminder_addReminderBtn'),
        title : this.t('operationBar.reminder_title'),
        time :this.t('operationBar.reminder_time'),
        message :this.t('operationBar.reminder_message'),
        tag_title: this.t('operationBar.tag_title'),
        notebook_title: this.t('operationBar.notebook_title')
    
    }  
  }

  /**
   * Check if this note already has a reminder
   */
  public getReminderInfo() : void {
    
    if(this.date != -1 ){
      this.isReminder = true;
      
      //load the reminder time 
      this.dateTimeSelected = new Date(this.date);
      
      //set the reminder message 
      this.reminderMsgShown = this.reminderMsg;
    }
    else{

      //init the time with the current time 
      this.dateTimeSelected = new Date();
      
    }
  }

 /**
  * Enable the reminder setting
  */
  public showReminderSetting() : void{
    this.isReminder = true;
    this.dateTimeSelected = new Date();
  }


  /**
   * Open the dialog for selecting scheduled time
   */
  public openTimeSelector(): void { 
    this.isSelectingTime=true;
  }

  /**
   * Confirming the reminder information
   */
  public confirmReminderInfo() : void{
    this.isSelectingTime = false;
    this.updateReminder();
  }

  /**
   * Update the database with the latest reminder information
   */
  public updateReminder() : void { 
    this.db.card.update(this.id, {date: this.dateTimeSelected.getTime()}).then(() => {
      this.db.card.update(this.id, {reminderMsg : this.reminderMsgShown});
    })
  }

  /**
   * Remove a specfic tag 
   * @param selectedTag The tag to remove 
   */
  public removeTag(selectedTag : string) : void {
    this.tagsHolder.splice(this.tagsHolder.indexOf(selectedTag),1);
    this.updateTags();
  } 

  /**
   * Remove a specfic notebook
   * @param selectedNotebookg The notebook to remove 
   */
  public removeNotebook(selectedNotebook : string) : void {
    if(this.notebooksHolder.indexOf(selectedNotebook) > -1 ){
          this.notebooksHolder.splice(this.notebooksHolder.indexOf(selectedNotebook),1);
          this.updateNotebooks();
    }
  } 

  /**
   * Triggers to to establish a new input field for the user to add a new tag
   */  
  public enableNewTagInput() : void {
    this.isAddingNewTag = true;
  }

  /**
   * Triggers to to establish a new input field for the user to add a new notebook
   */   
  public enableNewNotebookInput() : void {
    this.isAddingNewNotebook = true;
  }

  /**
   * Confirming the new tag added by the user
   */ 
  public confirmInputHandlerforTag() : void {
     var newTagDataValidator = this.newTagData;
     //if added tag is okay
     if(newTagDataValidator){
       //and if this tag has not beed added to this note 
       if(this.tagsHolder.indexOf(newTagDataValidator) == -1){
         
         //update the tag index and add the tag to this note 
         this.updateTagIndex(newTagDataValidator);
         this.tagsHolder.push(newTagDataValidator);
       }
       else{
        ElMessage({
          showClose: true,
          message: 'Oops, you cannot set repeated tag for your note',
          type: 'error',
        })
       }
     }
     else{
       //error
     }

     //turn off input field for adding tag once done and reset it
     this.isAddingNewTag = false;
     this.newTagData = '';
     
     //update the database 
     this.updateTags();
  }

  /**
   * Confirming the new tag added by the user
   */ 
  public confirmInputHandlerforNotebook() : void {
     var newNotebookDataValidator = this.newNotebookData;
     
     //if added notebook is okay
     if(newNotebookDataValidator){
       //and if this notebook has not beed added to this note 
       if(this.notebooksHolder.indexOf(newNotebookDataValidator) == -1){
          
          //update the notebok index and add the notebook to this note 
          this.updateNotebookIndex(newNotebookDataValidator);
          this.notebooksHolder.push(newNotebookDataValidator);
       }
       else{
        ElMessage({
          showClose: true,
          message: 'Oops, you cannot add your note to same notebook twice',
          type: 'error',
        })
       }

     }
     else{
      ElMessage({
          showClose: true,
          message: 'Oops, this is a error message.',
          type: 'error',
        })
     }

     //turn off input field for adding notebook once done and reset it
     this.isAddingNewNotebook = false;
     this.newNotebookData = '';

     //update the database
     this.updateNotebooks();
  }
  

  /**
   * Update the notebook index 
   * @param newNotebook the new notebook added
   */
  public updateNotebookIndex(newNotebook:string) : void {

    this.db.notebooks.where('name').equals(newNotebook).toArray().then((existingData) => {
       //if the newly added notebook does not yet exist in database
       if(existingData.length == 0){

         //add this new notebook 
         this.db.notebooks.add({'name': newNotebook});
          try{
              
              //Signal to update the auto complete for notebook 
              //and the notebook index
              bus.emit('update_autocomplete_notebook');
              bus.emit('update_notebook_list');
          }
          catch(e){
            console.log(e)
          }
       } 
    })
  }

  /**
   * Update the tag index 
   * @param newTag the new tag added
   */
  public updateTagIndex(newTag:string) : void {
    this.db.tags.where('name').equals(newTag).toArray().then((existingData) => {
       
       //if the newly added tag does not yet exist in database
       if(existingData.length == 0){

         //add this new tag
         this.db.tags.add({'name': newTag});
          try{
              
              //Signal to update the auto complete for tags
              //and the tag index            
              bus.emit('update_autocomplete_tag');
              bus.emit('update_tag_list');
          }
          catch(e){
            console.log(e)
          }
       } 
    })
  }

  /**
   * Trigger to turn on/off the editing status of the note
   */
  public editContent() : void {
    this.isEditingContent = !this.isEditingContent;
  }

  /**
   * Retrive the contents edited in editor and update the contents on note
   * @param id the id of the note to request content
   */
  public getContentAndupdateNote(id:any) : void {
    bus.emit('get_editing_content_signal',(id));
  }

  /**
   * Feteh all exisitng tags
   */
  public fetchTagsList() : void {

      this.db.tags.toArray().then(tags => {
          tags.forEach(tag => {
              var newTagbookObject = {value: tag.name}
              this.existingTags.push(newTagbookObject);
          })
      })
  } 

  /**
   * auto complete for tags
   */
  public tagsHint(query:string,cb:any) : void {
      var listTags = this.existingTags;
      var tmp = query;
      cb(listTags);
  }

  /**
   * handle the select event in the auto complete for tag
   */
  public handleAutoSelectTags(tag:any) : void {
    this.newNotebookData = tag.value;
    this.confirmInputHandlerforTag(); 
  }

  /**
   * parse the tags string (the tags of a note is stored as a string in databases)
   */
  public parseTags() : void {
  //!: The tag is stored as "tag1-tag2-tag3" in database

    //get each tag by spliting the string
    var tagLists = this.tag.split('-');
    if (tagLists.length > 0 ){
     tagLists.forEach(tag => {
      if(tag.length > 0){
        this.tagsHolder.push(tag);
      }
    })
    }

  }
  
  /**
   * Feteh all exisitng tags
   */
  public fetchNotebookList() : void {
      this.db.notebooks.toArray().then(notebooks => {
          notebooks.forEach(notebook => {
              var newNotebookObject = {value: notebook.name}
              this.existingNotebooks.push(newNotebookObject);
          })
      })
  } 

  /**
   * Auto complete for the notbook 
   */
  public notebooksHint(query:string,cb:any) : void {
      var listNotebook = this.existingNotebooks;
      var tmp = query;
      cb(listNotebook);
  }

  /**
   * Handle the select event in the auto complete for the notebook
   */
  public handleAutoSelectNotebook(notebook:any) : void {
    this.newNotebookData = notebook.value;
    this.confirmInputHandlerforNotebook(); 
  }


  /**
   * parse the notebooks string (the notebooks of a note is stored as a string in databases)
   */
  public parseNotebooks() : void {
    //!: The notebook is stored as "notebook1-notebook2-notebook3" in database
    
    //get each notebook by spliting the string
    var notebookLists = this.notebook.split('-');
    if (notebookLists.length > 0){
     notebookLists.forEach(notebook => {
      if(notebook.length > 0){ 
        this.notebooksHolder.push(notebook);
      }
    });
    }

  }

  /**
   * Update the contents of the note and saves into the database
   * @param editorHTMLString the html string to be rendered as the content of this note
   */
  public updateNote(editorHTMLString : string): void {

    // //import the markdown parser
    // const marked = require('marked')

    //the content to be rendered on the note is the html + css code 
    this.contentParsed = editorHTMLString + this.renderedHTMLStylesheet;

    //hide the edit form 
    this.isEditingContent = false;

    //update the database with the latest content 
    this.db.card.update(this.id, {content: this.contentParsed}).catch(e => {console.log(e)});

  }

  /**
   * Update the notebook of this note
   */
  public updateNotebooks() : void {
    var notebookString = '';

    //combine all notebooks into a string with a spilter -
    this.notebooksHolder.forEach(notebook => {
      notebookString += notebook + '-'
    })

    //remove the extra - at the end 
    notebookString = notebookString.substring(0,notebookString.length-1);
    
    //update the database 
    this.db.card.update(this.id, {notebook: notebookString});
  }

  /**
   * Update the tag of this note
   */
  public updateTags() : void {
    var tagString = '';

    //combine all tags into a string with a spilter -
    this.tagsHolder.forEach(tag => {
      tagString += tag + '-'
    })

    //remove the extra - at the end 
    tagString = tagString.substring(0,tagString.length-1);
    
    //update the database 

    this.db.card.update(this.id, {tag: tagString});

  }

  /**
   * achive this note
   */
  public archive() : void { 

    //set the isdone status to 1 to marks it as archived
    this.db.card.update(this.id, {isdone: 1}).then(() => {
      
      //show the fade out animation
      this.disappearAnime(String(this.id));
      setTimeout(()=>{bus.emit('reload_notes_with_removed_note', this.id);  },700);
      
    });
    
  }

  /**
   * Play the disapearing animation for this note 
   * @param id The id of this note 
   */    
  public disappearAnime(id:string) : void {
      console.log(id + "called me")
      var tobeArchivedNoteId = document.getElementById(id);

      anime({
        targets: tobeArchivedNoteId,
        opacity:[1,0],
        easing:'linear',
        duration:300
      })

  }


  /**
   * Redo the archive of this note 
   */ 
  public redoArchive() : void {
    this.db.card.update(this.id, {isdone: 0}).then(() => {
      this.disappearAnime(String(this.id));
      setTimeout(()=>{bus.emit('reload_notes_with_undo_note', this.id);  },700);
    });
    
  }

  /**
   * Remove this note
   */ 
  public removeNote() : void {
    this.db.card.delete(this.id).then(() => {
      
      //shows also the disappearing animation
      this.disappearAnime(String(this.id));
      setTimeout(()=>{bus.emit('reload_notes_with_removed_note', this.id);  },700);
    });
  }

}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.notes{
  width: 850px;
  position: relative;
  right:-30px;
}

.note-container{
  width: 950px;
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

.add-new-tag-tag{
  width:30px;
  vertical-align: bottom;
}


</style>
