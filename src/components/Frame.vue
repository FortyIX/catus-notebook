<template>
  <div class="mainFrame">
      <div class="window-control-bar"></div>
      <div class="side-bar">

        <el-menu
                class="side-nav-bar"
                :collapse="true"
                default-active="1"
                >
                <el-sub-menu index="1">
                    <template #title>
                    <el-icon :size="20" ><notebook/></el-icon> 
                    <span>Browse</span>
                    </template>
                    <el-menu-item-group title="Your writings">
                    <el-menu-item index="1-1" @click="showAllNotes"><i class="el-icon-document"></i><span>Notes</span></el-menu-item>
                    <el-menu-item index="1-2" @click="showArchivedNotes"><i class="el-icon-folder-checked"></i><span>Archive</span></el-menu-item>
                    </el-menu-item-group>
                    <el-menu-item-group title="Your categories">
                    <el-menu-item index="1-3" @click="isNotebookIndexVisiable=true"><i class="el-icon-reading"></i><span>Notebooks</span> 
                    </el-menu-item>
                    <el-menu-item index="1-4"><i class="el-icon-price-tag"></i><span>Tags</span></el-menu-item>
                    </el-menu-item-group>
                    <el-sub-menu index="1-4">
                    <template #title>item four</template>
                    <el-menu-item index="1-4-1">item one</el-menu-item>
                    </el-sub-menu>
                </el-sub-menu>
                <el-menu-item index="2">
                    <el-icon :size="20"><calendar /></el-icon>
                    <span>Navigator Two</span>
                </el-menu-item>
                <el-menu-item index="3">
                    
                    <i class="el-icon-document"></i>
                    <span>Navigator Three</span>
                </el-menu-item>
                <el-menu-item index="4">
                    <el-icon :size="20"><setting/></el-icon>
                    <span>Navigator Four</span>
                </el-menu-item>

                <el-button class="add-note-btn" circle @click="addNote">
                        <el-icon style="width: 1em; height: 1em;" :size="15"><edit/></el-icon>
                </el-button>

        </el-menu>
        <el-dialog title="Your notebook" v-model="isNotebookIndexVisiable">
                <el-scrollbar height="340px" width="330px">
                    <el-card :id="notebook.id" class="notebook-card" style="margin-bottom:10px;" v-for="notebook in existingNotebooks" :key="notebook.name">
                         <span style="margin-right:50px;">{{notebook.name}}</span>  <el-divider direction="vertical"></el-divider>   
                         <el-button size="mini" style="margin-left:30px;" icon="el-icon-search" circle></el-button>
                         <el-button size="mini"  icon="el-icon-delete" @click="removeNotebook(notebook.id)" circle></el-button>
                    </el-card>
                        
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
import MainPage from './MainPage.vue';
import bus from '../bus';
import anime from "animejs/lib/anime.es.js";

//import element svg icons
import { Calendar,Notebook,Setting,Finished,Edit} from '@element-plus/icons'

@Options({
    components:{
        Calendar,
        Notebook,
        Setting,
        Finished,
        Edit,
        MainPage,
        
    }
})
export default class Frame extends Vue {
  
  db! : Database;
  notefilter = "bulabula?bula"
  isNoteDisplayVisible = true;
  isNotebookIndexVisiable = false;

  existingNotebooks:NotebookItem[] = [];


  mounted() {
      this.db = new Database();
      this.fetchNotebookList();

      bus.on('update_notebook_list',()=> {
          this.existingNotebooks = [];
          this.fetchNotebookList();
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
                  notebook.notebook,notebook.id
              ));
          })
      })
  } 

  public removeNotebook(notebookid : number) : void {
      this.db.notebooks.get(notebookid).then(res => {
          this.db.notebooks.delete(res!.id!).then(()=>{
              this.disappearAnime(String(notebookid));
              setTimeout(()=>{
                  this.removeNotebokLocal(notebookid);
              },400)
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
  
  public disappearAnime(id:string) : void {

      var tobeDelNotebook = document.getElementById(id);


      anime({
        targets: tobeDelNotebook,
        opacity:[1,0],
        easing:'linear',
        duration:300
      })

  }

  public removeNotebookOnEachNote(notebook:string){
      bus.emit("remove-notebook-on-note",(notebook));
  }



}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.mainFrame{
    height: 655px;
    width: 100%;
    background: red;
    position: relative;
}


.side-bar{
    width:200px;
    height:100%;
    float:left;
}

.side-nav-bar{
    width: 60px;
    height: inherit;
    position: absolute;
}

.main-display{
    position: relative;
    left:50px;
    width: 900px;
    height: 100%;
    background: green;
}

.add-note-btn{
    position: relative;
    top:300px;
}


.notebook-selector{
    margin-bottom: 10px;;
}

.notebook-card{
    height: auto;
}
</style>
