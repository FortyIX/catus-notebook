<template>
<el-card class="notes" shadow="always">
                 

    <span class="notes-text"><p align="left">{{contents}}</p></span>
    <div class="card-header note-opt">
                      
        <span style="font-size:13px;"> <el-icon style="width: 2em; height: 2em; margin-right: 5px;" @click="testRes"><circle-check-filled /></el-icon>
          <el-popover placement="bottom" :width="400" trigger="click">
            <template #reference>
                <el-icon style="width: 2em; height: 2em; margin-right: 5px;"><price-tag /></el-icon>
            </template>
            <el-space wrap>
              <el-tag type="info" v-for="tag in tagsHolder" :key="tag" effect="plain" closable>{{tag}}</el-tag>  
            </el-space> 
          </el-popover>

          <el-popover placement="bottom" :width="400" trigger="click">
            <template #reference>
                <el-icon style="width: 2em; height: 2em; margin-right: 5px;"><timer/></el-icon>
            </template>
                {{dateDisplay}}
          </el-popover>
        </span>
      
    </div>

    </el-card>
    <br/>
</template>

      
<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { CircleCheckFilled,CaretBottom,PriceTag,Timer} from '@element-plus/icons';
import dayjs from 'dayjs';
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

  //props 
  date! : number;
  tag!:string;

  //prop wrapper (kind of)
  dateDisplay! : string;
  tagsHolder : string[] = [];

  mounted() {
    this.dateDisplay= dayjs(this.date).format('h:m A DD-MM-YYYY');
    this.parseTags()
  }
  

  public parseTags() : void {
    this.tag.split('-').forEach(tag => {
      this.tagsHolder.push(tag)
    })

 
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
