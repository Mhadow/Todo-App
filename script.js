let i = 0; // the id of a list element
let OK = 0; // a number that counts all the checked as done todos
let nmbr = 0; // the number of todos

if (localStorage.getItem("number_of_todos") === null) {
  localStorage.setItem("number_of_todos", 0);
}

if (localStorage.getItem("number_of_checked_todos") === null) {
  localStorage.setItem("number_of_checked_todos", 0);
}

if (localStorage.getItem("todo_id") === null) {
  localStorage.setItem("todo_id", 0);
}

i = localStorage.getItem("todo_id");
OK = localStorage.getItem("number_of_checked_todos");
nmbr = localStorage.getItem("number_of_todos");

// here the list of todos is saved so that everything stays saved after a page refresh
if (localStorage.getItem("bodyEl") === null) {
  localStorage.setItem(
    "bodyEl",
    `<h1 class="header">todos</h1>
    <div class="big-container">
      <div class="top"><i id="toggle_check" class="fa-solid fa-chevron-down"></i><input type="text" placeholder="What needs to be done?" id="input" /></div>
      <div class="content" id="notes_content">
        <ul id="todos" class="todos_list"></ul>
        <ul id="bottom" class="filters">
            <li id="f1"></li>
            <li id="f2" class="active">All</li>
            <li id="f3">Active</li>
            <li id="f4">Completed</li>
            <li id="f5">Clear completed</li>
        </ul>
      </div>
    </div>
    <h6 class="footer">Double click to edit a todo</h6>
    <script src="script.js"></script>`
  );
}

// getting the page content from localStorage
var bodyEl = document.querySelector("body");
bodyEl.innerHTML = localStorage.getItem("bodyEl");

// initial varibles declarations
const todos = document.getElementById("todos");
const inputEl = document.getElementById("input");
const bottomEl = document.getElementById("bottom");
var listEls = document.querySelectorAll("ul.todos_list li");
var listEl = document.getElementById("todos");
var deleteEls = document.getElementsByClassName("fa-circle-xmark");
var checkIconEls = document.getElementsByClassName("fa-regular");
var toggleEl = document.getElementById("toggle_check");
var todoContentEls = document.getElementsByClassName("todo_value");
var contents = Array.from(todoContentEls);
var filter1El = document.getElementById("f1");
var filter2El = document.getElementById("f2");
var filter3El = document.getElementById("f3");
var filter4El = document.getElementById("f4");
var filter5El = document.getElementById("f5");

// here the program listens for the enter key press that adds the text from the input block to the TO DO list
inputEl.addEventListener("keydown", (e) => {
  if (e.code === "Enter") {
    if (todos.style.display === "") {
      todos.style.display = "block";
      bottomEl.style.display = "block";
    }

    // here a new to do is added to the list
    let li = document.createElement("LI");
    li.setAttribute("id", `todo#${++i}`);
    todos.appendChild(
      li
    ).innerHTML = `<div id="check_container" class="check"><i id="l${i}" class="fa-regular fa-circle"></i><span id="todo_content${i}" class="todo_value">${inputEl.value}</span></div><span id="delete_el${i}" class="delete"><i class="fa-solid fa-circle-xmark"></i></span>`;

    ++nmbr;
    // shows the number of todos left.. to do
    filter1El.textContent = `${nmbr - OK < 0 ? 0 : nmbr - OK} items left`;

    // the input text box is cleared after a new note is added
    inputEl.value = "";

    // makes a todo editable on dblclick
    contents.forEach((el) => {
      el.addEventListener("dblclick", (e) => {
        e.contentEditable = "true";
      });
    });

    var listElmnt = document.getElementById(`l${i}`);
    var listToDo = document.getElementById(`todo#${i}`);
    var listDelete = document.getElementById(`delete_el${i}`);
    var todoContentEl = document.getElementById(`todo_content${i}`);

    // saving the page content to localStorage after new ToDos were added
    bodyEl = document.querySelector("body");
    localStorage.setItem("bodyEl", bodyEl.innerHTML);

    // this is to listen for clicks on the newly created todo
    listElmnt.addEventListener("click", () => {
      if (listElmnt.classList.contains("fa-circle")) {
        listElmnt.classList.remove("fa-circle");
        listElmnt.classList.add("fa-circle-check");
        listElmnt.nextElementSibling.classList.add("marked");
        OK++;

        //shows the option to remove all completed todos
        filter5El.style.display = "block";
      } else {
        listElmnt.classList.remove("fa-circle-check");
        listElmnt.classList.add("fa-circle");
        listElmnt.nextElementSibling.classList.remove("marked");
        OK--;

        //hides the option to remove all completed todos
        filter5El.style.display = "none";
      }

      // updates the number of todos left.. to do
      filter1El.textContent = `${nmbr - OK < 0 ? 0 : nmbr - OK} items left`;

      if (OK === Array.from(checkIconEls).length) {
        toggleEl.classList.add("opacity-class");
      } else {
        toggleEl.classList.remove("opacity-class");
      }

      localStorage.setItem("number_of_checked_todos", OK);
      localStorage.setItem("number_of_todos", nmbr);

      // saving the page content to localStorage after new ToDos were added
      bodyEl = document.querySelector("body");
      localStorage.setItem("bodyEl", bodyEl.innerHTML);
    });

    // shows the option to delete a todo if the mouse is over a newly created todo
    listToDo.addEventListener("mouseover", () => {
      listDelete.style.display = "block";
    });
    listToDo.addEventListener("mouseleave", () => {
      listDelete.style.display = "none";
    });

    // removes a todo from the list(for the newly created todo)
    listDelete.addEventListener("click", () => {
      listEl.removeChild(listDelete.parentElement);
      localStorage.setItem("number_of_todos", --nmbr);

      // this block of code updates the number of checked todos when a newly created(and after that checked as done) one is deleted
      if (
        listDelete.previousSibling.firstChild.classList.contains(
          "fa-circle-check"
        )
      ) {
        OK--;
        localStorage.setItem("number_of_checked_todos", OK);
      }

      // updates the number of todos left.. to do (when a todo is deleted)
      filter1El.textContent = `${nmbr - OK < 0 ? 0 : nmbr - OK} items left`;

      // saving the page content to localStorage after new ToDos were added
      bodyEl = document.querySelector("body");
      localStorage.setItem("bodyEl", bodyEl.innerHTML);

      // updating the i after a new todo is added
      localStorage.setItem("todo_id", i);
    });

    localStorage.setItem("todo_id", i);
    localStorage.setItem("number_of_todos", nmbr);

    // makes a newly created todo editable on dblclick
    todoContentEl.addEventListener("dblclick", () => {
      todoContentEl.contentEditable = "true";
      todoContentEl.focus();
    });

    window.addEventListener("click", (e) => {
      if (e.target != todoContentEl) {
        // getting the page content after new ToDos were added in order to be saved later
        bodyEl = document.querySelector("body");
      }
    });

    listEls = document.querySelectorAll("ul.todos_list li");

    // updating the list of todos so that every filter works properly after a new todo is added and the page hasn't been refreshed yet
    filter2El.addEventListener("click", () => {
      // show all todos
      Array.from(listEls).forEach((el) => {
        el.style.display = "flex";
      });
    });

    filter3El.addEventListener("click", () => {
      // show ACTIVE todos
      Array.from(listEls).forEach((el) => {
        if (!el.firstChild.firstChild.classList.contains("fa-circle")) {
          el.style.display = "none";
        } else {
          el.style.display = "flex";
        }
      });
    });

    filter4El.addEventListener("click", () => {
      // show COMPLETED todos
      Array.from(listEls).forEach((el) => {
        if (el.firstChild.firstChild.classList.contains("fa-circle")) {
          el.style.display = "none";
        } else {
          el.style.display = "flex";
        }
      });
    });

    filter5El.addEventListener("click", () => {
      // gets the list of todos once again to not get in conflict with the click listener applied on filter5 at page load
      listEls = document.querySelectorAll("ul.todos_list li");

      Array.from(listEls).forEach((el) => {
        if (!el.firstChild.firstChild.classList.contains("fa-circle")) {
          listEl.removeChild(el);
          nmbr--;
          OK--;
        }
      });
      filter5El.style.display = "none";

      // resets the "mark all as done" button
      toggleEl.classList.remove("opacity-class");

      localStorage.setItem("number_of_todos", nmbr);
      localStorage.setItem("number_of_checked_todos", OK);

      // saving the page content to localStorage after new ToDos were added
      bodyEl = document.querySelector("body");
      localStorage.setItem("bodyEl", bodyEl.innerHTML);
    });
  }
});

// the process of marking a todo as done/undone
Array.from(checkIconEls).forEach((el) => {
  el.addEventListener("click", () => {
    if (el.classList.contains("fa-circle")) {
      el.classList.remove("fa-circle");
      el.classList.add("fa-circle-check");
      el.nextElementSibling.classList.add("marked");
      OK++;

      //shows the option to remove all completed todos
      filter5El.style.display = "block";
    } else {
      el.classList.remove("fa-circle-check");
      el.classList.add("fa-circle");
      el.nextElementSibling.classList.remove("marked");
      OK--;

      //hides the option to remove all completed todos
      filter5El.style.display = "none";
    }

    if (OK === Array.from(checkIconEls).length) {
      toggleEl.classList.add("opacity-class");
    } else {
      toggleEl.classList.remove("opacity-class");
    }

    localStorage.setItem("number_of_checked_todos", OK);

    // updates the number of todos left.. to do (when a todo is deleted)
    filter1El.textContent = `${nmbr - OK < 0 ? 0 : nmbr - OK} items left`;

    // saving the page content to localStorage after new ToDos were added
    bodyEl = document.querySelector("body");
    localStorage.setItem("bodyEl", bodyEl.innerHTML);
  });
});

// shows the option to delete a todo if the mouse is over a todo
listEls.forEach((el) => {
  el.addEventListener("mouseover", () => {
    el.lastChild.style.display = "block";
  });
  el.addEventListener("mouseleave", () => {
    el.lastChild.style.display = "none";
  });
});

// removes a todo from the list
Array.from(deleteEls).forEach((el) => {
  el.addEventListener("click", () => {
    listEl.removeChild(el.parentElement.parentElement);
    localStorage.setItem("number_of_todos", --nmbr);

    // this block of code updates the number of checked todos when a checked one is deleted
    if (
      el.parentElement.previousSibling.firstChild.classList.contains(
        "fa-circle-check"
      )
    ) {
      OK--;
      localStorage.setItem("number_of_checked_todos", OK);
    }

    // updates the number of todos left.. to do (when a todo is deleted)
    filter1El.textContent = `${nmbr - OK < 0 ? 0 : nmbr - OK} items left`;

    // saving the page content to localStorage after new ToDos were added
    bodyEl = document.querySelector("body");
    localStorage.setItem("bodyEl", bodyEl.innerHTML);
  });
});

// check/uncheck all todos button

toggleEl.addEventListener("click", () => {
  toggleEl.classList.toggle("opacity-class");

  if (toggleEl.classList.contains("opacity-class")) {
    Array.from(checkIconEls).forEach((el) => {
      if (el.classList.contains("fa-circle")) {
        el.classList.remove("fa-circle");
        el.classList.add("fa-circle-check");
        el.nextElementSibling.classList.add("marked");
        OK = Array.from(checkIconEls).length;
        localStorage.setItem("number_of_checked_todos", OK);

        // updates the number of todos left.. to do (when all todos are marked as done)
        filter1El.textContent = `${0} items left`;

        //shows the option to remove all completed todos
        filter5El.style.display = "block";
      }
    });
  } else {
    Array.from(checkIconEls).forEach((el) => {
      el.classList.remove("fa-circle-check");
      el.classList.add("fa-circle");
      el.nextElementSibling.classList.remove("marked");
      OK = 0;
      localStorage.setItem("number_of_checked_todos", OK);

      // updates the number of todos left.. to do (when all todos are not marked as done)
      filter1El.textContent = `${nmbr} items left`;
    });

    //hides the option to remove all completed todos
    filter5El.style.display = "none";
  }

  // saving the page content to localStorage after new ToDos were added
  bodyEl = document.querySelector("body");
  localStorage.setItem("bodyEl", bodyEl.innerHTML);
});

// makes a todo editable on dblclick
contents.forEach((el) => {
  el.addEventListener("dblclick", () => {
    el.contentEditable = "true";
    el.focus();
  });

  window.addEventListener("click", (e) => {
    if (e.target != el) {
      // saving the page content to localStorage after new ToDos were added
      bodyEl = document.querySelector("body");
      localStorage.setItem("bodyEl", bodyEl.innerHTML);
    }
  });
});

// filters

function filters() {
  filter2El.addEventListener("click", () => {
    // styling
    filter2El.classList.add("active");
    filter2El.classList.remove("gray");

    filter3El.classList.remove("active");
    filter4El.classList.remove("active");

    // show all todos
    Array.from(listEls).forEach((el) => {
      el.style.display = "flex";
    });
  });

  filter2El.addEventListener("mouseover", () => {
    if (!filter2El.classList.contains("active")) {
      filter2El.classList.add("gray");
    }
  });

  filter2El.addEventListener("mouseleave", () => {
    if (!filter2El.classList.contains("active")) {
      filter2El.classList.remove("gray");
    }
  });

  filter3El.addEventListener("click", () => {
    // styling
    filter3El.classList.add("active");
    filter3El.classList.remove("gray");

    filter2El.classList.remove("active");
    filter4El.classList.remove("active");

    // show ACTIVE todos
    Array.from(listEls).forEach((el) => {
      if (!el.firstChild.firstChild.classList.contains("fa-circle")) {
        el.style.display = "none";
      } else {
        el.style.display = "flex";
      }
    });
  });

  filter3El.addEventListener("mouseover", () => {
    if (!filter3El.classList.contains("active")) {
      filter3El.classList.add("gray");
    }
  });

  filter3El.addEventListener("mouseleave", () => {
    if (!filter3El.classList.contains("active")) {
      filter3El.classList.remove("gray");
    }
  });

  filter4El.addEventListener("click", () => {
    // styling
    filter4El.classList.add("active");
    filter4El.classList.remove("gray");

    filter2El.classList.remove("active");
    filter3El.classList.remove("active");

    // show COMPLETED todos
    Array.from(listEls).forEach((el) => {
      if (el.firstChild.firstChild.classList.contains("fa-circle")) {
        el.style.display = "none";
      } else {
        el.style.display = "flex";
      }
    });
  });

  filter4El.addEventListener("mouseover", () => {
    if (!filter4El.classList.contains("active")) {
      filter4El.classList.add("gray");
    }
  });

  filter4El.addEventListener("mouseleave", () => {
    if (!filter4El.classList.contains("active")) {
      filter4El.classList.remove("gray");
    }
  });

  filter5El.addEventListener("click", () => {
    Array.from(listEls).forEach((el) => {
      if (!el.firstChild.firstChild.classList.contains("fa-circle")) {
        listEl.removeChild(el);
        nmbr--;
        OK--;
      }
    });
    filter5El.style.display = "none";

    // resets the "mark all as done" button
    toggleEl.classList.remove("opacity-class");

    localStorage.setItem("number_of_todos", nmbr);
    localStorage.setItem("number_of_checked_todos", OK);
  });

  filter5El.addEventListener("mouseover", () => {
    filter5El.style.textDecoration = "underline";
  });

  filter5El.addEventListener("mouseleave", () => {
    filter5El.style.textDecoration = "none";
  });
}

filters();
