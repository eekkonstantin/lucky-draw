<template>
  <v-layout row wrap px-3 pt-3>
    <v-alert :value="hasNameList" type="success" class="flex xs12"
    >
      Names set!
    </v-alert>
    <v-alert :value="hasPrizeList" type="success" class="flex xs12"
    >
      Prizes set!
    </v-alert>

    <v-card class="flex xs12 mt-3">
      <v-card-text class="text-xs-center">
        <h4 class="display-2">
          Let's win some prizes!
        </h4>
        <p class="mt-3 mb-0">Please ensure all prizes, names, and prize eligibility have been correctly set.</p>
      </v-card-text>

      <v-card-actions class="layout justify-center">
        <v-btn color="primary" @click="clearAll"
          :disabled="!hasPrizeList && !hasNameList"
        >
          Clear All Data
        </v-btn>
        <v-btn color="success" @click="$emit('ready')"
          :disabled="!hasPrizeList || !hasNameList"
        >
          Go to Launchpad!
        </v-btn>
      </v-card-actions>
    </v-card>
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
    },
    hasPrizeList() {
      return this.$store.state.prizes.length > 0
    }
  },
  methods: {
    clearAll() {
      this.$store.commit("clearAll")
    }
  }
}
</script>

<style lang="stylus">
</style>
