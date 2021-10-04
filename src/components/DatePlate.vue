<template>
<h1 :id="cardID" style="position:relative; right:400px;">{{this.submitDateStr}}</h1>
</template>

      
<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import {TimeFormatter} from '../utils/timeFormatter';

@Options({

    props:{
        submitDate:String,
        cardID:String,
    },

})



export default class DatePlate extends Vue {
isShowingAddedDate! : string;
cardID!:string;
submitDate!:string;
submitDateStr = '';

mounted(){
    this.parseSubmitDate();
}

public parseSubmitDate() : void {
    var time = new TimeFormatter(this.submitDate);
    this.submitDateStr = time.getTimeatLocaleForDM('en');
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
  width:30px;
  vertical-align: bottom;
}


</style>
