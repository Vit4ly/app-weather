<template>
  <teleport to="body">
    <transition name="switch">
      <div class="back-drop">
        <div class="modal">
          <div class="modal__content">
            <h3 class="modal__title">Choose a city</h3>
            <p class="modal__sub-title">
              To find city start typing and pick one from the suggestions
            </p>
            <div class="modal__main">
              <input
                type="text"
                class="input modal__input"
                placeholder="Search city"
                v-model.trim="v$.city.$model"
                @keypress.enter="addCity"
                @input="checkCurrentAlphabet"
              >
              <small class="modal__input--error" v-if="updateMessage">{{ updateMessage }}</small>
              <small class="modal__input--error" v-if="!currentAlphabet">{{ updateMessage }}</small>
              <small
                v-if="v$.city.$dirty && v$.city.$invalid"
                :class="{ 'modal__input--error': v$.city.required }"
              >Enter current city</small>
              <div class="modal__main-footer">
                <SimpleButton
                  class="modal__button"
                  :active="setBoolean(city.length)"
                  text="CLEAR"
                  @action="clearInput"
                />

                <div class="modal__main-footer__col">

                  <SimpleButton
                    class="button--active modal__button"
                    text="CANCEL"
                    :active="setBoolean(city.length)"
                    @action="closeModal"
                  />

                  <SimpleButton
                    class="modal__button"
                    text="ADD"
                    :active="setBoolean(city.length)"
                    @action="addCity"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script>
import SimpleButton from '@/components/SimpleButton'
import useVuelidate from '@vuelidate/core'
import { required, minLength } from '@vuelidate/validators'
import { computed, reactive, ref } from 'vue'

export default {
  name: 'AppModal',
  emits: ['close', 'city', 'checked'],
  props: {
    list: {
      type: Object
    },
    request: {
      type: Object
    }
  },
  setup: function (prop, { emit }) {
    const city = ref('')
    const message = ref('')
    const cityList = reactive(new Set())
    const currentAlphabet = ref(false)
    Array.from(prop.list.keys())
      .forEach(key => cityList.add(key))

    const clearInput = () => {
      city.value = ''
    }

    const closeModal = () => {
      emit('close', false)
    }

    const checkCurrentAlphabet = () => {
      currentAlphabet.value = /[а-я]/i.test(city.value)
      if (currentAlphabet.value) {
        message.value = 'City name must be in English'
      } else {
        message.value = ''
      }
    }

    const addCity = async () => {
      if (cityList.has(city.value)) {
        message.value = `City ${city.value} has already been added`
        // eslint-disable-next-line no-return-assign
        setTimeout(() => message.value = '', 3000)
      } else if (prop.request.flag) {
        emit('city', city.value)
        city.value = ''
        message.value = ''
        closeModal()
      } else {
        message.value = prop.request.message
      }
    }

    const updateMessage = computed(() => message.value)

    const setBoolean = (param) => Boolean(param)
    const rules = {
      city: {
        required,
        minLength: minLength(3)
      }
    }
    const v$ = useVuelidate(rules, { city })
    console.log(v$)
    return {
      city,
      clearInput,
      closeModal,
      addCity,
      setBoolean,
      updateMessage,
      checkCurrentAlphabet,
      currentAlphabet,
      v$
    }
  },

  components: {
    SimpleButton
  }
}
</script>

<style scoped lang="scss">
@import '../assets/style/var';
@import '../assets/style/mixins';

.modal {
  position: relative;

  &__title {
    font-weight: 700;
    font-size: 32px;
    @media (max-width: $tablet-small) {
      font-size: calc(1vw + 20px);
    }
  }

  &__sub-title {
    font-size: 24px;
    color: $gray;
    width: 100%;
    max-width: max-content;
    margin-top: 16px;
    margin-right: 118px;

    @media (max-width: $tablet-small) {
      font-size: calc(1vw + 14px);
    }
  }

  &__content {
    padding: 24px;
    width: 100%;
    max-width: 751px;
    color: #7d7d7d;
    box-sizing: border-box;
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0px 16px 24px rgba(0, 0, 0, 0.14), 0px 6px 30px rgba(0, 0, 0, 0.12), 0px 8px 10px rgba(0, 0, 0, 0.2);
    text-align: left;
    max-height: max-content;
    overflow: hidden;
  }

  &__input--error {
    color: $purple;
    transition: all .3s;
  }

  &__main {
    margin-top: 67px;
  }

  &__main-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 140px;

    &__col {
      display: flex;
      align-items: center;
      gap: 31px;
    }
  }

  &__button {

  }
}

body.back-drop {
  overflow-x: hidden;
}

.back-drop {
  display: flex;
  align-items: center;
  justify-content: center;
  overflow-x: hidden;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  height: 100%;
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
  background-color: $bgModal;
  text-align: center;
  z-index: 15;
}
</style>
