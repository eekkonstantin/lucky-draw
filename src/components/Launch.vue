<template>
  <v-layout pa-4 column fill-height justify-space-between>
    <v-flex shrink>
      <v-layout row>
        <v-flex xs12 sm4>
          <v-img :src="prize.image" :height="200"
            :aspect-ratio="2.75" contain />
        </v-flex>
        <v-flex xs12 sm8 my-4 class="text-xs-center">
          <div class="headline primary--text">
            {{ prizeNum }}
          </div>
          <div class="display-2">{{ prize.name }}</div>
          <div class="subheading mt-2">
            Open to <b>{{ eligibleRoles.join(", ") }}</b>!
          </div>
        </v-flex>
      </v-layout>
    </v-flex>

    <!-- ROCKET -->
    <v-flex class="text-xs-left" my-2 align-baseline>
      <rocket :names="eligibleNames" />
    </v-flex>

  </v-layout>
</template>

<script>
import Rocket from "@/components/Rocket"
export default {
  name: "launch-page",
  components: {Rocket},
  data() {return {
    prize: {},
    prizeID: 9
  }},
  computed: {
    prizeNum() {
      let ret = this.prizeID + 1
      if (ret % 10 == 1 && ret != 11)
        ret += "st"
      else if (ret % 10 == 2 && ret != 12)
        ret += "nd"
      else if (ret % 10 == 3 && ret != 13)
        ret += "rd"
      else
        ret += "th"

      return ret += " Prize"
    },

    eligibleRoles() {
      let r = []
      for (let role in this.prize.eligible) {
        if (this.prize.eligible[role])
          r.push(role)
      }
      return r
    },
    eligibleNames() {
      return this.$store.state.names.filter(x =>
        this.eligibleRoles.includes(x.role)
        && !(x.won && x.won > -1)
      )
    }
  },
  beforeMount() {
    this.prize = Array.from(this.$store.state.prizes).pop()
  }
}
</script>

<style lang="stylus">
powerH = 50px
.power
  &--box
    width: 100%
    height: powerH
    margin: 6px 8px
    background-image: linear-gradient(to right, #939598, #d71635, red)

</style>
