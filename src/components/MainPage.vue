<template>
  <div class="mainWindow">
      <div class="note-display-area">
          <el-scrollbar height="500px" class="note-container">

            <Note/>  
            <Note/> 
          </el-scrollbar>
 
      </div>
      <div class="note-timeline-area"></div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import Note from './Note.vue';


@Options({
    components:{
      Note
    }
})




export default class MainPage extends Vue {
  msg!: string

  public testRes() : void {
    window.alert("test");
  }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.mainWindow{
    height: 610px;
    width: 100%;
    background: green;
}

.note-display-area{
  position: relative;
  height: 610px;
  width: 600px;
  background:white;
}

.note-timeline-area{
  position: relative;
  height: 610px;
  width: 300px;
  bottom: 610px;
  left: 600px;
  background: yellow;

}

.notes{
  width: 500px;
  position: relative;
  right:-30px;
}

.note-container{
  width: 600px;
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



</style>
