<script setup lang="ts">

    import { ref, onMounted } from 'vue';
    import useStoreMissions from '../../store/store_missions';
    import Task from "../task/Task.vue";
    import Button from "../button/Button.vue";

    const storeMission = useStoreMissions();

    const input     = ref<{value : string} | null>(null)
    const filter    = ref<string>("all")
    const taskEdit = ref<{
        index : number,
        text  : string,
        selectTaskForEdit : boolean
    }>({
        index : 0,
        text : " ",
        selectTaskForEdit : false
    }) 
     

     onMounted( async () => {

        await storeMission.initialize();
     })

    const createTask = async () : Promise<void> => {

        if (input.value !== null && input.value.value.replace(/ /g, "") !== "") {

           await storeMission.addMission({
            id        : storeMission.missionItems.length,
            text      : input.value.value as string,
            condition : true,
            show      : true
           })

           input.value !== null ? input.value.value = "" : null;

        } else {

            console.log("yaah, data kosong");
        }
    }

    const editTask = () : void => {        

        if (input.value !== null && input.value.value.replace(/ /g, "") !== "") {

            storeMission.updateMission(taskEdit.value.index, {...storeMission.missionItems[taskEdit.value.index], text : input.value.value})

            taskEdit.value.selectTaskForEdit = false;

            input.value !== null ? input.value.value = "" : null;

        } else {

            console.log("yaah, data kosong");
        }
    }

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
                    @keypress.enter="taskEdit.selectTaskForEdit === false ? createTask() : editTask()" 
                    ref="input"
                    type="text" 
                    placeholder="Add a new task"
                    class="input basis-3/4 bg-transparent border-0 border-b-2 rounded-none p-3 focus:outline-none border-b-slate-900 text-gray-400 placeholder:ttext-gray-400 shadow-2xl" 
                />

                <Button 
                    @click="createTask()" 
                    value="Add" 
                    addClass="basis-1/4 bg-slate-900 text-gray-400 hover:text-gray-400"
                    v-show="taskEdit.selectTaskForEdit === false" 
                />
                <Button 
                    @click="editTask()" 
                    value="Edit" 
                    addClass="basis-1/4 bg-slate-900 text-gray-400 hover:text-gray-400"
                    v-show="taskEdit.selectTaskForEdit === true" 
                />
            </div>
            <div class="h-full mt-4">
                <Task 
                    v-for="(mission , index) in storeMission.missionItems"
                    v-show="filter === 'all' ? true : (filter === 'done' ? !mission.condition : mission.condition)"
                    :key="mission.id" 
                    :input="(mission.text)"
                    :conditions="[{'line-through': !mission.condition} , {'border-green-500': !mission.condition}]"
                    @changeCondition="storeMission.updateMission(index, {...mission, condition : !mission.condition})"
                    @delete="storeMission.deleteMission(mission.id)" 
                    @edit="taskEdit.index = mission.id , taskEdit.selectTaskForEdit = true , (input !== null ? input.value = mission.text : null)"
                />
            </div>
        </div>
        <div class="text-center">
            <button @click="storeMission.initialize()" class="btn bg-white border borde-gray-300  px-6 py-2 rounded-lg">
                Refresh
            </button>
        </div>
    </div>
</template>

<style scoped>
.all{
    @apply after:left-0 after:w-[3.25rem] sm:after:w-14
}

.done{
    @apply after:w-[4.25rem] sm:after:w-20 after:left-[50px] sm:after:left-[55px]
}

.undone{
    @apply after:w-[5.45rem] sm:after:w-[6.25rem] after:left-[119px] sm:after:left-[133px]
}
</style>