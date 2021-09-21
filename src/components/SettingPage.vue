<template>
<el-scrollbar height="650px">
  
<el-collapse v-model="activeNames">
  <el-collapse-item v-bind:title="uiText.userinterface_title" name="1">
  <div class="setting-menu-1">
      <el-row :gutter="10">
        <el-col :span="8"><p class="title-text" style="position:relative; left:-20px;">{{$t('settingPage.language')}}</p></el-col>
        <el-col :span="6"></el-col>
        <el-col :span="10">
          <el-select placeholder="Select" v-model="lang_selection" style="position:relative; top:8px;" @change="handleLanguageChange">
          <el-option v-for="op in lang_options" :key="op.value" :value="op.value" :label="op.label" ></el-option>
          </el-select>
        </el-col>
      </el-row>
  </div>
  </el-collapse-item>

</el-collapse>

</el-scrollbar>
</template>

<script lang="ts">
import { Vue } from 'vue-class-component';
import { useI18n } from 'vue-i18n';
import bus from '../bus';

export default class SettingPage extends Vue {
activeNames = "1";
lang_selection = 'en'
lang_options = [
  {
    label: "English",
    value: 'en'
  },
  {
    label: "简体中文",
    value: 'cn'
  }
]
locale!: any
t!:any

uiText= {}



mounted() {
      
    const {locale,t} = useI18n();
    this.locale = locale;
    this.t = t; 
    this.getLocalizedStrings();


}

public getLocalizedStrings() : void {
    this.uiText = {
      userinterface_title : this.t('settingPage.userinterface_title')
    }
}
  

public handleLanguageChange() : void {
  this.locale.value = this.lang_selection;
  this.getLocalizedStrings();
  bus.emit('update_language');
  bus.emit('update_language_calendar',(this.lang_selection));
}

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.setting-menu-1{
  width:100%;
  height: 100%;
}


</style>
