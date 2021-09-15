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
                    <el-menu-item index="1-3"><i class="el-icon-reading"></i><span>Notebooks</span> 
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

            
      </div>
      <div class="main-display">
           <MainPage :noteFilter="notefilter" v-if="isNoteDisplayVisible"/> 
      </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import {Database} from '../database';
import MainPage from './MainPage.vue';
import bus from '../bus'

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


  mounted() {
      this.db = new Database();
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
</style>
