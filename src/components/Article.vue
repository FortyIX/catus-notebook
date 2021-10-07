<template>
<!-- Each note -->
<el-card :id="id" class="notes" shadow="hover">
    <!-- Main body               -->
    <div v-if="!isEditingContent" class="notes-text"><p align="left" :innerHTML="contentParsed"></p></div>
    <Editor v-else :loadedContent="contentParsed" :assignedNote="id"></Editor>
    <br/>

    <!-- Control area -->
    <div class="card-header note-opt">
        <el-space :size="10">
          
          <!-- Finish editing note content button -->
          <el-icon v-if="isEditingContent" style="width: 2em; height: 2em; margin-right: 5px; color:grey;" @click="getContentAndupdateNote(id)" ><circle-check /></el-icon>
          
          <!-- Edit button -->
          <el-icon v-if="!isEditingContent" style="width: 2em; height:2em; color:grey;" :size="15" @click="editContent"><edit/></el-icon>

          <el-icon v-if="!isEditingContent" style="width: 2em; height: 2em; color:grey;" :size="15" @click="removeNote"><delete /></el-icon>
        
        </el-space>

    </div>
</el-card>
<br/>
</template>

      
<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { CircleCheck,CaretBottom,PriceTag,Timer,Notebook,Edit,RefreshRight,Delete} from '@element-plus/icons';
import {Database} from '../databases/database';
import {TimeFormatter} from '../utils/timeFormatter';

import bus from '../bus';
import anime from "animejs/lib/anime.es.js";
import { ElMessage } from 'element-plus';
import Editor from './Editor.vue';
import { useI18n } from 'vue-i18n';


@Options({

    props:{
      id: String,
      contents:String,
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



export default class Article extends Vue {

  //props 
  contents! : string;
  id! : string;

  

  //prop wrapper (kind of)
  contentParsed! : string;
 
  labelWidth = '70px'


  isEditingContent = false;
  editingContent = '';
  db! : Database;

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


  }

  mounted() {
    //connect to the database 
    this.db = new Database();  


    const {locale,t} = useI18n();
    this.locale = locale;
    this.t = t; 
    this.getLocalizedStrings();

    


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
    this.db.widget.update(this.id, {content: this.contentParsed}).catch(e => {console.log(e)});

  }




  // /**
  //  * achive this note
  //  */
  // public archive() : void { 

  //   //set the isdone status to 1 to marks it as archived
  //   this.db.notes.update(this.id, {isdone: 1}).then(() => {
      
  //     //show the fade out animation
  //     this.disappearAnime(String(this.id));
  //     setTimeout(()=>{bus.emit('reload_notes_with_removed_note', this.id);  },700);
      
  //   });
    
  // }

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
   * Remove this note
   */ 
  public removeNote() : void {
    this.db.widget.delete(this.id).then(() => {
      
      //shows also the disappearing animation
      this.disappearAnime(String(this.id));
      setTimeout(()=>{bus.emit('remove_widget', this.id);  },700);
    });
  }

}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.notes{
  width: 795px;
  right: 10px;
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
