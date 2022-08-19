<script setup lang="ts">

    import { defineProps } from 'vue';

    interface Props {
        value : string,
        addClass : string
    }

    defineProps<Props>();

</script>

<template>
   <button class="btn ml-4 border-none p-4 px-6 shadow-2xl rounded-lg" :class="addClass">
    {{value}}
    <slot></slot>
  </button>
</template>
