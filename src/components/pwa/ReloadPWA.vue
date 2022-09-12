<script lang="ts" setup>
    import { useRegisterSW } from 'virtual:pwa-register/vue'

    const {offlineReady, needRefresh, updateServiceWorker} = useRegisterSW()

    const close = async () => {
        offlineReady.value = false
        needRefresh.value = false
    }

    console.log(offlineReady.value);
    console.log(needRefresh.value);
</script>

<template>
   <div v-if="!offlineReady || !needRefresh" class="w-full p-4 bg-gray-500">
    <div class="message">
      <span v-if="offlineReady">
        App ready to work offline
      </span>
      <span v-else>
        New content available, click on reload button to update.
      </span>
    </div>
    <div>
        <button class="btn bg-white border borde-gray-300  px-6 py-2 rounded-lg" v-if="needRefresh" @click="updateServiceWorker()">
            Reload
        </button>
        <button class="btn bg-white border borde-gray-300  px-6 py-2 rounded-lg" @click="close">
        Close
        </button>
    </div>
  </div>
</template>

<style scoped>
</style>