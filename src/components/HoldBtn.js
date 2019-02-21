import VBtn from "vuetify/lib/components/VBtn"
export default {
  name: "hold-btn",
  extends: VBtn,
  mounted() {
    this.$el.onmousedown = e => this.$emit("down", e)
    this.$el.onmouseup = e => this.$emit("up", e)
  }
}
