<template>
  <v-card>
    <v-toolbar card dense class="f-d">
      <v-toolbar-side-icon>
        <v-icon>fa-paperclip</v-icon>
      </v-toolbar-side-icon>
      <slot name="toolbar">
        <v-toolbar-title>{{ title }}</v-toolbar-title>
      </slot>
    </v-toolbar>
    <v-layout row wrap px-2 py-1>
      <v-btn block :disabled="disabled" color="primary"
        @click="$refs.inp.click()" ref="fdAddBtn">
        Add File(s)
      </v-btn>
      <v-btn block :disabled="accepted.length == 0"
        @click="clearAll" ref="fdClearBtn" color="grey darken-2"
      >
        Clear All
      </v-btn>
    </v-layout>

    <v-layout row wrap px-2 style="min-height: 100px" @click="$refs.inp.click()"
      @dragover.prevent="" @drop.prevent="fileDropped"
    >
      <v-flex xs12>
        <slot v-if="accepted.length == 0">
          <div class="text-xs-center" style="width: 100%; user-select: none">
            Click or drag files here to add.
          </div>
        </slot>
        <v-list v-else class="transparent py-0 px-1" style="width: 100%">
          <v-list-tile v-for="(file, i) in accepted" :key="i" avatar
            class="v-card grey darken-1 elevation-2 mt-2 mb-2"
            ref="fdFileList" @click.prevent.stop=""
          >
            <v-list-tile-avatar ref="fdListAvatar">
              <v-icon>fa-file</v-icon>
            </v-list-tile-avatar>

            <v-list-tile-content ref="fdListContent">
              <v-list-tile-title>{{ file.name }}</v-list-tile-title>
              <v-list-tile-sub-title>{{ filesizeDisplay(file.size) }}</v-list-tile-sub-title>
            </v-list-tile-content>

            <v-list-tile-action>
              <slot name="actions" :file="file">
                <v-btn icon ripple @click.stop="removeFile(file)">
                  <v-icon color="error">fa-trash-alt</v-icon>
                </v-btn>
              </slot>
            </v-list-tile-action>
          </v-list-tile>
        </v-list>
      </v-flex>
    </v-layout>

    <v-flex xs12 v-if="$slots.after">
      <slot name="after" />
    </v-flex>
    <input type="file" style="display: none"
      @change="test"
      :multiple="multiple" ref="inp"
    />
  </v-card>
</template>

<script>
import Swal from 'sweetalert2'
export default {
  model: {prop: "accepted", event: "input"},
  props: {
    title: {type: String, default: "File Dropper"},
    allow: {type: [String, Array], default: ".csv"},
    multiple: {type: Boolean}
  },
  data() {return {
    disabled: false,
    accepted: [],
    rejected: {
      multiple: [],
      filesize: [],
      filetype: [],
      duplicate: []
    }
  }},
  computed: {
    allowed() {
      if (!this.allow)
        return ["*"]
      let ret = this.allow
      if (typeof ret == "string")
        ret = this.allow.split(",")
      ret = ret.map(x => x.trim())
      if (ret.includes("*"))
        return ["*"] // ALL - ignore everything else
      return ret
    }
  },
  watch: {
    accepted: {handler() {}, deep:true}
  },
  methods: {
    test() {
      let files = this.$refs.inp.files
      for (let i=0; i<files.length; i++)
        this.processFile(files[i])
      this.showErrors()
    },
    fileDropped(ev) {
      if (ev.dataTransfer.items) {
        // Use DataTransferItemList interface to access the file(s)
        for (var i = 0; i < ev.dataTransfer.items.length; i++) {
          // If dropped items aren't files, reject them
          if (ev.dataTransfer.items[i].kind === 'file') {
            var file = ev.dataTransfer.items[i].getAsFile();
            this.processFile(file)
            // console.log('... file[' + i + '].name = ' + file.name);
          }
        }
      } else {
        // Use DataTransfer interface to access the file(s)
        for (var i2 = 0; i2 < ev.dataTransfer.files.length; i2++) {
          this.processFile(ev.dataTransfer.files[i2])
          // console.log('... file[' + i + '].name = ' + ev.dataTransfer.files[i].name);
        }
      }

      this.showErrors()
    },

    processFile(file) {
      // console.log(file);
      let ok = true

      // check file limit
      if (!this.multiple  && this.accepted.length == 1) {
        this.rejected.multiple.push(file.name)
        ok = false
      }

      // check file size
      if (this.maxSize    && (file.size / 1000 > this.maxSize)) {
        this.rejected.filesize.push(file.name)
        ok = false
      }

      // check file type
      let sp = file.name.split(".")
      if (this.allowed[0] != "*") {
        sp = sp[sp.length - 1]
        if (!sp.startsWith("."))
          sp = "." + sp
        if (!this.allowed.includes(sp.toLowerCase())) {
          this.rejected.filetype.push(file.name)
          ok = false
        }
      }

      // check duplicate
      if (this.accepted.map(x => x.name).includes(file.name)) {
        this.rejected.duplicate.push(file.name)
        ok = false
      }

      if (ok)
        this.accepted.push(file)

    },

    removeFile(file) {
      this.accepted = this.accepted.filter(x => x.name != file.name)
      this.$refs.inp.value = null
      this.$emit("input", this.accepted)
    },
    clearAll() {
      this.accepted = []
      this.rejected = {
        multiple: [],
        filesize: [],
        filetype: [],
        duplicate: []
      }
      this.$emit("input", this.accepted)
    },

    filesizeDisplay(sizeB) {
      if (sizeB < 1024)
        return sizeB + "B"
      if (sizeB < 1048576)
        return Math.round(sizeB / 1024) + "KB"
      if (sizeB < 1073741824)
        return Math.round(sizeB / 1024 / 1024) + "MB"

      return Math.round(sizeB / 1024 / 1024 / 1024) + "GB"
    },

    showErrors() {
      let rejects = ""
      for (let k in this.rejected) {
        rejects += this.rejected[k].join(" | ")
      }
      if (rejects.length > 0)
        Swal.fire({
          type: "error",
          title: "File(s) could not be added!",
          text: rejects
        })

      this.$emit("input", this.accepted)

      this.rejected = {
        multiple: [],
        filesize: [],
        filetype: [],
        duplicate: []
      }
    }
  }
}
</script>

<style lang="stylus">
.f-d > .v-toolbar__content
  padding-right: 0.1rem
  padding-left: 1rem
</style>
