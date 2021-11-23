<template>
  <div class='app'>
    <div class="container">
      <h1 class="app__title">World Weather</h1>
      <p class="app__sub-title">Watch weather in your current location</p>
      <keep-alive>
        <div class="app__main" v-if="cardList.size">
          <div class="app__main__body" v-for="(el, idx) in arrayFomMap" :key="symbolIdx(idx)">
            <AppCard
              v-if="el.select"
              :card="el"
              :select="true"
              @reload="reloadCard"
            />
          </div>
          <div class="app__main__footer">
            <AppCard
              v-for="(el, idx) in arrayFomMap"
              :key="symbolIdx(idx)"
              @spinner="toggleSpinner"
              :card="el"
              :select="false"
              @remove="removeCard"
              @reload="reloadCard"
              @select="selectedCard"
            />
          </div>
        </div>
      </keep-alive>
    </div>
    <div class="app__button">
      <ButtonModal @open="openModal"/>
    </div>
    <AppModal
      v-if="isActiveModal"
      @close="closeModal"
      @city="addCity"
      :list="cardList"
    />
    <AppSpinner v-if="isActiveSpinner"/>
  </div>
</template>

<script>
import AppModal from '@/components/AppModal'
import ButtonModal from '@/components/ButtonModal'
import AppCard from '@/components/AppCard'
import AppSpinner from '@/components/AppSpinner'
import { REQUEST_CITY_WEATHER, REQUEST_WEATHER_LAT_LON } from './store/actions'
import { REQUEST_GEO_POSITION } from './store/mutations'
import { ref, reactive, computed } from 'vue'

export default {
  name: 'App',

  setup () {
    const isActiveModal = ref(false)
    const isActiveSpinner = ref(false)
    const cardList = reactive(new Map())
    const geoPosition = ref(false)
    const options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
    }
    const coords = reactive({
      lat: 0,
      lon: 0
    })

    const toggleSpinner = (flag) => {
      isActiveSpinner.value = flag
    }

    toggleSpinner(true)

    const setStorage = (list) => {
      localStorage.setItem('list', JSON.stringify(Array.from(list.entries())))
    }

    function addedNewCity (city) {
      cardList.set(city.name, city)
      setStorage(cardList)
    }

    function success (pos) {
      geoPosition.value = true
      coords.lat = pos.coords.latitude
      coords.lon = pos.coords.longitude
      REQUEST_WEATHER_LAT_LON(coords).then(el => {
        el.select = true
        addedNewCity(el)
      })
    }

    function error (err) {
      console.warn(`ERROR(${err.code}): ${err.message}`)
    }

    REQUEST_GEO_POSITION(success, error, options)

    if (localStorage.getItem('list')) {
      toggleSpinner(true)
      const list = JSON.parse(localStorage.getItem('list'))
      list.forEach(el => cardList.set(el[0], el[1]))
      setTimeout(() => toggleSpinner(false), 1000)
    }

    const symbolIdx = (idx) => Symbol(idx)

    const openModal = () => {
      document.documentElement.style.overflow = 'hidden'
      isActiveModal.value = true
    }

    const closeModal = () => {
      document.documentElement.style.overflow = 'auto'
      isActiveModal.value = false
    }

    const addCity = async (city) => {
      toggleSpinner(true)
      await REQUEST_CITY_WEATHER(city).then(el => {
        if (el) {
          addedNewCity(el)
          setTimeout(() => toggleSpinner(false), 1000)
        }
      })
    }

    const selectedCard = (name) => {
      if (cardList.size) {
        // eslint-disable-next-line no-return-assign
        cardList.forEach((value, key, map) => value.select = false)
        cardList.get(name).select = true
      }
    }

    const removeCard = (name) => {
      toggleSpinner(true)
      cardList.delete(name)
      setStorage(cardList)
      setTimeout(() => toggleSpinner(false), 1000)
    }

    const reloadCard = async (name) => {
      toggleSpinner(true)
      await REQUEST_CITY_WEATHER(name).then(el => {
        addedNewCity(el)
        selectedCard(el.name)
        setTimeout(() => toggleSpinner(false), 1000)
      })
    }

    const arrayFomMap = computed(() => Array.from(cardList.values()))
    setTimeout(() => toggleSpinner(false), 1000)
    return {
      isActiveModal,
      cardList,
      isActiveSpinner,
      arrayFomMap,
      openModal,
      closeModal,
      addCity,
      symbolIdx,
      toggleSpinner,
      selectedCard,
      removeCard,
      reloadCard
    }
  },

  components: {
    AppCard,
    ButtonModal,
    AppModal,
    AppSpinner
  }
}
</script>

<style lang='scss'>
@import './assets/style/var';

.app {
  position: relative;
  width: 100%;
  height: 100%;

  &__spinner {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }

  &__title {
    font-size: 70px;
    font-weight: 300;
    color: $primary;
    text-align: center;
    @media (max-width: 592px) {
      font-size: 50px;
    }
  }

  &__sub-title {
    font-size: 24px;
    font-weight: 400;
    color: $gray;
    margin-top: 32px;
    text-align: center;

  }

  .app__button {
    position: fixed;
    right: 2%;
    bottom: 1%;
  }

  .app__main {
    margin-top: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-flow: column;

    &__body {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;
    }

    &__footer {
      max-width: 1560px;
      margin-top: 80px;
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 40px;
      margin-bottom: 34px;
      @media (max-width: $view-desktop) {
        grid-template-columns: repeat(3, 1fr);
      }
      @media (max-width: $tablet-min-width) {
        grid-template-columns: repeat(2, 1fr);
      }
      @media (max-width: $tablet-smallXS) {
        grid-template-columns: repeat(1, 1fr);
      }
    }
  }
}

</style>
