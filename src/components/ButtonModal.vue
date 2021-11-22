<template>
<button class="button" @click="openModal">
  <IconBase title="plus" width="14" height="14"/>
</button>
</template>

<script>
import IconBase from '@/components/IconBase'
export default {
  emits: ['open'],
  name: 'ButtonModal',
  setup (prop, { emit }) {
    const openModal = () => emit('open', true)
    return {
      openModal
    }
  },
  components: {
    IconBase
  }
}
</script>

<style scoped lang="scss">
@import '../assets/style/var';
.button {
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  width: 56px;
  height: 56px;
  background-color: $purple;
  transition: all .3s;
  box-shadow: 0px 4px 5px rgba(0, 0, 0, 0.14), 0px 1px 10px rgba(0, 0, 0, 0.12), 0px 2px 4px rgba(0, 0, 0, 0.2);

  &:hover {
    opacity: 0.9;
  }
}
</style>
