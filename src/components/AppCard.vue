<template>
  <keep-alive>
    <div class="card" :class="{'card--not-select': !select}" v-if="updatedProp" @click="selectItem">
      <div class="card__content">
        <div class="card__title">
          <h3 class="card__title__city">
            {{ card.name }}
            <span v-if="select">,{{ card.sys.country }}</span>
          </h3>
          <span v-if="select" class="card__title__country">Your current location</span>
          <span v-else class="card__title__country">{{ countryName }}</span>
        </div>
        <ul class="card__list">
          <li class="card__list__item">
            <span>Weather</span>
            <span>{{ card.weather[0].description }}</span>
          </li>
          <li class="card__list__item">
            <span>Temperature</span>
            <span>{{ floorCel }} &#176; C</span>
          </li>
          <li class="card__list__item">
            <span>Humidity</span>
            <span>{{ card.main.humidity }} %</span>
          </li>
        </ul>
        <span class="card__time">{{ timeMessage }}</span>
        <div class="card__footer" :class="{'card__footer--select': select}">
          <SimpleButton v-if="!select" text="REMOVE" :active="true" @action="removeCard"/>
          <SimpleButton text="RELOAD" :active="true" @action="reloadCard"/>
        </div>
      </div>
    </div>
  </keep-alive>

</template>

<script>
import SimpleButton from '@/components/SimpleButton'
import { countryCode } from '../store/state.js'
import moment from 'moment'
// import _ from 'lodash'
import { ref, computed, onDeactivated } from 'vue'

export default {
  name: 'AppCard',
  emits: ['remove', 'reload', 'spinner', 'select'],
  props: {
    card: {
      type: Object
    },
    select: {
      type: Boolean,
      required: true,
      default: () => false
    }
  },
  setup (prop, { emit }) {
    const isActiveCard = ref(false)
    const timeMessage = ref('')
    const intervalId = ref(null)

    const updateTime = () => {
      intervalId.value = setInterval(() => {
        timeMessage.value = moment().startOf(prop.card.date).fromNow()
      }, 60000)
    }

    if (prop.card === undefined && prop.select) {
      emit('spinner', true)
    } else {
      emit('spinner', false)
      timeMessage.value = moment().startOf(prop.card.date).fromNow()
      updateTime()
    }

    const updatedProp = computed(() => prop.card !== undefined)

    onDeactivated(() => {
      clearInterval(intervalId.value)
    })

    const removeCard = () => {
      clearInterval(intervalId.value)
      emit('remove', prop.card.name)
    }

    const reloadCard = () => {
      clearInterval(intervalId.value)
      emit('reload', prop.card.name)
    }

    const selectItem = () => {
      if (!prop.select) {
        emit('select', prop.card.name)
      }
    }

    const countryName = computed(() => prop.card ? countryCode[prop.card.sys.country] : '')

    const floorCel = computed(() => Math.floor(prop.card.main.temp))

    return {
      isActiveCard,
      timeMessage,
      updatedProp,
      removeCard,
      reloadCard,
      selectItem,
      countryCode,
      countryName,
      floorCel
    }
  },
  components: {
    SimpleButton
  }
}
</script>

<style scoped lang="scss">
@import '../assets/style/var';

.card {
  box-shadow: 0px 2px 10px rgba(10, 10, 10, 0.25);
  border-radius: 6px;
  padding: 24px;
  width: 100%;
  min-width: 290px;
  max-width: 824px;
  transition: all .3s;
  cursor: pointer;

  &--not-select {
    &:hover {
      box-shadow: 0px 2px 10px $purple;
    }
  }

  &__content {

  }

  &__title {
    &__city {
      font-size: 32px;
      font-weight: 700;
      margin-bottom: 15px;

    }

    &__country {

      font-size: 18px;
    }
  }

  &__list {
    margin-top: 40px;

    &__item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-weight: 400;
      font-size: 18px;
      border-bottom: 1px solid $lightGrayBord;
      padding: 12px 0;
    }
  }

  &__time {
    display: flex;
    justify-content: flex-end;
    font-size: 16px;
    color: $lightGray;
  }

  &__footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 32px;

    &--select {
      justify-content: flex-end;
    }
  }

}
</style>
