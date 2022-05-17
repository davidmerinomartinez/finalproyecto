App = {

    contracts: {},

    



    init: async () => {
        await console.log("Loaded")

        //carga ethereum
        await App.loadEthereum()
        //carga contrato
        await App.loadContracts()
        //pinta en pantalla
        await App.renderTasks()
       

        
        



    },




    loadEthereum: async () => {
        if (window.ethereum) {
            console.log("ethereum ok")
            App.web3Provider = window.ethereum
            await window.ethereum.request({ method: "eth_accounts" })
            //load accounts
            accounts = await ethereum.request({ method: 'eth_accounts' });
            App.account = accounts[0];  //cuenta que esta conectada a la cartera
        } else if (window.web3) {
            web3 = new web3(window.web3.currentProvider)  //abre la cartera de metamamask para login

        }
        else { console.log("No esta instalado Metamask") }
        App.render()

    },





    loadContracts: async () => {
//Establecemos comunicacion asincrona con el contrato ya migrado y compilado a json.
        const res = await fetch("TasksContract.json")
        const tasksContractJSON = await res.json()



        App.contracts.tasksContract = TruffleContract(tasksContractJSON)

        App.contracts.tasksContract.setProvider(App.web3Provider)

        App.tasksContract = await App.contracts.tasksContract.deployed()

    },

    render: () => { //inserta en html billetera
        document.getElementById("account").innerText = App.account;

    },

    renderTasks: async () => { //llama al contador y lo parsea
        const taskCounter = await App.tasksContract.taskCounter()
        const taskCounterNumber = taskCounter.toNumber()

        let html = ""
//recorre cada parte de el mensaje
        for (let i = 1; i <= taskCounterNumber; i++) {
            
            
            const task = await App.tasksContract.tasks(i)
            console.log(task)
            const taskid = task[0]
            const taskTitle = task[1]
            const taskDescription = task[2]
            const taskDone = task[3]
            const taskCreated = task[4]
//guarda en una variable  el mensaje al completo 
let  taskElement  = '<div id=anotaciones> <span><b>' + taskTitle + '</b></span> <div>' + taskDescription + '</div><input type="checkbox" data- id=' + taskid + ' id="elCheck" onchange=App.toggleDone(this) />Recibido<p>Creada en ' + new  Date ( taskCreated * 1000 ) . toLocaleString ( ) + '</div><br>' ;

//acumula todas los mensajes 
            html += taskElement;
         
          
          

        }

        
//inserta en html el total de los mensajes
        document.getElementById("tasksList").innerHTML = html;
        

       

    },



//guarda en result los campos introducidos por el usuario y su direccion de billetera
    createTask: async (title, description) => {
        const result = await App.tasksContract.createTask(title, description, { from: accounts[0] })
        console.log(result.logs[0].args)

    },

    
 //pone en true o false el elemento check recibido
    toggleDone : async (element) => {

//usando la propiedad del input check data-id guardamos esta en una variable
      const taskId =element.dataset.id
//selecciona el id del mensaje teniendo en cuenta la cuenta de origen en billetera para pagar el gas de la transaccion y cambia su estado al contrario
      await App.tasksContract.toggleDone(taskId, {
          from: App.account,});

         // window.location.reload();
    },
    
};
   



//arranca todo el proceso

App.init()

