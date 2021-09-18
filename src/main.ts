import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import { createI18n } from 'vue-i18n';
import App from './App.vue'

const i18n = createI18n({
    locale: 'en',
    messages: {
        'en' : require('./assets/lang/en'),
        'cn' : require('./assets/lang/cn')
    }
});

const app = createApp(App)

app.use(i18n);
app.use(ElementPlus)
app.mount('#app')
