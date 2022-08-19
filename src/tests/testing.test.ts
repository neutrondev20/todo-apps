import { addTask, updateTask } from './../components/todo/Todo';
import { it, test, expect } from "vitest"

test("add task & update task testing", () => {
    type Mission = {
        id : number,
        text : string,
        condition : boolean,
        show : boolean
    }

    const missions : Mission[] = []

    expect(addTask("hello", missions)).toBeUndefined()

    expect(missions).toHaveLength(1)

    expect(updateTask(missions[0], "world")).toBeUndefined();

    expect(missions[0].text).toEqual("world")
})