<template>

<!-- Each note -->
<el-card :id="id" class="notes" shadow="always">
    <!-- Main body               -->
    <div v-if="!isEditingContent" class="notes-text"><p align="left" :innerHTML="contentParsed"></p></div>
    <Editor v-else :loadedContent="contentParsed"></Editor>
    <br/>

    <!-- Control area -->
    <div class="card-header note-opt">
      <span style="font-size:13px;"> 
          <!-- Archive and undo archive buttons -->
          <el-icon v-if="archived" style="width: 2em; height: 2em;" @click="redoArchive" > <refresh-right/> </el-icon>
          <el-icon v-if="!isEditingContent&&!archived"  style="width: 2em; height: 2em; margin-right: 5px;" @click="archive" ><circle-check-filled /></el-icon>
          
          <!-- Finish editing note content button -->
          <el-icon v-if="isEditingContent" style="width: 2em; height: 2em; margin-right: 5px;" @click="getContentAndupdateNote(id)" ><circle-check-filled /></el-icon>
          
          <!-- Tags  -->
          <el-popover v-if="!isEditingContent" placement="bottom" :width="400" trigger="click">
            <template #reference>
                <el-icon  style="width: 2em; height: 2em; margin-right: 5px;"><price-tag /></el-icon>
            </template>
            <el-space wrap>
              <el-tag type="info" v-for="tag in tagsHolder" :key="tag" effect="plain" @close="removeTag(tag)" closable>{{tag}}</el-tag>  
              <el-autocomplete class="add-new-tag-tag" v-if="isAddingNewTag" v-model="newTagData" :fetch-suggestions="tagsHint" size="mini" @select="handleAutoSelectTags"  @keyup.enter="confirmInputHandlerforTag"></el-autocomplete>
              <el-button v-else class="add-new-tag-btn" size="small" @click="enableNewTagInput">+</el-button>
            </el-space> 
          </el-popover>

          <!-- Notebook -->
          <el-popover v-if="!isEditingContent" placement="bottom" :width="400" trigger="click">
            <template #reference>
                <el-icon  style="width: 2em; height: 2em; margin-right: 5px;"><notebook /></el-icon>
            </template>
            <el-space wrap>
              <el-tag type="info" v-for="notebook in notebooksHolder" :key="notebook" effect="plain" @close="removeNotebook(notebook)" closable>{{notebook}}</el-tag>  
              <el-autocomplete class="add-new-tag-tag"  v-if="isAddingNewNotebook" :fetch-suggestions="notebooksHint" v-model="newNotebookData" @select="handleAutoSelectNotebook" size="mini"  @keyup.enter="confirmInputHandlerforNotebook"></el-autocomplete>
              <el-button v-else class="add-new-tag-btn" size="small" @click="enableNewNotebookInput">+</el-button>   
            </el-space>
          </el-popover>

          <!-- Time selector   -->
          <el-icon v-if="!isEditingContent" style="width: 2em; height: 2em; margin-right: 5px;" @click="openTimeSelector"><timer/></el-icon>

          <!-- Edit button -->
          <el-icon v-if="!isEditingContent" style="width: 1em; height: 1em;" :size="15" @click="editContent"><edit/></el-icon>

        </span> 
    </div>
    <el-dialog title="Reminder" v-model="isSelectingTime">

        <el-date-picker
          v-model="dateTimeSelected"
          type="datetime"
          placeholder="Select date and time"
          :shortcuts="shortcuts"
        >
    </el-date-picker>

  <template #footer>
    <span class="dialog-footer">
      <el-button @click="isSelectingTime = false">Cancel</el-button>
      <el-button type="primary" @click="confirmTimeSelection"
        >Confirm</el-button
      >
    </span>
  </template>
</el-dialog>
</el-card>

<br/>
</template>

      
<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { CircleCheckFilled,CaretBottom,PriceTag,Timer,Notebook,Edit,RefreshRight} from '@element-plus/icons';
import {Database} from '../database';


import bus from '../bus';
import dayjs from 'dayjs';
import anime from "animejs/lib/anime.es.js";
import { ElSteps } from 'element-plus';
import { ElMessage } from 'element-plus';
import Editor from './Editor.vue';
@Options({

    props:{
        contents : String,
        tag : String,
        notebook : String,
        date:Number,
        isdone:Number,
        id: Number
    },
    components:{
      CircleCheckFilled,
      CaretBottom,
      PriceTag,
      Timer,
      Notebook,
      Edit,
      Editor,
      RefreshRight
    }
})



export default class Note extends Vue {

  //props 
  date! : number;
  tag!:string;
  notebook! : string;
  contents! : string;
  id! : number;
  isdone!:number
  

  //prop wrapper (kind of)
  dateDisplay! : string;
  tagsHolder : string[] = [];
  notebooksHolder : string[] = [];
  contentParsed! : string;
  archived = false;


  isEditingContent = false;
  editingContent = '';

  isAddingNewTag = false;
  isAddingNewNotebook = false;
  newTagData = '';
  newNotebookData = '';

  dateTimeSelected = new Date();
  isSelectingTime = false;

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






  created(){
 
    this.contentParsed = this.contents;
    this.editingContent = this.contentParsed;

    if(this.isdone == 1){
      this.archived = true;
    }
  }
  mounted() {
    //connect to the database 
    this.db = new Database();  

    this.dateTimeSelected = new Date(this.date);

    this.parseNotebooks();
    this.parseTags();

    this.fetchNotebookList();
    this.fetchTagsList();
    

    bus.on('remove-notebook-on-note',(notebook) => {

      this.removeNotebook(String(notebook));
      this.existingNotebooks = [];
      this.fetchNotebookList();
    })

    bus.on('remove-tag-on-note',(tag) => {
      this.removeTag(String(tag));
      this.existingTags = [];
      this.fetchTagsList();
    })   

    bus.on('update_autocomplete_notebook',() => {
        this.$nextTick(() => {this.existingNotebooks = [];});
        this.$nextTick(() => {this.fetchNotebookList();});
    })

    bus.on('update_autocomplete_tag',() => {
        this.$nextTick(() => {this.existingTags = [];});
        this.$nextTick(() => {this.fetchTagsList();});
    })

    bus.on('transfer_editing'+String(this.id), (html) => {
     var htmlString: any = html;  
     this.updateNote(htmlString)
    })


  }

  public openTimeSelector(): void { 
    this.isSelectingTime=true;
  }

  public confirmTimeSelection() : void{
    this.isSelectingTime = false;
    this.updateTime();
  }

  public updateTime() : void { 
    this.db.notes.update(this.id, {date: this.dateTimeSelected.getTime()}).catch(e => {console.log(e)});
  }

  public removeTag(selectedTag : string) : void {
    this.tagsHolder.splice(this.tagsHolder.indexOf(selectedTag),1);
    this.updateTags();
  } 


  public removeNotebook(selectedNotebook : string) : void {
    if(this.notebooksHolder.indexOf(selectedNotebook) > -1 ){
          this.notebooksHolder.splice(this.notebooksHolder.indexOf(selectedNotebook),1);
          this.updateNotebooks();
    }
  } 

  
  public enableNewTagInput() : void {
    this.isAddingNewTag = true;
  }
  
  public enableNewNotebookInput() : void {
    this.isAddingNewNotebook = true;
  }

  public confirmInputHandlerforTag() : void {
     var newTagDataValidator = this.newTagData;
     if(newTagDataValidator){
       if(this.tagsHolder.indexOf(newTagDataValidator) == -1){
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


     this.isAddingNewTag = false;
     this.newTagData = '';

     this.updateTags();
  }

  public confirmInputHandlerforNotebook() : void {
     var newNotebookDataValidator = this.newNotebookData;
     if(newNotebookDataValidator){
       if(this.notebooksHolder.indexOf(newNotebookDataValidator) == -1){
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
     this.isAddingNewNotebook = false;
     this.newNotebookData = '';

     this.updateNotebooks();
  }
  
  //
  public updateNotebookIndex(newNotebook:string) : void {
    this.db.notebooks.where('name').equals(newNotebook).toArray().then((existingData) => {
       if(existingData.length == 0){
         this.db.notebooks.add({'name': newNotebook});
          try{
              bus.emit('update_autocomplete_notebook');
              bus.emit('update_notebook_list');
          }
          catch(e){
            console.log(e)
          }
       } 
    })
  }


  public editContent() : void {
    this.isEditingContent = !this.isEditingContent;
  }

  public getContentAndupdateNote(id:any) : void {
    bus.emit('get_editing_content_signal',(id));
  }



  public updateTagIndex(newTag:string) : void {
    this.db.tags.where('name').equals(newTag).toArray().then((existingData) => {
       if(existingData.length == 0){
         this.db.tags.add({'name': newTag});
          try{
              bus.emit('update_autocomplete_tag');
              bus.emit('update_tag_list');
          }
          catch(e){
            console.log(e)
          }
       } 
    })
  }


  public fetchTagsList() : void {
      this.db.tags.toArray().then(tags => {
          tags.forEach(tag => {
              var newTagbookObject = {value: tag.name}
              this.existingTags.push(newTagbookObject);
          })
      })
  } 

  public tagsHint(query:string,cb:any) : void {
      var listTags = this.existingTags;
      var tmp = query;
      cb(listTags);
  }

  //
  public handleAutoSelectTags(tag:any) : void {
    this.newNotebookData = tag.value;
    this.confirmInputHandlerforTag(); 
  }


  public parseTags() : void {


    var tagLists = this.tag.split('-');
    if (tagLists.length > 0 ){
     tagLists.forEach(tag => {
      if(tag.length > 0){
        this.tagsHolder.push(tag);
      }
    })
    }

  }
  
  //
  public fetchNotebookList() : void {
      this.db.notebooks.toArray().then(notebooks => {
          notebooks.forEach(notebook => {
              var newNotebookObject = {value: notebook.name}
              this.existingNotebooks.push(newNotebookObject);
          })
      })
  } 

  //
  public notebooksHint(query:string,cb:any) : void {
      var listNotebook = this.existingNotebooks;
      var tmp = query;
      cb(listNotebook);
  }

  //
  public handleAutoSelectNotebook(notebook:any) : void {
    this.newNotebookData = notebook.value;
    this.confirmInputHandlerforNotebook(); 
  }



  public parseNotebooks() : void {

    var notebookLists = this.notebook.split('-');
    if (notebookLists.length > 0){
     notebookLists.forEach(notebook => {
      if(notebook.length > 0){ 
        this.notebooksHolder.push(notebook);
      }
    });
    }

  }

  public updateNote(editorHTMLString : string): void {

    // //import the markdown parser
    // const marked = require('marked')

    this.contentParsed = editorHTMLString + this.renderedHTMLStylesheet;

    //hide the edit form 
    this.isEditingContent = false;

    this.db.notes.update(this.id, {content: this.contentParsed}).catch(e => {console.log(e)});

  }

  public updateNotebooks() : void {
    var notebookString = '';

    //combine all notebooks into a string with a spilter -
    this.notebooksHolder.forEach(notebook => {
      notebookString += notebook + '-'
    })

    //remove the extra - at the end 
    notebookString = notebookString.substring(0,notebookString.length-1);
    
    //update the database 
    this.db.notes.update(this.id, {notebook: notebookString});
  }





  public updateTags() : void {
    var tagString = '';

    //combine all tags into a string with a spilter -
    this.tagsHolder.forEach(tag => {
      tagString += tag + '-'
    })

    //remove the extra - at the end 
    tagString = tagString.substring(0,tagString.length-1);
    
    //update the database 

    this.db.notes.update(this.id, {tag: tagString});

  }

  public archive() : void { 
    this.db.notes.update(this.id, {isdone: 1}).then(() => {
      
      this.disappearAnime(String(this.id));
      setTimeout(()=>{bus.emit('reload_notes_with_removed_note', this.id);  },700);
      
    });
    
  }

    
  public disappearAnime(id:string) : void {

      var tobeArchivedNoteId = document.getElementById(id);


      anime({
        targets: tobeArchivedNoteId,
        opacity:[1,0],
        easing:'linear',
        duration:300
      })

  }



  public redoArchive() : void {
    this.db.notes.update(this.id, {isdone: 0}).then(() => {
      this.disappearAnime(String(this.id));
      setTimeout(()=>{bus.emit('reload_notes_with_undo_note', this.id);  },700);
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
