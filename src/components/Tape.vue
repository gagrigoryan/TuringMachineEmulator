<template>
  <v-container fluid grid-list-xs text-center ma-5>
    
    <v-container fluid>
      <v-alert outlined dense type="success" transition="scale-transition" :value="showMessage">
        Program is successfully concluded
      </v-alert>
      <v-row>
        <v-btn @click="start" class="ma-2" color="primary" dark>Run
          <v-icon dark right size='26'>play_arrow</v-icon>
        </v-btn>

        <v-btn @click="paused" class="ma-2" color="red" dark>Pause
          <v-icon dark right size='26'>pause_circle_filled</v-icon>
        </v-btn> 
      </v-row>
    </v-container>
    
    
    <v-card max-width='50' class="mx-auto ma-2" dark color="primary">{{ currentState }}</v-card>
    <div class="ma-5" v-bind:style="{transform: 'translateX(' + shift + 'px)', transition: 'ease 0.25s'}">
      <v-touch 
      @swipeleft="(event) => swipe(event)" 
      @swiperight="(event) => swipe(event)" 
      :swipe-options="{ threshold: 0 }">
        <v-layout class='tape-wrapper'>
          <v-flex v-for="(t, index) in tape" :key="index" xs1>
            <v-card
              @click="cardClick(index)"
              @keyup.left="goLeft(index)"  
              @keyup.right="goRight(index)" 
              :dark='(index - 100 != capPosition)'>
              <v-card-text class="px-0 py-0">
                <input maxlength="1" :disabled='!pause' :autofocus="index - 100 == capPosition" ref="tapeInput" class='tape-input' type="text" v-model='tape[index]'>
              </v-card-text>
            </v-card>
            <p class="text-center">{{ index - 100 }}</p>
          </v-flex>
        </v-layout>
      </v-touch>
    </div>
    <div style="display: flex; margin-bottom: 15px;">
      <v-btn small class="mx-2" fab dark color="indigo" @click.stop="symbolDialog = true">
        <v-icon dark>mdi-plus</v-icon>
      </v-btn>
      <v-card
       style="cursor: pointer"
       class="py-2 px-3 mr-1 pink "
       v-for="(symbol, index) in alphabet" :key="index"
       :class="[(activeSymboles.includes(index)) ? 'darken-2' : 'lighten-2']"
       @click="clickOnSymbol(index)">
        <v-card-text style="font-size: 18px; color: white;" class="px-0 py-0">{{ symbol }}</v-card-text>
      </v-card>
      <v-btn v-if="activeSymboles.length" class="mx-2" fab dark small color="red darken-1"
      @click="deleteSymbol">
        <v-icon dark >mdi-delete</v-icon>
      </v-btn>
    </div>
    <v-dialog
        max-width="300"
        v-model="symbolDialog"
    >
        <v-card>
            <v-card-title class="headline">Add new symbol</v-card-title>
            <v-text-field class="ma-2"
                v-model="symbolName"
                label="Input symbol"
                solo
            ></v-text-field>

            <v-card-actions>
            <div class="flex-grow-1"></div>

            <v-btn
                color="green darken-1"
                text
                @click="addSymbol"
            >
                Add
            </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>

    <v-btn class="hidden-md-and-up ma-1" @click="goLeft(capPosition + 100)">Left</v-btn>
    <v-btn class="hidden-md-and-up ma-1" @click="goRight(capPosition + 100)">Right</v-btn>
  </v-container>
</template>

<script>

  export default {
    props: ['direction'],
    computed: {
      tape() {
        return this.$store.state.tape
      },
      currentState() {
        return this.$store.state.currentState
      },
      program() {
        return this.$store.state.program
      },
      alphabet() {
        return this.$store.state.alphabet
      }
    },

    data: () => ({
      shift: 0,
      capPosition: 0,
      pause: true,
      showMessage: false,
      symbolDialog: false,
      symbolName: '',
      activeSymboles: []
    }),

    created() {
      for (var i = -100; i <= 100; i++) {
        this.tape.push('')
      }
    },

    methods: {
      goLeft: function(index) {
        if (index > 0) {
          this.shift += 52
          this.capPosition -= 1
          this.$refs.tapeInput[index].blur()
          this.$refs.tapeInput[index - 1].select()
        }
      },

      goRight: function(index) {
        if (index < 200) {
          this.shift -= 52
          this.capPosition += 1
          this.$refs.tapeInput[index].blur()
          this.$refs.tapeInput[index + 1].select()
          }
      },

      cardClick: function(index) {
        this.shift = -(index - 100) * 52
        this.capPosition = index - 100
        this.$refs.tapeInput[index].select()
      },

      clickOnSymbol: function(index) {
        if (this.activeSymboles.includes(index)) {
          this.$delete(this.activeSymboles, this.activeSymboles.indexOf(index))
        } else {
          this.activeSymboles.push(index)
        }
        
      },

      deleteSymbol: function() {
        var deletedSymboles = []
        for (var index in this.activeSymboles) {
          deletedSymboles.push(this.alphabet[this.activeSymboles[index]])
        }
        this.$store.commit("deleteSymbol", deletedSymboles)
        this.activeSymboles = []
      }, 

      swipe: function(e) {
        this.shift += (e.deltaX * 1.5)
      },

      start: function() {
        if(this.pause){
          this.pause = false
          let timerId = setInterval(() => {
            if (this.pause) {
              clearInterval(timerId)
            }else {
              const currSymbol = this.tape[this.capPosition + 100]
              const currState = this.program.find(s => s.name === this.currentState)[currSymbol]
              this.$store.commit('updateState', currState.changeState)
              this.$store.commit('updateTape', {index: this.capPosition + 100, value: currState.changeValue})
              if (currState.direction == 1) {
                this.goRight(this.capPosition + 100)
              } else if (currState.direction == -1) {
                this.goLeft(this.capPosition + 100)
              }
              if (currState.changeState === 'F'){
                this.pause = true
                this.showMessage = true
                setTimeout(() => {
                  this.showMessage = false
                  this.$store.commit('updateState', 'q0')
                }, 1500)
              }
            }
          }, 1000);
        }
      },

      paused: function() {
        this.pause = true
      },

      addSymbol: function() {
        if (this.symbolName && !(this.alphabet.includes(this.symbolName))) {
          this.$store.commit('updateAlphabet', this.symbolName)
          this.symbolName = ''
          this.symbolDialog = false
        }
      }
    },
    watch: {
    }
  }
</script>

<style scoped>
.tape-wrapper {
  width: max-content;
  transform: translateX(calc(-50% + 50vw - 30px));
}

.tape-input {
  width: 50px;
  height: 50px;
  outline: none;
  border: none;
  text-align: center;
  font-size: 25px;
  transition: ease-out
}

.alert {
  transition: all ease 0.4s
}
</style>
