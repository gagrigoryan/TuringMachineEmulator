import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        tape: [],
        program: [
            {
                name: 'q0',
                '0': {
                    changeValue: '1',
                    changeState: 'q0',
                    direction: 1
                },
                '1': {
                    changeValue: '0',
                    changeState: 'q0',
                    direction: -1,
                },
                'a': {
                    changeValue: '1',
                    changeState: 'q0',
                    direction: 1
                }
              }
        ],
        currentState: 'q0',
        alphabet: ['0', '1', 'a'],
        statesList: ['q0', 'F']
    },
    mutations: {
        updateState(state, currState) {
            state.currentState = currState
        },
        updateTape(state, {index, value} ) {
            Vue.set(state.tape, index, value)
        },
        updateStatesList(state, value) {
            var addState = {
                name: value
            }
            for (var symbol in state.alphabet) {
                addState[state.alphabet[symbol]] = {
                    changeValue: ' ',
                    changeState: ' ',
                    direction: ' '
                }
            }
            state.program.push(addState)
            state.statesList.push(value)
        },
        updateAlphabet(state, value) {
            state.alphabet.push(value)
            var addSymbol = {
                changeValue: ' ',
                changeState: ' ',
                direction: ' '
            }
            for(var st in state.program){
                state.program[st][value] = addSymbol
            }
        },
        
        deleteSymbol(state, value) {
            for (var indexSymboles in value) {
                state.alphabet.splice(state.alphabet.indexOf(value[indexSymboles]), 1)
            }
        }
    },
    actions: {

    },
    getters: {

    }
  })