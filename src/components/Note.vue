<template>
<el-card class="notes" shadow="always">
                 

    <span class="notes-text"><p align="left">Go to buy some stuff tomorrow, and wait until it finishes. Please do not go back until I call you to do so. Please do follow our rules otherwise you migh find it difficult to perform what you wish to do</p></span>
    <div class="card-header note-opt">
                      
        <span style="font-size:13px;"> <el-icon style="width: 2em; height: 2em; margin-right: 5px;" @click="testRes"><circle-check-filled /></el-icon>
        <el-icon style="width: 2em; height: 2em; margin-right: 5px;"><caret-bottom/></el-icon>
        </span>
      
    </div>

    </el-card>
    <br/>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { CircleCheckFilled,CaretBottom} from '@element-plus/icons'

@Options({
    components:{
      CircleCheckFilled,
      CaretBottom
    }
})




export default class Main extends Vue {
  msg!: string

  public testRes() : void {
    window.alert("test2");
  }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

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
