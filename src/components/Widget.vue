<template>
<div v-if="isNote">
    <Note :contents="content" :id="id"/>     
</div>
<div v-if="isTodo">
    <Todo :contents="content" :id="id"/>
</div>
</template>

      
<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import Note from './Note.vue'
import Todo from './Todo.vue'

@Options({

    props:{
        content:String,
        id:String,
        type:Number,
    },
    components:{
        Note,
        Todo
    }
})



export default class Widget extends Vue {
  
  //props
  content!:string;
  id!:string;
  type!:number;
  
  
  isNote = true;
  isTodo = false;

  mounted() {
      switch(this.type){
          case 0 :
              this.initAsNote();
              break;
          case 1:
              this.initAsTodo();
              break;
          default:
              this.initAsNote();
              break;
              

      }
  }

  public initAsNote() : void {
      this.isNote = true;
      this.isTodo = false; 
  }  

  public initAsTodo() : void {
      this.isNote = false;
      this.isTodo = true;
  }

}


</script>

<style scoped>


</style>
