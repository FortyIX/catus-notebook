<template>
  <div class="mainFrame">
      <div class="window-control-bar">
          <div class="drag-area"></div>
          <div class="exit-btn" @click="shutDown"><el-icon class="exit-sign" style="height: 5px; margin-right: 5px; margin-bottom:20px; color:black;" :size="25"><close /></el-icon>
      </div>
      </div>
      <div class="side-bar">

        <el-menu
                class="side-nav-bar"
                :collapse="true"
                text-color="grey"
                active-text-color="grey"
                default-active="1"
                >
                <el-sub-menu index="1">
                    <template #title>
                    <el-icon style="width: 14px; height: 14px; margin-right: 0px; color:#fff;" :size="20"><expand /></el-icon> 
                    <span>Browse</span>
                    </template>
                    <el-menu-item-group v-bind:title="uiText.actions">
                        <el-menu-item v-if="isNotArchive&&!isBackHomeBtnNeeded" index="1-1" @click="addNote"><el-icon style="height: 5px; margin-right: 5px; margin-bottom:20px; color:grey;" :size="20"><circle-plus /></el-icon> <span>{{$t('menu.addNewNote')}}</span></el-menu-item>
                        <el-menu-item v-if="!isNotArchive" index="1-1" @click="removeAllArchivedNote"><el-icon style="height: 5px; margin-right: 5px; margin-bottom:20px; color:grey;" :size="20"><delete /></el-icon><span>{{$t('menu.delete')}}</span></el-menu-item>
                        <el-menu-item v-if="isBackHomeBtnNeeded" index="1-1" @click="switchToMain"><el-icon style="height: 5px; margin-right: 5px; margin-bottom:20px; color:grey;" :size="20"><arrow-left /></el-icon><span>{{$t('menu.back')}}</span></el-menu-item>
                    </el-menu-item-group>
                </el-sub-menu>
                <el-sub-menu index="2">
                    <template #title>
                    <el-icon style="width: 14px; height: 14px; margin-right: 0px; color:#fff;" :size="20"><notebook /></el-icon> 
                    <span>Browse</span>
                    </template>
                    <el-menu-item-group v-bind:title="uiText.writing">
                        <el-menu-item index="1-1" @click="showAllNotes"><el-icon style="height: 5px; margin-right: 5px; margin-bottom:20px; color:grey;" :size="20"><reading /></el-icon>
      <span>{{$t('menu.note')}}</span></el-menu-item>
                        <el-menu-item index="1-2" @click="showArchivedNotes"><el-icon style="height: 5px; margin-right: 5px; margin-bottom:20px; color:grey;" :size="20"><takeaway-box /></el-icon>
      <span>{{$t('menu.archive')}}</span></el-menu-item>
                    </el-menu-item-group>
                    <el-menu-item-group v-bind:title="uiText.cate">
                        <el-menu-item index="1-3" @click="isNotebookIndexVisiable=true"><el-icon style="height: 5px; margin-right: 5px; margin-bottom:20px; color:grey;" :size="20"><collection /></el-icon><span>{{$t('menu.notebooks')}}</span> 
                    </el-menu-item>
                    <el-menu-item index="1-4" @click="isTagIndexVisiable=true"><el-icon style="height: 5px; margin-right: 5px; margin-bottom:20px; color:grey;" :size="20"><price-tag /></el-icon><span>{{$t('menu.tags')}}</span></el-menu-item>
                    </el-menu-item-group>
                </el-sub-menu>
                <el-menu-item index="3" @click="switchToCalander">
                    <el-icon style="width: 14px; height: 14px; margin-right: 0px; color:#ffffff;" :size="20"><calendar /></el-icon> 
                    <span>Navigator Two</span>
                </el-menu-item>
                <!-- <el-menu-item index="4">
                    
                    <el-icon style="width: 14px; height: 14px; margin-right: 0px; color:#ffffff;" :size="20"><more /></el-icon>
                    <span>Navigator Three</span>
                </el-menu-item> -->
  
                <el-sub-menu index="4">
                    <template #title>
                    <el-icon style="width: 14px; height: 14px; margin-right: 0px; color:#fff;" :size="20"><more/></el-icon> 
                    <span>Browse</span>
                    </template>
                <el-menu-item-group v-bind:title="uiText.settings">
                    <el-menu-item @click="switchToSetting">
                        <el-icon style="height: 5px; margin-right: 5px; margin-bottom:20px; color:grey;" :size="20"><setting/></el-icon><span>{{$t('menu.settings')}}</span>
                    </el-menu-item>
                </el-menu-item-group>  
                <el-menu-item-group v-bind:title="uiText.about">
                    <el-menu-item @click="isAboutShown = true">
                        <el-icon style="height: 5px; margin-right: 5px; margin-bottom:20px; color:grey;" :size="20"><lollipop/></el-icon><span>{{$t('menu.about')}}</span>
                    </el-menu-item>
                    
                    <el-menu-item @click="openLicense">
                       <el-icon style="height: 5px; margin-right: 5px; margin-bottom:20px; color:grey;" :size="20"><document-copy/></el-icon><span>{{$t('menu.licenses')}}</span>
                    </el-menu-item>                        
                    
                </el-menu-item-group>  
                </el-sub-menu>


        </el-menu>
        <el-dialog v-model="isNotebookIndexVisiable" v-bind:title="uiText.notebooks">
                <el-scrollbar height="340px" width="330px" style="margin-top:10px;">
                    <el-card :id="notebook.id" class="notebook-card" style="margin-bottom:10px;" v-for="notebook in existingNotebooks" :key="notebook.name">
                         <span style="margin-right:50px; position:relative; top:5px;">{{notebook.name}}</span> 
                        <div class="control-region" style="float:right; margin-bottom:20px;"> 
                         <el-divider direction="vertical"></el-divider>   
                         <el-button size="mini" style="margin-left:30px;" icon="el-icon-search" @click="filterNotebook(notebook.name)" circle></el-button>
                         <el-button size="mini"  icon="el-icon-delete" @click="removeNotebook(notebook.id)" circle></el-button>
                        </div>
                    </el-card>
                        
                </el-scrollbar>
        </el-dialog>
        <el-dialog v-model="isTagIndexVisiable" v-bind:title="uiText.tags">
                <el-scrollbar height="340px" width="330px">
                    <el-tag type="info" style="margin-right:5px; margin-bottom:5px;" 
                    :id="tag.id" v-for="tag in existingTags" :key="tag.name" effect="plain" 
                    closable @close="removeTag(tag.id)">
                        <button style="background:transparent; border:0px;"><a @click="filterTag(tag.name)" plain> {{tag.name}}</a></button>
                    </el-tag>                        
                </el-scrollbar>
        </el-dialog>
        <el-dialog
            title="About"
            v-model="isAboutShown"
            width="30%"
            >
            <img src="./../assets/logo_new_transparent.png" height="180" width="180" />
            <p style="font-size:18px;">Catus Notebook Beta 0.2.2</p>
            <el-space size="10">
                <el-button plain>Website</el-button>
                <el-button plain>Github</el-button>
                <el-button plain>Help</el-button>
            </el-space>
        </el-dialog>

            
      </div>
      <div class="main-display">
           <div id="main-page"><MainPage :noteFilter="notefilter"/></div>
           <div id="calander-page"  hidden><CalendarPage/></div>
           <div id="setting-page"  hidden><SettingPage/></div>  
      </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import {Database} from '../databases/database';
import {Config} from '../databases/config';
import { NotebookItem }  from '../dataStructs/NotebookItem';
import { TagItem }  from '../dataStructs/TagItem';


import MainPage from './MainPage.vue';
import CalendarPage from './CalendarView.vue';
import SettingPage from './SettingPage.vue';

import bus from '../bus';
import anime from "animejs/lib/anime.es.js";
import {useI18n} from "vue-i18n"


//import element svg icons
import { Calendar,Delete,Notebook,Setting,Finished,Expand,More,TakeawayBox,CirclePlus
,Document,Collection,PriceTag,ArrowLeft,Close,Reading,DocumentCopy,Lollipop} from '@element-plus/icons'


@Options({
    components:{
        Calendar,
        Notebook,
        Setting,
        Finished,
        Expand,
        Delete,
        Document,
        DocumentCopy,
        Reading,
        More,
        Lollipop,
        Close,
        TakeawayBox,
        CirclePlus,
        Collection,
        ArrowLeft,
        PriceTag,
        MainPage,
        CalendarPage,
        SettingPage        
    }
})
export default class Frame extends Vue {
  
  //database connectors for notes and settings 
  db! : Database;
  localConfig! : Config;

  //init a random filter to fetch all notes 
  notefilter = "bulabula?bula"
  
  //switches to turn on notebook and tags 
  isNotebookIndexVisiable = false;
  isTagIndexVisiable = false;
  
  //switchs to update the menu buttons
  isNotArchive = true;
  isBackHomeBtnNeeded = false;

  //storage for exisitng notebook and tags
  existingNotebooks:NotebookItem[] = [];
  existingTags:TagItem[] = [];
  
  
  //language variables
  locale!: any
  t!:any

  uiText= {}
  
  //switch to show the about page
  isAboutShown = false;
 

  mounted() {
      
      //connect to databases
      this.db = new Database();
      this.localConfig = new Config();  
      
      //load the setting 
      this.loadSettings()  
      
      //set the languages
      const {locale,t} = useI18n();
      this.locale = locale;
      this.t = t; 
      this.getLocalizedStrings();

      //get all noteboos and tags   
      this.fetchNotebookList();
      this.fetchTagList();
      
      /**
       * Listener for event that update the notebook index
       */
      bus.on('update_notebook_list',()=> {
        this.$nextTick(() => {this.existingNotebooks = [];});
        this.$nextTick(() => {this.fetchNotebookList();})   
      });  

      /**
       * Listener for event that update the tag index
       */
      bus.on('update_tag_list',()=> {
        this.$nextTick(() => {this.existingTags = [];});
        this.$nextTick(() => {this.fetchTagList();})   
      });  

      /**
       * Listener for event that update the UI language 
       */
      bus.on('update_language',() => {
          this.getLocalizedStrings();
      })

    //   const {ipcRenderer} = require('electron');
    //   ipcRenderer.on('test_pass', (e,a)=> {
    //       console.log("test successul");
    //       window.alert("hi");
    //   })

  }
   
  /**
   * Get the localized strings for all labels 
   */
  public getLocalizedStrings() : void {
    this.uiText = {
      actions : this.t('menu.actions'),
      writing: this.t('menu.yourWriting'),
      cate : this.t('menu.yourCate'),
      notebooks:this.t('menu.notebooks'),    
      tags:this.t('menu.tags'),
      settings: this.t('menu.settings'),
      about:this.t('menu.about')
      }
  }  

  /**
    * Signal to add a new note 
    */
  public addNote() : void {
      bus.emit("add-note-event");    
  }
  
  /**
   * signal to remove all archived note 
   */
  public removeAllArchivedNote() : void {
    bus.emit("remove-all-archived-notes");
  }
 /**
  * Signal to show archived notes 
  */
  public showArchivedNotes() : void {
      this.switchToMain();
      this.isNotArchive = false;
      bus.emit('reload_notes_with_undo_note');
  }
  /**
   * Signal to show all notes 
   */
  public showAllNotes () : void {
      this.switchToMain();
      this.isNotArchive = true;
      bus.emit('reload_all_notes');
  }
  
  /**
   * fetch all notebooks available from the database 
   */
  public fetchNotebookList() : void {
      this.db.notebooks.toArray().then(notebooks => {
          notebooks.forEach(notebook => {
            this.existingNotebooks.push(new NotebookItem(
                  notebook.name,notebook.id
              ));
          })
      }).catch(e => {
          console.log(e)
      })
  } 

  /**
   * Remove a specifc notebook 
   * @param notebookid the id of the notebook to be deleted
   */
  public removeNotebook(notebookid : number) : void {
      this.db.notebooks.get(notebookid).then(res => {
          this.db.notebooks.delete(res!.id!).then(()=>{
              this.disappearAnime(String(notebookid));
              setTimeout(()=>{
                  this.removeNotebokLocal(notebookid);
              },700)
          }).catch(e => {
              console.log(e);
          });
      })
  }

  /**
   * Remove a specifc notebook locally (UI) 
   * @param notebookid the id of the notebook to be deleted
   */
  public removeNotebokLocal(notebookid:number) : void {
        
        var targetIndex = 0;
        var counter = 0;
        var toBeRemovedNotebookName = '';

        this.existingNotebooks.forEach(notebookItem => {
            if(notebookItem.id == notebookid){
                targetIndex = counter;
                toBeRemovedNotebookName = notebookItem.name;
            }
            else{
                counter += 1;
            } 
        })

        this.existingNotebooks.splice(targetIndex,1)
        this.existingNotebooks = [];
        this.fetchNotebookList();
        this.removeNotebookOnEachNote(toBeRemovedNotebookName);

  }

  /**
   * fetch all tags available from the database 
   */
  public fetchTagList() : void {
      this.db.tags.toArray().then(tags => {
          tags.forEach(tag => {
            this.existingTags.push(new TagItem(
                  tag.name,tag.id
              ));
          })
      }).catch(e => {
          console.log(e)
      })
  }  
  
  /**
   * Remove a specifc tag
   * @param tag id the id of the notebook to be deleted
   */
  public removeTag(tagid : number) : void {
      this.db.tags.get(tagid).then(res => {
          this.db.tags.delete(res!.id!).then(()=>{
              this.disappearAnime(String(tagid));
              setTimeout(()=>{
                  this.removeTagLocal(tagid);
              },700)
          }).catch(e => {
              console.log(e);
          });
      })
  }

  /**
   * Remove a specifc tag locally (UI)
   * @param tag id the id of the notebook to be deleted
   */
  public removeTagLocal(tagid:number) : void {
        
        var targetIndex = 0;
        var counter = 0;
        var toBeRemovedTagName = '';

        this.existingTags.forEach(tagItem => {
            if(tagItem.id == tagid){
                targetIndex = counter;
                toBeRemovedTagName  = tagItem.name;
            }
            else{
                counter += 1;
            } 
        })

        this.existingTags.splice(targetIndex,1)
        this.existingTags = [];
        this.fetchTagList();
        this.removeTagOnEachNote(toBeRemovedTagName);

  }

  /**
   * The deletion animation  
   */ 
  public disappearAnime(id:string) : void {

      var tobeDelNotebook = document.getElementById(id);
      anime({
        targets: tobeDelNotebook,
        opacity:[1,0],
        easing:'linear',
        duration:300
      })

  }

/**
 * Remove a specif tag from all nots 
 * @param tag the tag to be removed 
 */
  public removeTagOnEachNote(tag:string){
      
      bus.emit("remove-tag-on-note",(tag));
  }

 /**
 * Remove a specif notebook from all nots 
 * @param notebook the notebook to be removed 
 */
  public removeNotebookOnEachNote(notebook:string){
      bus.emit("remove-notebook-on-note",(notebook));
  }

 /**
  * Signal to filter the note with tag 
  * @param tag the tag to filter 
  */
  public filterTag(tag:string){
      bus.emit("filter-tag",(tag));
      this.isTagIndexVisiable = false;
  }

 /**
  * Signal to filter the note with notebook
  * @param notebook  the notebook to filter 
  */ 
 public filterNotebook(notebook : string){
      bus.emit("filter-notebook",(notebook));
      this.isNotebookIndexVisiable = false;
  }

  /**
   * Load settings from the configuration database
   */
  public loadSettings() : void {
     this.localConfig.configs.where('name').equals('entered').toArray().then((res) => {
         if(res.length == 0){
             this.localConfig.configs.add({name:'entered',value:'1'});
             this.localConfig.configs.add({name:'language',value:'en'});
         }
         else{
             this.localConfig.configs.where('name').equals('language').toArray().then(res => {
                 var language = res[0].value;
                 this.locale.value = language;
                   bus.emit('update_language');
                   bus.emit('update_language_calendar',(language));
                   bus.emit('update_language_selector_in_setting',(language));
             })
         }
     });
  }


// CODES FOR PAGE SWITCHING

  public switchToCalander() : void { 
      this.isBackHomeBtnNeeded = true;
      bus.emit('load_full_calendar');
      document.getElementById('main-page')!.hidden = true;
      document.getElementById('calander-page')!.hidden = false;
      document.getElementById('setting-page')!.hidden = true;
  }

  public switchToMain() : void { 
      this.isBackHomeBtnNeeded = false;
      document.getElementById('main-page')!.hidden = false;
      document.getElementById('calander-page')!.hidden = true;
      document.getElementById('setting-page')!.hidden = true;
  }

  public switchToSetting() : void { 
      this.isBackHomeBtnNeeded = true;
      document.getElementById('main-page')!.hidden = true;
      document.getElementById('calander-page')!.hidden = true;
      document.getElementById('setting-page')!.hidden = false;
  }

/**
 * Open the license window 
 */
  public openLicense() : void {
      const {BrowserWindow} = require('electron').remote;
      
      var win = new BrowserWindow({
          title:"License",
          height:500,
          width:700,
      });

        var pathPrefix = process.resourcesPath;
        const isDev = process.env.NODE_ENV !== 'production';
        if(isDev){
          pathPrefix = "file://../..";
        }

      win.loadFile(pathPrefix + '/license/index.html');
  }

/**
 * close the application 
 */
  public shutDown() : void{
    const {BrowserWindow} = require('electron').remote;  

    var window = BrowserWindow.getFocusedWindow();
    window!.close();
  }





}
</script>

<style>
/* Override the original menu style */
.el-menu{
    --el-menu-item-font-size: var(--el-font-size-base);
    --el-menu-item-font-color: var(--el-text-color-primary);
    --el-menu-item-hover-fill: #C6E8EC;
    --el-menu-background-color: var(--el-color-white);
    --el-menu-border-color: white;
    border-right: solid 1px var(--el-menu-border-color);
    list-style: none;
    position: relative;
    margin: 0;
    padding-left: 0;
    background-color: var(--el-menu-background-color);
    box-sizing: border-box
}
</style>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.window-control-bar{
    height: 30px;
    width:922px;
    background: white;
    position: relative;
    left:50px;
    bottom:25px;
    z-index: 2;
   -webkit-user-select: none;
   
}

.drag-area{
    height: 30px;
    width: 780px;
    color: blue;
    position: absolute;
    bottom: 2px;
    left: 30px;
    z-index: 100;
    -webkit-app-region: drag; 
}
.exit-btn{
    height: 30px;
    width: 30px;
    background: white;
    position: absolute;
    left:892px;
    top:14px;

}

.exit-btn:hover{
    height: 30px;
    width: 30px;
    background: red;
    position: absolute;
    left:892px;
}



.exit-sign{
    position: relative;
    top:3px;
    left:3px;
}


/* style for the main frame */
.mainFrame{
    height: 645px;
    width: 890px;
    background: white;
    position: absolute;
    
}

/* styles for the side navi bar */
.side-bar{
    width:60px;
    height:670px;
    float:left;
    position: relative;
    right: 10px;    
    background:white;
}

.side-nav-bar{
    width: 60px;
    height: 725px;
    position: absolute;
    bottom: -15px;
    background:#7FCBD3;
}

.main-display{
    position: relative;
    left:50px;
    width: 900px;
    height: 100%;
}

.add-note-btn{
    position: relative;
}


/* notebook index style */
.notebook-card{
    height: auto;
}
</style>


