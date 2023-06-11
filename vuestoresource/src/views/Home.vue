<template>
    <div>
        <!-- <p>我的年纪: {{$store.state.age}}</p>
        <p>我的哥哥年纪: {{$store.getters.brothAge}}</p>
        <p>我的哥哥年纪: {{$store.getters.brothAge}}</p>
        <p>我的哥哥年纪: {{$store.getters.brothAge}}</p>
        <button @click="$store.commit('addAge', 1)">同步</button>
        <button @click="$store.dispatch('addAge', 1)">异步</button> -->

        <!-- 使用自己的store -->
        <p>我的年纪: {{$store.state.age}}</p>
        <button @click="$store.state.age=100">改变</button>
        <p>我的哥哥年纪: {{$store.getters.brothAge}}</p>
        <p>我的哥哥年纪: {{$store.getters.brothAge}}</p>
        <button @click="$store.commit('addAge', 1)">同步</button>
        <button @click="$store.dispatch('addAge', 1)">异步</button>
        <p>a模块的数据: {{$store.state.a.age}}</p>
        <p>b模块的数据: {{$store.state.b.age}}</p>
    </div>
</template>

<script>
    export default {
        mounted() {
            console.log(this.$store)
        }
    }
</script>
<style scoped>

</style>