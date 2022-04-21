const TaskContract = artifacts.require("TasksContract");

contract("TasksContract", () => {

    before(async () => {
        this.tasksContract = await TaskContract.deployed()
    })

    it("migrate deployed succesfully", async () => {
        const address = this.tasksContract.address

        assert.notEqual(address, null);
        assert.notEqual(address, undefined);
        assert.notEqual(address, 0x0);
        assert.notEqual(address, "");



    })

    it("get Tasks List", async () => {



        const tasksCounter = await this.tasksContract.taskCounter()
        const task = await this.tasksContract.tasks(tasksCounter)

        assert.equal(task.id.toNumber(), tasksCounter);
        assert.equal(task.title, "tarea ejemplo");
        assert.equal(task.description, "la descripcion");
        assert.equal(task.done, false);
        assert.equal(tasksCounter, 1);



    })

    it("task created succesfully", async () => {
        const result = await this.tasksContract.createTask("some task", "description two");
        const taskEvent = result.logs[0].args;
        const taskCounter = await this.tasksContract.taskCounter();

        assert.equal(taskCounter, 2)
        assert.equal(taskEvent.id.toNumber(), 2);
        assert.equal(taskEvent.title, "some task");
        assert.equal(taskEvent.description, "description two");
        assert.equal(taskEvent.done, false);

    });

    it("task toggle done", async ()  =>{
      const result = await this.tasksContract.toggleDone(1);

      const taskEvent = await result.logs[0].args;
      const task = await this.tasksContract.tasks(1);
      
      assert.equal(task.done, true);
      assert.equal(taskEvent.done, true);
      assert.equal(taskEvent.id, 1);
    });

});