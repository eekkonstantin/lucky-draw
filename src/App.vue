<template>
  <v-app dark>
    <v-navigation-drawer app fixed clipped v-model="nav">
      <v-list class="pt-0">
        <v-list-tile avatar @click="go('Home')">
          <v-list-tile-avatar>
            <v-icon>fa-home</v-icon>
          </v-list-tile-avatar>
          Home
        </v-list-tile>
        <v-list-tile avatar @click="go('Name')">
          <v-list-tile-avatar>
            <v-icon>fa-users</v-icon>
          </v-list-tile-avatar>
          Name List
        </v-list-tile>
        <v-list-tile avatar @click="go('Prize')">
          <v-list-tile-avatar>
            <v-icon>fa-award</v-icon>
          </v-list-tile-avatar>
          Prize List
        </v-list-tile>
        <v-list-tile avatar @click="go('Launch')"
          class="error--text"
          :disabled="!(hasNameList && hasPrizeList)"
        >
          <v-list-tile-avatar>
            <v-icon :color="(hasNameList && hasPrizeList) ? 'primary' : 'accent'">
              fa-rocket
            </v-icon>
          </v-list-tile-avatar>
          <span v-if="hasNameList && hasPrizeList">
            <b>Ready for Launch!</b>
          </span>
          <span v-else>
            Preparing for launch...
          </span>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>

    <v-toolbar app fixed clipped-left>
      <v-toolbar-side-icon @click.stop="nav = !nav">
        <v-icon>fa-rocket</v-icon>
      </v-toolbar-side-icon>
      <v-toolbar-title class="headline text-uppercase">
        <span class="font-weight-light">Capstone 4 </span>
        <span>Lucky </span>
        <span class="primary--text">
          Rocket

        </span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <!-- <v-btn
        flat
        href="https://github.com/vuetifyjs/vuetify/releases/latest"
        target="_blank"
      >
        <span class="mr-2">Latest Release</span>
      </v-btn> -->
    </v-toolbar>



    <v-content app>
      <v-layout row wrap px-3 pt-3>
        <v-alert :value="!hasNameList" type="error"
          @click="go('Name')" class="flex xs12"
        >
          No namelist set!
        </v-alert>
        <v-alert :value="!hasPrizeList" type="error"
          @click="go('Prize')" class="flex xs12"
        >
          No prize list set!
        </v-alert>
      </v-layout>
      <component :is="page" v-bind.sync="pageParams" />
    </v-content>

    <v-footer  fixed class="caption">
      <v-layout row justify-center>
        &copy; kkontagion 2019
      </v-layout>
    </v-footer>
  </v-app>
</template>

<script>
import HelloWorld from './components/HelloWorld'
import Home from '@/components/Home'
import Names from '@/components/Names'
import clLogo from "@/assets/cl.png"

export default {
  name: 'App',
  components: {
    HelloWorld, Home
  },
  data () {return {
    nav: false,
    clLogo,
    page: Home,
    pageParams: {},
    navs: ["Name", "Prize"],

    hasNameList: this.$store.state.names.length > 0,
    hasPrizeList: false
  }},
  watch: {
    hasNameList: {handler(have) {
      if (have) {
        let list = this.$store.state.names
        let roles = []
        for (let i in list) {
          if (!roles.includes(list[i].role))
            roles.push(list[i].role)
        }

        roles.forEach(x => this.$store.commit('setPrizeRange', x))
      }
    }, immediate: true}
  },
  methods: {
    go(page) {
      switch(page) {
        case "Name":
          this.page = Names
          break;
        default:
          this.page = Home
      }
      this.nav = false
    }
  }
}
</script>

<style lang="stylus">
body
  height: 100%
  font-family: 'Roboto', sans-serif;
  line-height: 1.5;
#app
  background: url("/lucky-draw-bg.jpg") no-repeat
  background-position: center;
  background-size: cover;
aside.v-navigation-drawer
  z-index:20
footer.v-footer
  opacity: 0.2
</style>
