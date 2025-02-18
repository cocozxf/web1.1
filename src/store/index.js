import { createStore } from 'vuex'

const store = createStore({
    state(){
        return{

        }
    },
    mutations:{
        handleAsideWidth(state){
            state.asideWidth = state.asideWidth == "250px" ? "64px" : "250px"
        }
    },
    actions:{

    }
})

export default store