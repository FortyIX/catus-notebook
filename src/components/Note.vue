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
              <el-input class="add-new-tag-tag" v-if="isAddingNewTag" v-model="newTagData" size="mini"  @keyup.enter="confirmInputHandlerforTag" @blur="confirmInputHandlerforTag"></el-input>
              <el-button v-else class="add-new-tag-btn" size="small" @click="enableNewTagInput">+</el-button>
            </el-space> 
          </el-popover>
          <el-popover v-if="!isEditingContent" placement="bottom" :width="400" trigger="click">
            <template #reference>
                <el-icon  style="width: 2em; height: 2em; margin-right: 5px;"><notebook /></el-icon>
            </template>
            <el-space wrap>
              <el-tag type="info" v-for="notebook in notebooksHolder" :key="notebook" effect="plain" @close="removeNotebook(note)" closable>{{notebook}}</el-tag>  
              <el-input class="add-new-tag-tag" v-if="isAddingNewNotebook" v-model="newNotebookData" size="mini"  @keyup.enter="confirmInputHandlerforNotebook" @blur="confirmInputHandlerforNotebook"></el-input>
              <el-button v-else class="add-new-tag-btn" size="small" @click="enableNewNotebookInput">+</el-button>   
            </el-space>
          </el-popover>

          <el-popover v-if="!isEditingContent" placement="bottom" :width="400" trigger="click">
            <template #reference>
                <el-icon  style="width: 2em; height: 2em; margin-right: 5px;"><timer/></el-icon>
            </template>
                {{dateDisplay}}
          </el-popover>
          <el-icon v-if="!isEditingContent" style="width: 1em; height: 1em;" :size="15" @click="editContent"><edit/></el-icon>

        </span> 
      
    </div>

    </el-card>
    <br/>
</template>

      
<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { CircleCheckFilled,CaretBottom,PriceTag,Timer,Notebook,Edit} from '@element-plus/icons';
import {Database} from '../database'
import dayjs from 'dayjs';

@Options({

    props:{
        contents : String,
        tag : String,
        notebook : String,
        date:Number,
        isdone:Number,
        id: Number
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
  notebook! : string
  contents! : string
  id! : number;
  

  //prop wrapper (kind of)
  dateDisplay! : string;
  tagsHolder : string[] = [];
  notebooksHolder : string[] = [];
  contentParsed! : string;


  isEditingContent = false;
  editingContent = '';

  isAddingNewTag = false;
  isAddingNewNotebook = false;
  newTagData = '';
  newNotebookData = '';

  db! : Database;



  created(){
 
    this.contentParsed = this.contents;
    this.editingContent = this.contentParsed;
  }
  mounted() {
    //connect to the database 
    this.db = new Database();  

    this.dateDisplay= dayjs(this.date).format('h:m A DD-MM-YYYY');

    this.parseNotebooks()
    this.parseTags()
  }

  public removeTag(selectedTag : string) : void {
    this.tagsHolder.splice(this.tagsHolder.indexOf(selectedTag),1);
    this.updateTags();
  } 


  public removeNotebook(selectedNote : string) : void {
    this.notebooksHolder.splice(this.notebooksHolder.indexOf(selectedNote),1);
    this.updateNotebooks();
  } 

  
  public enableNewTagInput() : void {
    this.isAddingNewTag = true;
  }
  
  public enableNewNotebookInput() : void {
    this.isAddingNewNotebook = true;
  }

  public confirmInputHandlerforTag() : void {
     var newTagDataValidator = this.newTagData;
     if(newTagDataValidator){
       this.tagsHolder.push(newTagDataValidator)
     }
     this.isAddingNewTag = false;
     this.newTagData = '';

     this.updateTags();
  }

  public confirmInputHandlerforNotebook() : void {
     var newNotebookDataValidator = this.newNotebookData;
     if(newNotebookDataValidator){
       this.notebooksHolder.push(newNotebookDataValidator)
     }
     this.isAddingNewNotebook = false;
     this.newNotebookData = '';

     this.updateNotebooks();
  }



  public editContent() : void {
    this.isEditingContent = !this.isEditingContent;
  }


  public parseTags() : void {
    console.log(this.tag)

    var tagLists = this.tag.split('-');
    if (tagLists.length > 0 ){
     tagLists.forEach(tag => {
      if(tag.length > 0){
        this.tagsHolder.push(tag);
      }
    })
    }


  }

  public parseNotebooks() : void {

    var notebookLists = this.notebook.split('-');
    if (notebookLists.length > 0){
     notebookLists.forEach(notebook => {
      if(notebook.length > 0){ 
        this.notebooksHolder.push(notebook);
      }
    });
    }

  }

  public updateNote(): void {

    //import the markdown parser
    const marked = require('marked')

    //parse the plain text into markdown and update the UI
    this.contentParsed = marked(this.editingContent);

    //hide the edit form 
    this.isEditingContent = false;

    this.db.notes.update(this.id, {content: this.contentParsed}).catch(e => {console.log(e)});

  }

  public updateNotebooks() : void {
    var notebookString = '';

    //combine all notebooks into a string with a spilter -
    this.notebooksHolder.forEach(notebook => {
      notebookString += notebook + '-'
    })

    //remove the extra - at the end 
    notebookString = notebookString.substring(0,notebookString.length-1);
    
    //update the database 
    this.db.notes.update(this.id, {notebook: notebookString});
  }

  public updateTags() : void {
    var tagString = '';

    //combine all tags into a string with a spilter -
    this.tagsHolder.forEach(tag => {
      tagString += tag + '-'
    })

    //remove the extra - at the end 
    tagString = tagString.substring(0,tagString.length-1);
    
    //update the database 
    console.log(this.id)
    this.db.notes.update(this.id, {tag: tagString});

  }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.notes{
  width: 850px;
  position: relative;
  right:-30px;
}

.note-container{
  width: 950px;
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
