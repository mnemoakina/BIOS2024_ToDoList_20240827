const taskInputTxt  = document.querySelector('#taskInputTxt');
const taskInputBtn  = document.querySelector('#taskInputBtn');
const taskListUL    = document.querySelector('#tasklist');
const taskInputForm = document.querySelector('#taskInputForm');
const modal         = document.querySelector("#modal");
const modalTitle    = document.querySelector("#modalTitle");
const modalText     = document.querySelector("#modalText");

const taskList = []; /* Example task inside: {taskID: 0, description: "Lorem ipsum dolor sit amet", checked: false} */

const taskManager = {
  idCounter: 0,
  tasks : taskList
}

function setupEvents(){
  // Previene el envío del formulario. Evita que se autorefresque la pagina
  taskInputForm.addEventListener('submit', (event) => {
    event.preventDefault();
    // Control de datos recibidos. Filtro: Al menos dos caracteres, hasta 256.
    if (taskInputTxt.value.trim().length >= 2 && taskInputTxt.value.trim().length <= 256){      
      addTask();
    } else {
      alert("Between 2 to 256 valid characters are needed.");
    }
  });
}

function addTask(){ 
  const newTask = {
    taskID: taskManager.idCounter,
    description: taskInputTxt.value.trim(),
    checked:false  
  };    
  console.log(newTask.description);  
  taskManager.tasks.push(newTask);    
  taskManager.idCounter++;     
  showTasklist();
}

function showTasklist(){
  //Refrescamos la zona para nuevo despliegue de tareas
  taskListUL.innerHTML = '';     

  // Listado completo de tareas (pendientes y completas) priorizando las mas nuevas  
  try{
    for (let i = taskManager.tasks.length-1; i>=0; i--){    
      const contTask  = document.createElement("li");
      const txtTask   = document.createElement("pre"); 
      const checkbox  = document.createElement("input");   
      const btnRemove = document.createElement("button");
      const btnWatch  = document.createElement("button");
      //control de la imagen de borrar tarea al refrescar
      const img = document.createElement('img'); 
      img.src = "styles/img/remove.png";           
      //control de la imagen de ver tarea
      const imgWatch = document.createElement('img'); 
      imgWatch.src="styles/img/watch.png";
      //enlace del boton watch, para abrir luego el modal
      const enlace = document.createElement('a');
      // Asignar el atributo 'href' con el valor '#modal'
      enlace.setAttribute('href', '#modal');

      //control del checkbox al refrescar
      checkbox.type="checkbox";      
      if (taskManager.tasks[i].checked){
        checkbox.checked=true;
        txtTask.classList.add("doneTask");
      }
      btnWatch.classList.add("tasklist__task__watchTask");
      checkbox.classList.add("tasklist__task__check");
      btnRemove.classList.add("tasklist__task__removeTask"); 

      txtTask.textContent = taskManager.tasks[i].description;

      //Renderizados en pantalla   
      enlace.appendChild(imgWatch);
      btnWatch.appendChild(enlace);  
      btnRemove.appendChild(img);  
      contTask.appendChild(txtTask);       
      contTask.appendChild(checkbox);
      contTask.appendChild(btnWatch);
      contTask.appendChild(btnRemove);
      taskListUL.appendChild(contTask);  

      //Anexamos evento al nuevo check creado para poder cambiar de estado la tarea.       
      checkbox.addEventListener("change", () => {
        if (checkbox.checked) {
          taskManager.tasks[i].checked = true
            txtTask.classList.add("doneTask");
        } else {
          taskManager.tasks[i].checked = false
            txtTask.classList.remove("doneTask");
        }   
        // Se guarda el estado del tasklist
        saveListLocalStorage();     
      });   

      btnWatch.addEventListener("click",() => {
        console.log(modalTitle.textContent, modalText.textContent);
        
        modalTitle.textContent = `ACTIVIDAD #${taskManager.tasks[i].taskID}`;
        modalText.textContent = taskManager.tasks[i].description;        
      });

      btnRemove.addEventListener("click",() => {
        if (confirm("Are you sure you want to remove this task?"))
          removeTask(taskManager.tasks[i].taskID);
      });            
      // Salvamos la lista de tareas cada vez que hacemos el actualizado en pantalla.
      saveListLocalStorage();
    };
  } catch(error){
    console.log("Error:", error);    
  }  
  // UX: Se vacia el input al final del ingreso para evitar borrado manual.
  taskInputForm.reset();
}

function removeTask(id){  
  let i = 0;  
  while (i < taskManager.tasks.length) {
    if (taskManager.tasks[i].taskID === id) {
      taskManager.tasks.splice(i, 1);      
      break
    }
    i++;    
  }
  showTasklist();  
}

function saveListLocalStorage(){
  //almacena taskManager
  localStorage.setItem('taskManager', JSON.stringify(taskManager));
}

//retorna ultimo taskManager guardado en localStorage.
//si no hay nada guardado, devuelve un null,si da error lo muestra al dev
function loadListLocalStorage(){  
  let lista;
  try {
    lista = JSON.parse(localStorage.getItem('taskManager')); 
    
    if (lista === null || lista === undefined)
      return null;
    else
      return lista;      
  }catch(error){
    console.log(error);
    return;
  }  
};

function main(){  
  const loadedData = loadListLocalStorage();     
  setupEvents();    
  if (loadedData!==null){
    //Mueve la data cargada del localStorage al taskManager de la app
    taskManager.idCounter = loadedData.idCounter;
    taskManager.tasks     = loadedData.tasks;
  }  
  showTasklist();
}

main();