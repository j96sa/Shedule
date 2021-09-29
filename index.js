const d = document,
ls = localStorage,
$sectionNote = d.querySelector(".container .note"),
$noteListUL = d.querySelector(".note-list ul"),
$message = d.querySelector(".message p");

//iterador para el id de cada nota
let itr = 0,
notesArr = [],
editedNote;
ls.getItem("notes") ?notesArr = JSON.parse(ls.getItem("notes")) :notesArr=[];

class Note{
    constructor(id,data,text){
        this.data = data;
        this.text = text;
        this.id = id;
    };
};

class Functions{
    //funcion para insertar la nueva nota
    insertNewNote(){
        $sectionNote.innerHTML = `
            <textarea name="textarea" cols="" rows=""></textarea>
            <div class="confirm-buttons">
                <img class="cancel" src="./cancel.png" alt="">
                <img class="confirm" src="./checked.png" alt="">
            </div>
        `;
    }; 
    
    //funcion para insertar la lista de notas
    insertLI(arr){  
        let html = "";
        if (window.matchMedia("(min-width:600px)").matches){
            arr.forEach(e=>html += `<li><span>${e.data.replace(",","")}</span>  ${e.text.slice(0,16)}<button data-edit="${e.id}">view</button><button data-delete="${e.id}">delete</button></li>`);
        }else{
            arr.forEach(e=>html += `<li><span>${e.data.replace(",","")}</span>  ${e.text.slice(0,8)}<button data-edit="${e.id}">view</button><button data-delete="${e.id}">delete</button></li>`);
        };
        $noteListUL.innerHTML = html;        
    };
    
    //funcion para insertar los datos en el LocalStorage
    LSSet(x){
        ls.setItem("notes",JSON.stringify(x));
    };

    //funcion con toda la insertDatea para la insercion y el guardado de datos;
    insertDate(){
        //generar dinamicamente los id para poder modificar/eliminar/mostrar las notas guardadas
        let repeat = true,
        ids =[];
        while(repeat){
            notesArr.forEach(e=>ids.push(e.id));
            ids.some(e=>e===itr) ?itr++ :repeat=false;
        };        
    
        //NOTA: insertar en el DOM y guardarla en el LocalStorage;
        let dat = new Date().toLocaleString().slice(0,-3),
        $textArea = d.querySelector(".note textarea");
        let currentNote = new Note(itr,dat,$textArea.value);
        notesArr.push(currentNote);
        this.LSSet(notesArr);
        $textArea.value = "";
        $sectionNote.innerHTML = "";
        this.insertLI(notesArr);  
        
        //para mostrar el mensaje de confirmacion
        $message.innerText = "note added successfully";
        $message.classList.remove("removed");
        $message.classList.add("added");
        setTimeout(() => {
            if($message.classList.contains("added")){
                $message.innerText = ""; 
                $message.classList.remove("added");
            };   
        }, 2500);
    };

    //funcion para modificar las notas en la lista
    editDate(){
        let currentText = d.querySelector(".note textarea").value,
        oldText = notesArr[editedNote].text;
        if(currentText!==oldText){
            notesArr.splice(editedNote,1);
            new Functions().insertDate();
        };
    };
};

/* INSERTANDO LA LISTA DE NOTAS */
new Functions().insertLI(notesArr);

d.addEventListener("click",e=>{
    //evento para insertar el campo(textarea) para compilar la nueva nota
    if(e.target===d.getElementById("new-note") || e.target===d.querySelector("#new-note *")) new Functions().insertNewNote();
  
    //evento para guardar y desechar la nota actual
    if(e.target === d.querySelector(".confirm-buttons .confirm") && d.querySelector("textarea").value!==""){        
        new Functions().insertDate();
    }else if(e.target === d.querySelector(".confirm-buttons .cancel")){
        $sectionNote.innerHTML = "";
    };

    //evento para eliminar la nota
    if(e.target.matches(`button[data-delete]`)){        
        let index = notesArr.findIndex(el=>el.id===parseInt(e.target.dataset.delete));        
        notesArr.splice(index,1);        
        new Functions().LSSet(notesArr);        
        e.target.parentElement.remove();
        d.querySelector(".note").innerHTML = "";

        //mensaje de nota eliminada
        $message.innerText = "note removed successfully";
        $message.classList.remove("added");
        $message.classList.add("removed");
        setTimeout(() => {
            if($message.classList.contains("removed")){
                $message.innerText = "";
                $message.classList.remove("removed");
            };
        }, 2500);
    };

    //evento para ver la nota;
    if(e.target.matches(`button[data-edit]`)){
        //para insertar el contenido de la nota seleccionada
        new Functions().insertNewNote();
        editedNote = notesArr.findIndex(el=>el.id===parseInt(e.target.dataset.edit));
        let currentNote = notesArr[editedNote];
        d.querySelector(".note textarea").value = `${currentNote.text}`;

        //para sustituir la nota seleccionada con el nuevo contenido guardado
        d.querySelector(".confirm-buttons img.confirm").classList = "re-confirm";
        console.log(currentNote);
    };
    
    //evento para modificar la nota
    if (e.target === d.querySelector(".confirm-buttons img.re-confirm")){        
        new Functions().editDate();
    };
});

d.addEventListener("keydown",e=>{
    //if(e.target === d.querySelector(".note textarea") && e.code === "Enter" && d.querySelector(".confirm-buttons img").lastElementChild.classList.contains("confirm")) new Functions().insertDate();       
    //if(e.target === d.querySelector(".note textarea") && e.code === "Enter" && d.querySelector(".confirm-buttons img").lastElementChild.classList.contains("re-confirm")) new Functions().editDate();    
    
    if(e.target === d.querySelector(".note textarea") && e.code === "Enter" && d.querySelectorAll(".confirm-buttons img")[1].classList.contains("confirm")){
        new Functions().insertDate();        
    }else if(e.target === d.querySelector(".note textarea") && e.code === "Enter" && d.querySelectorAll(".confirm-buttons img")[1].classList.contains("re-confirm")){        
        new Functions().editDate();
    };         
});
































