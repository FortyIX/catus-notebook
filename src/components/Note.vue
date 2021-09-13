<template>
<el-card class="notes" shadow="always">
                 

    <span v-if="!isEditingContent" class="notes-text"><p align="left" v-html="contentParsed"></p></span>
    <el-input v-else type="textarea" v-model="editingContent"></el-input>
    <br/>
    <div class="card-header note-opt">
                      
        <span style="font-size:13px;"> 
          
          <el-icon v-if="!isEditingContent" style="width: 2em; height: 2em; margin-right: 5px;" ><circle-check-filled /></el-icon>
          <el-icon v-if="isEditingContent" style="width: 2em; height: 2em; margin-right: 5px;" @click="updateNote" ><circle-check-filled /></el-icon>
          <el-popover v-if="!isEditingContent" placement="bottom" :width="400" trigger="click">
            <template #reference>
                <el-icon  style="width: 2em; height: 2em; margin-right: 5px;"><price-tag /></el-icon>
            </template>
            <el-space wrap>
              <el-tag type="info" v-for="tag in tagsHolder" :key="tag" effect="plain" @close="removeTag(tag)" closable>{{tag}}</el-tag>  
              <el-input class="add-new-tag-tag" v-if="isAddingNewTag" v-model="newTagData" size="mini"  @keyup.enter="confirmInputHandler" @blur="confirmInputHandler"></el-input>
              <el-button v-else class="add-new-tag-btn" size="small" @click="enableNewTagInput">+</el-button>
            </el-space> 
          </el-popover>
          <el-popover v-if="!isEditingContent" placement="bottom" :width="400" trigger="click">
            <template #reference>
                <el-icon  style="width: 2em; height: 2em; margin-right: 5px;"><notebook /></el-icon>
            </template>   
          </el-popover>

          <el-popover v-if="!isEditingContent" placement="bottom" :width="400" trigger="click">
            <template #reference>
                <el-icon  style="width: 2em; height: 2em; margin-right: 5px;"><timer/></el-icon>
            </template>
                {{dateDisplay}}
          </el-popover>
          <el-icon style="width: 1em; height: 1em;" :size="15" @click="editContent"><edit/></el-icon>

        </span> 
      
    </div>

    </el-card>
    <br/>
</template>

      
<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { CircleCheckFilled,CaretBottom,PriceTag,Timer,Notebook,Edit} from '@element-plus/icons';
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
      Timer,
      Notebook,
      Edit
    }
})



export default class Main extends Vue {

  //props 
  date! : number;
  tag!:string;
  contents! : string
  

  //prop wrapper (kind of)
  dateDisplay! : string;
  tagsHolder : string[] = [];
  contentParsed! : string;


  isEditingContent = false;
  editingContent = '';

  isAddingNewTag = false;
  newTagData = '';

  created(){
        this.contentParsed = this.contents;
        this.editingContent = this.contentParsed;
  }
  mounted() {
    this.dateDisplay= dayjs(this.date).format('h:m A DD-MM-YYYY');

    this.parseTags()
  }

  public removeTag(selectedTag : string) : void {
    this.tagsHolder.splice(this.tagsHolder.indexOf(selectedTag),1)
  } 
  
  public enableNewTagInput() : void {
    this.isAddingNewTag = true;
    // this.$nextTick(() => {
    //   this.$refs.addNewTag.$refs.input.focus()
    // })
  }

  public confirmInputHandler() : void {
     var newTagDataValidator = this.newTagData;
     if(newTagDataValidator){
       this.tagsHolder.push(newTagDataValidator)
     }
     this.isAddingNewTag = false;
     this.newTagData = '';
  }

  public editContent() : void {
    this.isEditingContent = !this.isEditingContent;
  }


  public parseTags() : void {
    this.tag.split('-').forEach(tag => {
      this.tagsHolder.push(tag)
    })
  }

  public updateNote(): void {
    this.contentParsed = this.editingContent;
    this.isEditingContent = false;
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

.add-new-tag-tag{
  width:70px;
  vertical-align: bottom;
}




</style>
