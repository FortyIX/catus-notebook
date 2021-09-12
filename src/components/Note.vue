<template>
<el-card class="notes" shadow="always">
                 

    <span class="notes-text"><p align="left">Go to buy some stuff tomorrow, and wait until it finishes. Please do not go back until I call you to do so. Please do follow our rules otherwise you migh find it difficult to perform what you wish to do</p></span>
    <div class="card-header note-opt">
                      
        <span style="font-size:13px;"> <el-icon style="width: 2em; height: 2em; margin-right: 5px;" @click="testRes"><circle-check-filled /></el-icon>
          <el-popover placement="bottom" :width="400" trigger="click">
            <template #reference>
                <el-icon style="width: 2em; height: 2em; margin-right: 5px;"><price-tag /></el-icon>
            </template>
            <el-tag type="success">Tag 2</el-tag> <el-tag type="success">Tag 2</el-tag>     
          </el-popover>

          <el-popover placement="bottom" :width="400" trigger="click">
            <template #reference>
                <el-icon style="width: 2em; height: 2em; margin-right: 5px;"><timer/></el-icon>
            </template>
                2015
          </el-popover>
        </span>
      
    </div>

    </el-card>
    <br/>
</template>

      
<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { CircleCheckFilled,CaretBottom,PriceTag,Timer} from '@element-plus/icons'

@Options({

    props:{
        contents : String,
        tag : String,
        notebook : String,
        date:Number,
        isdone:Number
    },
    components:{
      CircleCheckFilled,
      CaretBottom,
      PriceTag,
      Timer
    }
})




export default class Main extends Vue {

  scheduledTime!: string

  shortcut: unknown = [
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
            text: '1 hour later',
            value: () => {
              const date = new Date()
              date.setTime(date.getTime() + 3600 * 1000 * 1)
              return date
            },
          },
        ];



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
