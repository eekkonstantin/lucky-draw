<template>
  <v-layout ma-4 column justify-space-between>
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
    <v-flex grow class="text-xs-left" my-2>
      <v-layout>
        <v-flex xs2>
          <v-img :src="rocket" :height="350" contain />
        </v-flex>
        <v-flex grow class="display-2">
          <v-layout column fill-height>
            <v-flex>
              <span v-if="stage == 5">SOMEONE'S NAME</span>
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
    </v-flex>

  </v-layout>
</template>

<script>
export default {
  name: "launch-page",
  data() {return {
    inTime: 0, outTime: 0,
    power: 0,
    powerGauge: null,
    spinTime: 5000,

    prize: {},
    prizeID: 9,

    stages: ["idle", "building", "launching", "cruising", "landing", "landed"],
    stage: 0,
    stageInt: null
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
    rocket() {
      return require("@/assets/rocket/" + this.stages[this.stage] + ".gif")
    },
    fuel() {
      if (this.power < 100)
        return this.power
      let hun = this.power / 100,
          ten = this.power % 100
      if (hun % 2 == 1) // reverse
        ten = 100 - ten
      return ten
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
        && x.won == -1
      )
    }
  },
  watch: {
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
          this.stageInt = setTimeout(() => {
            this.stage = 5
            this.power = 0
          }, 2000)
          break
      }
    }
  },
  methods: {
    down() {
      this.stage = 1
      this.power = 0
      this.powerGauge = setInterval(() => {this.power++}, 10)
    },
    up() {
      this.stage = 2
      this.spinTime = this.fuel * 75
      clearTimeout(this.powerGauge)
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
