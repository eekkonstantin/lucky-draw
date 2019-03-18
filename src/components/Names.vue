<template>
  <v-layout pa-3 align-content-center row wrap>
    <file-drop class="flex xs12" @input="testFiles">
      <template slot="toolbar">
        <v-layout align-center>
          <v-toolbar-title class="flex grow">
            Add {{ title }} List
          </v-toolbar-title>
          <v-toolbar-title class="flex shrink subheading">
            Data starts at row
          </v-toolbar-title>
          <v-text-field label="Row" solo hide-details mask="####"
            class="mini-input flex shrink ml-2" v-model="rowNo"
          />
          <v-spacer />
          <v-btn color="primary" :disabled="!ready" @click="submit">
            upload
          </v-btn>
        </v-layout>
      </template>

      <template slot="after">
        <v-checkbox hide-details class="mb-3 ml-3"
          v-model="clearAll"
          label="Clear all before adding new list"
        />
      </template>
    </file-drop>

    <v-card class="flex xs12 mt-3">
      <v-toolbar card dense>
        <v-toolbar-title>
          {{ title }} List
        </v-toolbar-title>
        <v-spacer />
        <v-btn color="error" @click="final = []">
          Clear All
        </v-btn>
      </v-toolbar>
      <v-card-text>
        <v-list class="py-0">
          <v-list-tile v-for="(person, i) in final" :key="'detail-' + i"
            class="grey darken-4 mb-1"
          >
            <span class="subheading">{{ person.name }}</span>
            <v-spacer />
            <span class="primary--text">
              {{ person.role }}
            </span>
          </v-list-tile>
        </v-list>
      </v-card-text>

    </v-card>
  </v-layout>
</template>

<script>
import FileDrop from "@/components/FileDropper"
import Papa from "papaparse"

import {Person} from "@/plugins/Items"

export default {
  name: "names-page",
  components: {FileDrop},
  data() {return {
    title: "Name",
    files: [],
    clearAll: true,
    rowNo: 2,
    list: [],

    final: []
  }},
  computed: {
    ready() {
      return this.list.length > 0 && this.rowNo && this.rowNo > 0
    }
  },
  watch: {
    list: {handler() { }, deep: true},
    final(list) {
      this.$store.commit("addNames", list)
    }
  },
  methods: {
    testFiles(files) {
      for (let i in files) {
        Papa.parse(files[i], {
          complete: (results) =>
            this.list = results.data
        })
      }
    },

    submit() {
      let names = [], id = 0
      for (let i=this.rowNo-1; i<this.list.length; i++) {
        let p = this.list[i]
        if (p[3] == "Yes") // is present
          names.push(new Person(id++, p[0], p[1]))
      }
      this.final = names
    }
  },
  beforeMount() {
    if (this.$store.state.names.length > 0)
      this.final = this.$store.state.names
  }
}
</script>

<style lang="stylus">
.mini-input
  height: 2rem
  & > .v-input__control
    margin-top: -0.2rem;
  *
    min-height: unset
</style>
