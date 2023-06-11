export default {
    props: {
        to: {
            type: String,
            required: true
        },
        tag: {
            type: String
        }
    },
    // jsx
    render() {
        let tag = this.tag || 'a'
        console.log(this.$router)
        let handler = () => {
            this.$router.push(this.to)
        }
        return <tag onclick={handler}>{this.$slots.default}</tag>
    }
}