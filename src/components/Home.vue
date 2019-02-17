<template>
  <v-layout row wrap px-3 pt-3>
    <v-alert :value="hasNameList" type="success" class="flex xs12"
    >
      Namelist set!
    </v-alert>
  </v-layout>
</template>

<script>
export default {
  name: "home",
  data() {return {

  }},
  computed: {
    hasNameList() {
      return this.$store.state.names.length > 0
    }
  }
}
</script>

<style lang="stylus">
</style>
