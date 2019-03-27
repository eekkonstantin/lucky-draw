<template>
  <v-layout row wrap px-3 pt-3>
    <v-alert :value="hasNameList" type="success"
      class="flex xs12" @click="$emit('page', 'Name')"
    >
      Names set!
    </v-alert>
    <v-alert :value="hasPrizeList" type="success"
      class="flex xs12" @click="$emit('page', 'Prize')"
    >
      Prizes set!
    </v-alert>

    <v-card class="flex xs12 mt-3">
      <v-card-text class="text-xs-center">
        <h4 class="display-2">
          Let's win some prizes!
        </h4>
        <p class="mt-3 mb-0">
          <span class="body-2 mb-2">
            Please ensure all names, prizes, and prize eligibility have been correctly set.
          </span><br/>
          Namelists should be in a <code>.csv</code> file (name,role,blank,present - e.g. "<code>Kon,Other,6,Yes</code>").<br/>
          To set prizes, upload images of the prizes, then rename the prizes if necessary.<br/>
          Set the prize eligibility (based on Roles from namelist) by toggling the checkboxes.<br/>
          Prizes can be rearranged: Press and hold on the prize box until a <span class="primary px-1">red border</span> appears, then drag to reorder.
        </p>
      </v-card-text>

      <v-card-actions class="layout justify-center">
        <v-btn color="primary" @click="clearAll"
          :disabled="!hasPrizeList && !hasNameList"
        >
          Clear All Data
        </v-btn>
        <v-btn color="warning" @click="clearWinnings"
          :disabled="!hasPrizeList && !hasNameList"
        >
          Clear Winnings
        </v-btn>
        <v-btn color="success" @click="$emit('ready')"
          :disabled="!hasPrizeList || !hasNameList"
        >
          Go to Launchpad!
        </v-btn>
      </v-card-actions>
    </v-card>

    <v-snackbar color="success" top v-model="showSnack">
      {{ snackMsg }}
    </v-snackbar>
  </v-layout>
</template>

<script>
export default {
  name: "home",
  data() {return {
    showSnack: false,
    snackMsg: "Winnings cleared!"
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
    },
    clearWinnings() {
      this.$store.commit("clearPrizes")
      this.showSnack = true
    }
  }
}
</script>
