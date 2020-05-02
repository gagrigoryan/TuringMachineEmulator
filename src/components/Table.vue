<template>
    <div>
        <v-btn small class="mx-2" fab dark color="indigo" @click.stop="stateDialog = true">
            <v-icon dark>mdi-plus</v-icon>
        </v-btn>
        <v-dialog
            max-width="300"
            v-model="stateDialog"
        >
            <v-card>
                <v-card-title class="headline">Add new state</v-card-title>
                <v-text-field class="ma-2"
                    v-model="stateName"
                    label="Input state name"
                    solo
                ></v-text-field>

                <v-card-actions>
                <div class="flex-grow-1"></div>

                <v-btn
                    color="green darken-1"
                    text
                    @click="addState"
                >
                    Add
                </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <div class="myTable">
            <v-simple-table class="ma-2">
                <thead>
                    <tr>
                        <th>State name</th>
                        <th class="text-center" v-for="symbol in alphabet" :key="symbol">{{ symbol }}</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="state in program" :key="state.name">
                        <td class="text-center">{{ state.name }}</td>
                        <td v-for="symbol in alphabet" :key="symbol">
                            <v-row no-gutters>
                                <v-col>
                                    <v-autocomplete color="red" class='autocomplete'
                                        v-model="state[symbol].changeState"
                                        :items="statesList"
                                    >
                                    </v-autocomplete>
                                </v-col>
                                <v-col>
                                    <v-autocomplete class='autocomplete'
                                        v-model="state[symbol].changeValue"
                                        :items="alphabet"
                                    >
                                    </v-autocomplete>
                                </v-col>
                                <v-col>
                                    <v-autocomplete class='autocomplete'
                                        v-model="state[symbol].direction"
                                        :items="directions"
                                    >
                                    </v-autocomplete>
                                </v-col>
                            </v-row>
                        </td>
                    </tr>
                </tbody>
            </v-simple-table>
        </div>
        
    </div>
</template>

<script>
  export default {
    computed: {
        tape() {
            return this.$store.state.tape
        },
        alphabet() {
            return this.$store.state.alphabet
        },
        program() {
            return this.$store.state.program
        },
        statesList() {
            return this.$store.state.statesList
        }
    },
    data () {
      return {
          directions: [
              1, -1, 0
          ],
          stateName: '',
          stateDialog: false,
      }
    },
    methods: {
        addState: function() {
            if (this.stateName && !(this.statesList.includes(this.stateName))){
                this.$store.commit("updateStatesList", this.stateName)
                this.stateDialog = false
                this.stateName = ''
            }
            
        }
    }
  }
</script>

<style scoped>
.myTable {
    width: max-content;
}


th, td {
    min-width: min-content;
    font-size: 16px;
    border: 1px solid silver;
    padding: 0;
}

td {
    height: min-content;
}

input {
    outline: none;
    border: 1px solid silver;
    max-width: 40px
}

.selected {
    width: min-content;
}

.autocomplete {
    width: 45px
}
</style>
