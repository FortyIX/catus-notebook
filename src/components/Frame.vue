<template>
  <div class="mainFrame">
      <div class="window-control-bar"></div>
      <div class="side-bar">

        <el-menu
                class="side-nav-bar"
                :collapse="true"
                background-color="#002060"
                text-color="white"
                active-text-color="white"
                default-active="1"
                >
                <el-sub-menu index="1">
                    <template #title>
                    <el-icon style="width: 14px; height: 14px; margin-right: 0px; color:#ffffff;"   :size="20"><notebook/></el-icon> 
                    <span>Browse</span>
                    </template>
                    <el-menu-item-group title="Actions">
                        <el-menu-item index="1-1" @click="addNote"><el-icon style="height: 5px; margin-right: 5px; margin-bottom:20px; color:#ffffff;" :size="20"><plus /></el-icon> <span>Add a new note</span></el-menu-item>
                    
                    </el-menu-item-group>
                    <el-menu-item-group title="Your writings">
                        <el-menu-item index="1-1" @click="showAllNotes"><el-icon style="height: 5px; margin-right: 5px; margin-bottom:20px; color:#ffffff;" :size="20"><document /></el-icon>
      <span>Notes</span></el-menu-item>
                        <el-menu-item index="1-2" @click="showArchivedNotes"><el-icon style="height: 5px; margin-right: 5px; margin-bottom:20px; color:#ffffff;" :size="20"><takeaway-box /></el-icon>
      <span>Archive</span></el-menu-item>
                    </el-menu-item-group>
                    <el-menu-item-group title="Your categories">
                        <el-menu-item index="1-3" @click="isNotebookIndexVisiable=true"><el-icon style="height: 5px; margin-right: 5px; margin-bottom:20px; color:#ffffff;" :size="20"><collection /></el-icon><span>Notebooks</span> 
                    </el-menu-item>
                    <el-menu-item index="1-4" @click="isTagIndexVisiable=true"><el-icon style="height: 5px; margin-right: 5px; margin-bottom:20px; color:#ffffff;" :size="20"><price-tag /></el-icon><span>Tags</span></el-menu-item>
                    </el-menu-item-group>
                </el-sub-menu>
                <el-menu-item index="2">
                    <el-icon style="width: 14px; height: 14px; margin-right: 0px; color:#ffffff;" :size="20"><calendar /></el-icon> 
                    <span>Navigator Two</span>
                </el-menu-item>
                <el-menu-item index="3">
                    
                    <el-icon style="width: 14px; height: 14px; margin-right: 0px; color:#ffffff;" :size="20"><more /></el-icon>
                    <span>Navigator Three</span>
                </el-menu-item>
                <el-menu-item index="4">
                    <el-icon style="width: 14px; height: 14px; margin-right: 0px; color:#ffffff;" :size="20"><setting/></el-icon>
                    <span>Navigator Four</span>
                </el-menu-item>


        </el-menu>
        <el-dialog title="Notebook" v-model="isNotebookIndexVisiable">
                <el-scrollbar height="340px" width="330px">
                    <el-card :id="notebook.id" class="notebook-card" style="margin-bottom:10px;" v-for="notebook in existingNotebooks" :key="notebook.name">
                         <span style="margin-right:50px; position:relative; top:5px;">{{notebook.name}}</span> 
                        <div class="control-region" style="float:right; margin-bottom:20px;"> 
                         <el-divider direction="vertical"></el-divider>   
                         <el-button size="mini" style="margin-left:30px;" icon="el-icon-search" circle></el-button>
                         <el-button size="mini"  icon="el-icon-delete" @click="removeNotebook(notebook.id)" circle></el-button>
                        </div>
                    </el-card>
                        
                </el-scrollbar>
        </el-dialog>
        <el-dialog title="Tags" v-model="isTagIndexVisiable">
                <el-scrollbar height="340px" width="330px">
                    <el-tag type="info" style="margin-right:5px; margin-bottom:5px;" 
                    :id="tag.id" v-for="tag in existingTags" :key="tag.name" effect="plain" 
                    closable @close="removeTag(tag.id)">
                        <button @click= "filterTag(tag.name)"> {{tag.name}}</button>
                    </el-tag>                        
                </el-scrollbar>
        </el-dialog>

            
      </div>
      <div class="main-display">
           <MainPage :noteFilter="notefilter" v-if="isNoteDisplayVisible"/> 
      </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import {Database} from '../database';
import { NotebookItem }  from '../NotebookItem';
import { TagItem }  from '../TagItem';
import MainPage from './MainPage.vue';
import bus from '../bus';
import anime from "animejs/lib/anime.es.js";

//import element svg icons
import { Calendar,Notebook,Setting,Finished,Edit,More,TakeawayBox,Plus,Collection,Document,PriceTag} from '@element-plus/icons'

@Options({
    components:{
        Calendar,
        Notebook,
        Setting,
        Finished,
        Edit,
        More,
        TakeawayBox,
        Plus,
        Collection,
        Document,
        PriceTag,
        MainPage,
        
    }
})
export default class Frame extends Vue {
  
  db! : Database;
  notefilter = "bulabula?bula"
  isNoteDisplayVisible = true;

  isNotebookIndexVisiable = false;
  isTagIndexVisiable = false;

  existingNotebooks:NotebookItem[] = [];
  existingTags:TagItem[] = [];


  mounted() {
      this.db = new Database();
      this.fetchNotebookList();
      this.fetchTagList();
    
      bus.on('update_notebook_list',()=> {
        this.$nextTick(() => {this.existingNotebooks = [];});
        this.$nextTick(() => {this.fetchNotebookList();})   
      })  

      bus.on('update_tag_list',()=> {
        this.$nextTick(() => {this.existingTags = [];});
        this.$nextTick(() => {this.fetchTagList();})
        
      })  
  }
  
  public reloadNoteDisplayPage() : void {

     this.isNoteDisplayVisible = false;
     this.$nextTick(() => (this.isNoteDisplayVisible = true))
  
  }

  public addNote() : void {
      bus.emit("add-note-event")    
  }

  public showArchivedNotes() : void {
      this.notefilter = "archive?*";
      this.reloadNoteDisplayPage();
  }
  public showAllNotes () : void {
      this.notefilter = "note?*";
      this.reloadNoteDisplayPage();   
  }
  
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
  
  public disappearAnime(id:string) : void {

      var tobeDelNotebook = document.getElementById(id);
      anime({
        targets: tobeDelNotebook,
        opacity:[1,0],
        easing:'linear',
        duration:300
      })

  }

  public removeTagOnEachNote(tag:string){
      bus.emit("remove-tag-on-note",(tag));
  }

  public removeNotebookOnEachNote(notebook:string){
      bus.emit("remove-notebook-on-note",(notebook));
  }

  public filterTag(tag:string){
      console.log("claled")
      bus.emit("filter-tag",(tag));
  }

  public filterNotebook(notebook : string){
      bus.emit("filter-notebook",(notebook));
      this.isTagIndexVisiable = false;
  }



}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.mainFrame{
    height: 635px;
    width: 910px;
    background: white;
    position: absolute;
    
}

.side-bar{
    width:60px;
    height:668px;
    float:left;
    position: relative;
    right: 10px;    
    background:white;
}

.side-nav-bar{
    width: 60px;
    height: 685px;
    position: absolute;
    bottom: 0px;
    background:white;
}

.main-display{
    position: relative;
    left:50px;
    width: 900px;
    height: 100%;
    background: cyan;
}

.add-note-btn{
    position: relative;
}


.notebook-selector{
    margin-bottom: 10px;;
}

.notebook-card{
    height: auto;
}
</style>
