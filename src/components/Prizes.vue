<template>
  <v-layout pa-3 align-content-center row wrap>
    <v-snackbar color="primary" v-model="showSnack" top>
      Changes saved!
    </v-snackbar>
    <file-drop class="flex xs12" multiple ref="filedrop"
      allow=".jpg,.jpeg,.png,.bmp,.gif" v-model="files"
    >
      <template slot="toolbar">
        <v-layout align-center>
          <v-toolbar-title class="flex grow">
            Add {{ title }} List
          </v-toolbar-title>
          <v-spacer />
          <v-btn color="primary" :disabled="!ready" @click="submit">
            upload
          </v-btn>
        </v-layout>
      </template>

      <template slot="after">

      </template>
    </file-drop>

    <v-card class="flex xs12 mt-3">
      <v-toolbar card dense>
        <v-toolbar-title>
          {{ title }} List
        </v-toolbar-title>
        <v-spacer />
        <v-layout justify-end justify-content-end>
          <v-checkbox v-for="(role, i2) in roles"
            :key="`role-all-${i2}`" :label="role" hide-details
            v-model="all[role]"
          />
        </v-layout>
        <v-spacer />
        <v-btn color="error" @click="clearAll">
          Clear All
        </v-btn>
        <v-btn color="success" @click="save">Save Changes</v-btn>
      </v-toolbar>
        <v-flex xs12 text-xs-center class="subheading">
          Drag to rearrange!
        </v-flex>
      <!-- <v-card-text class="layout row wrap"> -->
        <slick-list axis="xy" v-model="prizes"
          class="v-card__text layout row wrap justify-center"
          v-if="prizes && prizes.length > 0" :press-delay="100"
        >
          <slick-item :index="i" :key="prize.id"
            v-for="(prize, i) in prizes"
            class="flex pa-2 shrink"
          >
            <v-card color="grey darken-4">
              <v-img contain :height="170"
                :src="prize.image || demoImg"
                aspect-ratio="1.5"
              />

              <v-card-title>
                <span class="headline">Prize #{{ i+1 }}</span>
              </v-card-title>

              <v-card-text class="py-1">
                <v-text-field v-model="prize.name"
                  label="Prize Name"
                />
                {{prize.name}}
              </v-card-text>

              <v-card-actions>
                <v-divider />
                <v-layout row wrap mx-1 justify-space-between>
                  <v-checkbox v-for="(role, i2) in roles"
                    :key="`role-${i2}-${i}`" :label="role" hide-details
                    v-model="prizes[i].eligible[role]"
                    :class="i2 > 0 ? 'ml-5' : ''"
                  />
                </v-layout>
              </v-card-actions>
            </v-card>
          </slick-item>
        </slick-list>
      <!-- </v-card-text> -->

    </v-card>
  </v-layout>
</template>

<script>
import { SlickList, SlickItem } from 'vue-slicksort'
import FileDrop from "@/components/FileDropper"
import demoImg from "@/assets/cl.png"
export default {
  name: "prizes-page",
  components: {
    FileDrop,
    SlickList, SlickItem
  },
  data() {return {
    title: "Prizes",
    files: [],
    prizes: [],
    compPrizes: [],
    demoImg,
    image: null,
    all: {},
    showSnack: false
    // cancelStart: (e) => {
    //   return e.target.className.toLowerCase().includes("v-input")
    // }
  }},
  computed: {
    roles() {
      return this.$store.state.roles
    },
    ready() { return true }
  },
  watch: {
    roles: {handler(r) {
      for (let i in r)
        this.all[r[i]] = true
    }, immediate: true},
    prizes: {handler() { }, deep: true, immediate: true},
    compPrizes: {handler() {}, deep:true}
  },
  methods: {
    submit() {
      let imgCanvas = document.createElement("canvas"),
          imgContext = imgCanvas.getContext("2d")

      this.prizes = this.files.map(f => ({
        name: f.name,
        image: null,
        eligible: Object.assign({}, this.all),
        uri: null
      }))
      let reader = new FileReader(), i = 0

      reader.onload = (e) => {
      // get loaded data and render thumbnail.
        this.prizes[i].image = e.target.result


        if (++i < this.files.length)
          reader.readAsDataURL(this.files[i])
        else {// all done!
          this.save()
          this.$refs.filedrop.clearAll()
        }
      };

      // read the image file as a data URL.
      reader.readAsDataURL(this.files[0]);
    },
    save() {
      this.$store.commit("addPrizes", this.prizes)
      this.files = []
      this.showSnack = true
    },
    clearAll() {
      this.prizes = []
      this.files = []
      this.save()
    }
  },
  beforeMount() {
    let p = this.$store.state.prizes
    if (p && p.length > 0)
      this.prizes = p
  }
}
</script>

<style lang="stylus">
</style>
