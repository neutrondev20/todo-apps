<script setup lang="ts">
    
    import { defineProps } from "vue";

    interface Props {
        input : string,
        conditions : [{
            'line-through' : boolean
        }, {
            'border-green-500' : boolean
        }]
    }

    defineProps<Props>()

</script>

<template>
    <div :class="conditions[1]" class="task_animation w-full bg-slate-900 p-3 my-4 border-0 border-l-4  rounded-r-lg flex justify-between items-center shadow-2xl">
            <p
                @click="$emit('changeCondition')"
                :class="conditions[0]"
                class="select-none cursor-pointer text-gray-400 overflow-hidden w-[80%] h-6 relative after:w-8 after:h-[1.5rem] after:bg-gradient-to-l after:from-slate-900 after:absolute after:block after:right-0 after:top-0"
            >
                {{input}}
            </p>
            <div>
                <i @click="$emit('showFunc')" class="fa-solid fa-trash-can text-red-500 mr-4 cursor-pointer"></i>
                <i @click="$emit('edit')" class="fa-solid fa-pen-to-square text-green-500 cursor-pointer"></i>
            </div>
        </div>
</template>

<style scoped> 
    .task_animation {
        animation: task_animation .2s cubic-bezier(0, 0, 0.2, 1) forwards;
    }

    @keyframes task_animation {
        0% {
            transform: scale(.5);
            opacity: 0;
        }

        100% {
            transform: scale(1);
            opacity: 1;
        }
    }
</style>