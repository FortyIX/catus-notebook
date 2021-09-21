<template>
<div :key="nRender" ref="editor" style="text-align:left;">
</div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import bus from '../bus';
import E from "wangeditor";
import i18next from 'i18next';

const { BtnMenu, DropListMenu, PanelMenu, DropList, Panel, Tooltip } = E;


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
  editorArea! : E;
  nRender = 0;
  mounted(){


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
    

    var ele: any = this.$refs.editor;
    this.editorArea = new E(ele);
    this.editorArea.config.height = 500;
    this.editorArea.config.showMenuTooltips = false;
    this.editorArea.config.lang= 'en'
    this.editorArea.i18next = i18next;
    this.editorArea.config.onchange = (html:string) => {
        this.htmlContent = html;
    }

    this.editorArea.create();
    this.editorArea.txt.html(this.loadedContent);
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
