<template>
    <Logo :page="page" :vuex_1="1" :vuex_2="true" :vuex_3="page" />
    <el-button>
        Add
    </el-button>
</template>
<script>
import { mapState, mapGetters, mapActions, mapMutations } from 'vuex'
// import upload from '@/componets/Upload'
export default {
    computed(){
        return  {
            ...mapGetters
        }
    },
    components:{
        Logo: () => import('components/Logo')
    },
    methods:{
        ...mapMutations(['setHelloWorldMsg']),
        ...mapActions({ AsyncSetHelloWorldMsg: 'AsyncSetHelloWorldMsg' }),
        a:()=>{
            this.$refs.upload1
        }
    }
}
</script>
<style  scoped>

</style>