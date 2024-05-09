import './assets/main.css'

import { createApp } from "vue";
import App from './App.vue'

import { createVuestic } from 'vuestic-ui'
import 'vuestic-ui/dist/vuestic-ui.css'

const app = createApp(App)
app.use(createVuestic({
    config:{
       colors:{
        presets:{
            light:{
                primary: "#27293d",
                secondary: "#40af7c",
                success: "#00bf9a",
                info: "#419ef9",
                danger: "#fd77a4",
                warning: "#ff9f89",
                backgroundPrimary: "#1e1e2f",
                backgroundSecondary: "#27293d",
                backgroundElement: "#3a9c6d",
                backgroundBorder: "#DEE5F2",
                textPrimary: "#ffffff",
                textInverted: "#ffffff",
                shadow: "rgba(0, 0, 0, 0.12)",
                focus: "#49A8FF",
                transparent: "rgba(0, 0, 0, 0)",
                backgroundLanding: "#f4f9fc",
                backgroundLandingBorder: "rgba(155, 179, 206, 0.8)"
            }
        }
       } 
    }
}))
app.mount('#app')

