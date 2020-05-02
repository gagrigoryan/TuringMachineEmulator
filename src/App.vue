<template>
  <v-app>
    <v-app-bar app>
      <v-toolbar-title class="headline text-uppercase">
        <span>Vuetify</span>
        <span class="font-weight-light">MATERIAL DESIGN</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn
        text
        href="https://github.com/vuetifyjs/vuetify/releases/latest"
        target="_blank"
      >
        <span class="mr-2">Latest Release</span>
      </v-btn>
    </v-app-bar>

    <v-content>
      <Tape/>
      <Table/>
    </v-content>
  </v-app>
</template>

<script>
import Tape from './components/Tape'
import Table from './components/Table'

export default {
  name: 'App',
  components: {
    Tape, Table,
  },
  data: () => ({
  }),
  methods: {
  }
};
</script>

<style>
body {
  overflow-x: hidden;
}

.v-text-field__details {
  display: none
}

.v-input__slot {
  margin: 0;
  padding: 0;
}
</style>

