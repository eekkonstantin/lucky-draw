<template>
  <v-layout row fill-height>
    <v-flex grow>
      <v-layout column fill-height pb-5 pl-4>
        <v-flex>
          <slot />
        </v-flex>
        <v-flex>
          <v-layout fill-height align-center>
            <div v-if="showWinner" class="display-2">
              <div v-if="winner">
                {{ winner.name }}<br />
                <span class="display-1 primary--text">
                  Congratulations!
                </span>
              </div>
              <span v-else>{{ randomNames[winnerID].name }}</span>
            </div>
            <span v-else-if="stage == 2">
              Looking for a planet to land on...
            </span>
            <span v-else>
              Press and hold the fuel button to charge the rocket!
            </span>
          </v-layout>
        </v-flex>
        <v-flex shrink>
          <v-layout row>
            <v-flex shrink>
              <hold-btn color="primary" fab @down="down" @up="up">
                <v-icon>fa-gas-pump</v-icon>
              </hold-btn>
            </v-flex>
            <v-flex>
              <div class="power--box primary" :style="`width:${fuel}%`"/>
            </v-flex>
          </v-layout>
        </v-flex>
      </v-layout>
    </v-flex>
    <v-flex xs1 style="height: 100%">
      <v-layout fill-height align-end>
        <v-img :src="rocket" contain width="100%" style="float:right"/>
      </v-layout>
    </v-flex>
  </v-layout>
</template>

<script>
import {Bus} from "@/plugins/Bus.js"
import anime from "animejs"
import rockets from "@/assets/rocket/rocket"

export default {
  name: "rocket",
  props: {
    names: {type: Array}
  },
  data() {return {
    randomNames: [],
    winner: null,
    winnerID: 0,
    anim: null,
    nameInt: null,

    power: 0,
    powerGauge: null,
    spinTime: 5000,

    stages: ["idle", "building", "launching", "cruising", "landing", "landed"],
    stage: 0,
    stageInt: null
  }},
  computed: {
    showWinner() {
      return this.orbiting && this.randomNames && this.randomNames.length > 0
    },
    rocket() {
      return rockets[this.stages[this.stage]]
    },
    orbiting() {
      return [3, 4, 5].includes(this.stage)
    },
    fuel() {
      if (this.power < 100)
        return this.power
      let hun = this.power / 100,
          ten = this.power % 100
      if (hun % 2 == 1) // reverse
        ten = 100 - ten
      return ten
    }
  },
  watch: {
    winner: {handler(w, old) {
      if (!old || !w || w.id != old.id)
        this.$emit('won', w)
    }, deep: true},
    stage(s) {
      clearTimeout(this.stageInt)
      switch (s) {
        case 2:
          this.stageInt = setTimeout(() => {
            this.stage = 3
          }, 1100)
          break
        case 3:
          this.stageInt = setTimeout(() => {
            this.stage = 4
          }, this.spinTime)
          break
        case 4:
          // setTimeout(() => {
          //   this.anim.pause()
          // }, 1000)
          this.stageInt = setTimeout(() => {
            this.stage = 5
            this.power = 0
          }, 1900)
          break
        case 5:
          this.winner = this.randomNames[this.winnerID]
          this.anim.pause()
          break
      }
    },
    names: {handler(nl, old) {
      this.randomize(nl)
      if (!old || (nl.length != !old.length - 1))
        this.resetAnim()
    }, deep: true, immediate: true},
  },
  methods: {
    down() {
      this.winnerID = 0
      this.winner = null
      Bus.$emit("reset-prize")
      this.stage = 1
      this.power = 0
      clearInterval(this.powerGauge)
      this.powerGauge = setInterval(() => {this.power++}, 10)
    },
    up() {
      this.stage = 2
      this.spinTime = this.fuel * 70
      this.anim.play()
      clearInterval(this.powerGauge)
    },
    resetAnim() {
      this.anim = anime({
        targets: this,
        winnerID: this.randomNames.length - 1,
        round: 1,
        easing: "linear",
        loop: true,
        duration: 1000,
        autoplay: false
      })
    },
    resetSpinner(play) {
      this.winnerID = 0
      this.winner = null
      this.stage = 0
      if (play)
        this.anim.play()
    },
    randomize(nl) {
      this.randomNames = nl.map((a) => [Math.random(),a])
                            .sort((a,b) => a[0]-b[0])
                            .map((a) => a[1])
    },
    resetAll() {
      this.resetSpinner()
      this.resetAnim()
    }
  },
  beforeMount() {
    this.resetAll()
  },
  mounted() {
    Bus.$on("reset-rocket", () => this.resetAll())
  }
}
</script>

<style lang="stylus">
</style>
