<template>
<div v-if="isNote">
 <Note  :contents="contents" :submitDate="submitDate" :tag="tag" :notebook="notebook" :date="date" :isdone="isdone" :id="id" />     
</div>
<div v-if="isGroup">
  <Group  :contents="contents" :submitDate="submitDate" :tag="tag" :notebook="notebook" :date="date" :reminderMsg="reminderMsg"  :isdone="isdone" :id="id" />  
</div>
</template>

      
<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import Group from './Group.vue'
import Todo from './Todo.vue'
import Note from './Note.vue'


@Options({

    props:{
        contents : String,
        submitDate:String,
        tag : String,
        notebook : String,
        date:Number,
        reminderMsg:String,
        isdone:Number,
        id: Number,
        isShowingAddedDate:Boolean,
        type:Number
    },
    components:{
      Group,
      Note
    }
})




export default class Card extends Vue {
  
  //props 
  date! : number;
  submitDate!:string;
  reminderMsg! : string;
  tag!:string;
  notebook! : string;
  contents! : string;
  id! : number;
  isdone!:number;
  isShowingAddedDate!:boolean;
  type!:number;
  
  
  isNote = false;
  isGroup = true;

  mounted() {
    switch(this.type){
      case 0 :
        this.initAsGroup();
        break;
      case 1:
        this.initAsNote();
        break;
      default:
        this.initAsNote();
        break;
    }
  }

  public initAsGroup() : void {
      this.isNote = false;
      this.isGroup = true; 
  }  
  public initAsNote() : void {
    this.isNote = true;
    this.isGroup = false;
  }



}


</script>

<style scoped>


</style>
