<template>
<div :key="nRender" ref="editor" style="text-align:left;">
</div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import bus from '../bus';
import E from "wangeditor";
import i18next from 'i18next';

  @Options({

    props: {
      loadedContent : String,
      assignedNote : Number,
    }

  })
export default class Editor extends Vue {
  
  //content of the notes 
  loadedContent!:string;

  //html of the contnet 
  htmlContent!:string;

  //the note which this editor works for 
  assignedNote! : number;

  //editor instance 
  editorArea! : E;

  //reRendering variable 
  nRender = 0;
  mounted(){

    /**
     * Listener for the event that request content of the editor 
     * @param id the id of note who send the request
     */
    bus.on('get_editing_content_signal',(id) => {
        
        var noteID:any = id;
        this.sendBackHtml(noteID);
    });

    // bus.on('update_language_editors',(lang:any) => {
       
    //   if(lang == 'cn'){
    //     var lan = "zh-CN";
    //     console.log("here")
    //     this.editorArea.config.lang = lan;
    //     this.editorArea.i18next = i18next;
    //     this.editorArea.create();
    //   }
      
    // })
    
    /// Configs for the editor
    var ele: any = this.$refs.editor;
    this.editorArea = new E(ele);
    this.editorArea.config.height = 500;
    this.editorArea.config.showMenuTooltips = false;
    this.editorArea.config.lang= 'en'
    this.editorArea.i18next = i18next;
    this.editorArea.config.onchange = (html:string) => {
        this.htmlContent = html;
    }

    //Show the editor and loads the contents 
    this.editorArea.create();
    this.editorArea.txt.html(this.loadedContent);
  }

  /**
   * Transmit the html of the edited content back to the assigned note 
   * @param the id of the assigned note
   */
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
