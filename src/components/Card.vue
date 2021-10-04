<template>
<div v-if="cardType">
<Note  :contents="contents" 
:submitDate="submitDate" :tag="tag" :notebook="notebook" 
:date="date" :isdone="isdone" :id="id" />  
</div>
<div v-else>
    <DatePlate :submitDate="submitDate"/>
</div>

</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import DatePlate from './DatePlate.vue';
import Note from './Note.vue';


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
        cardType:Boolean,
        cardID:String
    },
    components:{
        Note,
        DatePlate
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
  cardType!:boolean;
    cardID!:string
}

</script>

<style scoped>

</style>

