<template>
  <div class="mainFrame">
      <div class="window-control-bar"></div>
      <div class="side-bar">

        <el-menu
                class="side-nav-bar"
                collapse="false"
                default-active="1"
                @open="handleOpen"
                @close="handleClose"
                >
                <el-sub-menu index="1">
                    <template #title>
                    <el-icon :size="20" ><notebook/></el-icon> 
                    <span>Browse</span>
                    </template>
                    <el-menu-item-group title="Your writings">
                    <el-menu-item index="1-1"><i class="el-icon-document"></i><span>Notes</span></el-menu-item>
                    <el-menu-item index="1-2"><i class="el-icon-folder-checked"></i><span>Achived</span></el-menu-item>
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
           <MainPage/> 
      </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import {Database} from '../database';
import MainPage from './MainPage.vue';

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


  mounted() {
      this.db = new Database();
  }


  public async addNote() : Promise<void> {
      
      var time = new Date();

      this.db.notes.add({content: "This is a test message", tag:"first class",notebook:"my daily life", date: time.getTime(), isdone:1},).then(() => {
          alert("sucess")
      }).catch(e => {
          console.log(e)
      });

    // var tmp = this.db.notes.where('tag').equals('first class').toArray().then((data) =>{
    //     alert(data[0].content)
    // });
   

    
    
  }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.mainFrame{
    height: 605px;
    width: 100%;
    background: white;
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
