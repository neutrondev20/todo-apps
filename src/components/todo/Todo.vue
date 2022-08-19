<script setup lang="ts">

    import { reactive, ref, onUpdated } from 'vue';
    import {addTask, updateTask} from "./Todo";
    import Task from "../task/Task.vue";
    import Button from "../button/Button.vue";
    // import { createTask } from ""

    type Mission = {
        id : number,
        text : string,
        condition : boolean,
        show : boolean
    }

    let missions    = reactive<Mission[]>([])
    const input     = ref<{value : string} | null>(null)
    const filter    = ref<string>("all")
    const task_edit = ref<{
        index : number,
        text  : string,
        selectTaskForEdit : boolean
    }>({
        index : 0,
        text : " ",
        selectTaskForEdit : false
    }) 
     

    const createTask = () : void => {

        if (input.value !== null) {

                
            addTask(input.value.value, missions);

            input.value.value = "";

        } else {

            console.log("yaah, data kosong");
        }
    }

    const editTask = () : void => {

        updateTask(missions[task_edit.value.index], input.value?.value as string)

        task_edit.value.selectTaskForEdit = false;

        input.value !== null ? input.value.value = "" : null;
    }

    onUpdated(() => {

        localStorage.setItem("missions", JSON.stringify(missions));
    })

    const task = localStorage.getItem("missions") !== null ? JSON.parse(localStorage.getItem("missions") as string) : []

    task.forEach((mission : Mission) => {
        
        missions.push(mission);
    });
</script>

<template>
<div class="flex justify-center items-baseline h-full pt-4 sm:p-16">
        <div class="w-[30rem] h-full m-4 flex flex-col">
            <div class="w-full mb-12 flex justify-between items-center">
                <div>
                    <i class="fa-solid fa-list-ul mr-4 sm:text-2xl align-baseline text-gray-400"></i>
                    <h1 class="text-sm sm:text-2xl font-bold inline-block text-gray-400">To Do List</h1>
                </div>
                <div>
                    <ul :class="{'all' : filter === 'all' , 'done' : filter === 'done' , 'undone' : filter === 'undone'}"
                        class="flex justify-between relative overflow-hidden afte:block after:h-[40px] sm:after:h-[45px] after:bg-slate-900 after:absolute after:rounded-lg after:-z-10 after:transition-all">
                        <li @click="filter = 'all'" class="py-2 px-4 sm:text-xl text-gray-400 cursor-pointer hover:text-gray-800">All</li>
                        <li @click="filter = 'done'" class="p-2 px-4 sm:text-xl text-gray-400 cursor-pointer hover:text-gray-800">Done</li>
                        <li @click="filter = 'undone'" class="p-2 px-4 sm:text-xl text-gray-400 cursor-pointer hover:text-gray-800">Undone</li>
                    </ul>
                </div>
            </div>

            <div class="w-full flex flex-row">
                <input 
                    @keypress.enter="task_edit.selectTaskForEdit === false ? createTask() : editTask()" 
                    ref="input"
                    type="text" 
                    placeholder="Add a new task"
                    class="input basis-3/4 bg-transparent border-0 border-b-2 rounded-none p-3 focus:outline-none border-b-slate-900 text-gray-400 placeholder:ttext-gray-400 shadow-2xl" 
                />

                <Button 
                    @click="createTask()" 
                    value="Add" 
                    addClass="basis-1/4 bg-slate-900 text-gray-400 hover:text-gray-400"
                    v-show="task_edit.selectTaskForEdit === false" 
                />
                <Button 
                    @click="editTask" 
                    value="Edit" 
                    addClass="basis-1/4 bg-slate-900 text-gray-400 hover:text-gray-400"
                    v-show="task_edit.selectTaskForEdit === true" 
                />
            </div>
            <div class="h-full mt-4">
                <Task 
                    v-for="(mission , index) in missions" 
                    :key="mission.id" 
                    :input="(mission.text)"
                    :conditions="[{'line-through': !mission.condition} , {'border-green-500': !mission.condition}]" 
                    @showFunc="missions.splice(index , 1)" 
                    @changeCondition="mission.condition = !mission.condition"
                    @edit="task_edit.index = mission.id , task_edit.selectTaskForEdit = true , (input !== null ? input.value = mission.text : null)"
                    v-show="filter === 'all' ? true : (filter === 'done' ? !mission.condition : mission.condition)"
                />
            </div>
        </div>
    </div>
</template>

<style scoped>

</style>