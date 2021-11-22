<template>
<button
  class="button"
  :class="{'button--active': active}"
  :disabled="blocker"
  @click.stop="emitHandler">
  {{ text }}
</button>
</template>

<script>
export default {
  name: 'SimpleButton',
  emits: ['action'],
  props: {
    text: {
      type: String,
      required: true
    },
    active: {
      type: Boolean,
      required: true,
      default: () => true
    },
    blocker: {
      type: Boolean,
      default: () => false
    }
  },

  setup (prop, { emit }) {
    const emitHandler = () => {
      console.log(true)
      emit('action', true)
    }
    return {
      emitHandler
    }
  }
}
</script>

<style scoped>

</style>
