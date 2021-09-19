<template>
<div ref="editor" style="text-align:left;">
</div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import bus from '../bus';
import E from "wangeditor";

  @Options({

    props: {
      loadedContent : String,
      assignedNote : Number,
    }

  })
export default class Editor extends Vue {
  loadedContent!:string;
  htmlContent!:string;
  assignedNote! : number;
  
  mounted(){
    
    bus.on('get_editing_content_signal',(id) => {
        
        var noteID:any = id;
        this.sendBackHtml(noteID);
    })
    

    var ele: any = this.$refs.editor;
    const editorArea = new E(ele);
    editorArea.config.height = 500;
    editorArea.config.onchange = (html:string) => {
        this.htmlContent = html;
    }
    editorArea.create();
    editorArea.txt.html(this.loadedContent);
  }

  public sendBackHtml(noteID : number) : void {
     if(noteID == this.assignedNote){
        bus.emit('transfer_editing'+String(this.assignedNote),(this.htmlContent));
     }
  }


}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>



</style>
