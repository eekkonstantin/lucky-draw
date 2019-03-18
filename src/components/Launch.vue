<template>
  <rocket :names="eligibleNames" @won="won" ref="rocket">
    <v-layout row mt-4>
      <v-flex xs12 sm5>
        <v-img :src="prize.image" :height="200"
          :aspect-ratio="2.75" contain
          position="right center"
          class="rocket"
        />
      </v-flex>
      <v-flex xs12 sm7 my-4 class="text-xs-center">
        <div class="headline primary--text">
          {{ prizeNum }}
        </div>
        <div class="display-2">{{ prize.name }}</div>
        <div class="subheading mt-2">
          <span v-if="prizeID > -1">
            Open to <b>{{ eligibleRoles.join(", ") }}</b>!
          </span>
          <span v-else>
            This is a test run!
          </span>
        </div>
      </v-flex>
    </v-layout>

    <v-btn fab right absolute large
      v-if="!hideNext"
      @click.native.stop="goNext"
    >
      <v-icon color="primary">fa-chevron-right</v-icon>
    </v-btn>
  </rocket>
</template>

<script>
import {Bus} from "@/plugins/Bus.js"
import Rocket from "@/components/Rocket"
import Swal from 'sweetalert2'
export default {
  name: "launch-page",
  components: {Rocket},
  data() {return {
    prizeID: -1,
    hasWinner: false
  }},
  computed: {
    hideNext() {
      return (this.prizeID >= this.$store.state.prizes.length
              || this.prizeID <= 0)
              || !this.hasWinner
    },
    prize() {
      if (this.prizeID < 0)
        return {}
      return this.$store.state.prizes[this.prizeID]
    },
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
      if (this.prizeID < 0)
        return this.$store.state.roles
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
  methods: {
    won(winner) {
      if (!winner)
        return
      if (this.prizeID >= 0) {
        // this.$refs.rocket.anim.pause()
        this.$store.commit("wonPrize", [winner.id, this.prizeID])
        this.hasWinner = true
      } else
        Swal.fire({
          type: "success",
          title: "Are you ready for the real thing?",
          showCancelButton: true,
          cancelButtonText: "One more time!",
          confirmButtonText: "Yes, let's go!",
          confirmButtonClass: "primary"
        }).then(res => {
          if (res.value)
            this.prizeID = this.$store.state.prizes.length - 1
          this.$refs.rocket.resetAnim()
          this.$refs.rocket.resetSpinner()
        })
    },
    goNext() {
      this.hasWinner = false
      this.prizeID--
      Bus.$emit("reset-rocket")
    }
  },
  beforeMount() {
    // this.prize = Array.from(this.$store.state.prizes).pop()
    let check = this.$store.state.prizes
    if (!check[check.length - 1].wonBy)
      this.prizeID = -1
    else {
      for (let i=check.length-1; i>-1; i--) {
        if (!check[i].wonBy) {
          this.prizeID = i
          break
        }
      }
    }
  },
  mounted() {
    Bus.$on("reset-prize", () => {
      if (this.prizeID > -1)
        this.$store.commit("clearPrize", this.prizeID)
    })
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

.rocket
  .v-image__image.v-image__image--contain
    background-position: right center;
</style>
