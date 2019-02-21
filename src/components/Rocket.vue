<template>
  <v-layout>
    <v-flex xs2>
      <v-img :src="rocket" :height="350" contain />
    </v-flex>
    <v-flex grow class="headline">
      <v-layout column fill-height justify-center>
        <v-flex grow>
          <v-layout fill-height align-center>
            <span v-if="orbiting" class="display-2">
              <!-- {{ winner.name }} -->
              {{ randomNames[winnerID].name }}<br />
              <span v-if="winner" class="display-1 primary--text">
                Congratulations!
              </span>
            </span>
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
  </v-layout>
</template>

<script>
import anime from "animejs"
export default {
  name: "rocket",
  model: {prop: "winner", event: "input"},
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
    rocket() {
      return require("@/assets/rocket/" + this.stages[this.stage] + ".gif")
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
    winner: {handler(w) { this.$emit('input', w) }, deep: true},
    stage(s) {
      clearTimeout(this.stageInt)
      switch (s) {
        case 2:
          this.stageInt = setTimeout(() => {
            this.stage = 3
          }, 1000)
          break
        case 3:
          this.stageInt = setTimeout(() => {
            this.stage = 4
          }, this.spinTime)
          break
        case 4:
          this.nameInt = setTimeout(() => {
            this.anim.pause()
          }, 1000)
          this.stageInt = setTimeout(() => {
            this.stage = 5
            this.power = 0
            clearTimeout(this.nameInt)
          }, 2000)
          break
        case 5:
          this.winner = this.randomNames[this.winnerID]
          break
      }
    },
    names: {handler(nl) {
      this.randomNames = nl.map((n, key) => ({...n, key}))
                            .map((a) => [Math.random(),a])
                            .sort((a,b) => a[0]-b[0])
                            .map((a) => a[1])
      this.anim = anime({
        targets: this,
        winnerID: this.randomNames.length - 1,
        round: 1,
        easing: "linear",
        loop: true,
        duration: 2000
      })
    }, deep: true, immediate: true},
  },
  methods: {
    down() {
      this.stage = 1
      this.power = 0
      clearInterval(this.powerGauge)
      this.powerGauge = setInterval(() => {this.power++}, 10)
    },
    up() {
      this.stage = 2
      this.spinTime = this.fuel * 65
      clearInterval(this.powerGauge)
    }
  }
}
</script>

<style lang="stylus">
</style>
