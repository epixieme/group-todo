const deleteBtn = document.querySelectorAll(".del");
const todoItem = document.querySelectorAll("input.check-incomplete");
const todoComplete = document.querySelectorAll("input.check-completed");
const editBtn = document.querySelectorAll(".edit");
const updateBtn = document.querySelectorAll(".update");

Array.from(deleteBtn).forEach((el) => {
  el.addEventListener("click", deleteTodo);
});

Array.from(todoItem).forEach((el) => {
  el.addEventListener("click", markComplete);
});

Array.from(todoComplete).forEach((el) => {
  el.addEventListener("click", markIncomplete);
});

// edit the todo item

if (editBtn) {
  const editTodo = Array.from(editBtn).forEach((element) => {
    element.addEventListener("click", editTodoInfo);
  });
}

//   update the todo item
if (updateBtn) {
  const updateTodo = Array.from(updateBtn).forEach((element) => {
    element.addEventListener("click", updateTodoInfo);
  });
}

async function deleteTodo() {
  const todoId = this.parentNode.dataset.id;
  try {
    const response = await fetch("todos/deleteTodo", {
      method: "delete",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({
        todoIdFromJSFile: todoId,
      }),
    });
    const data = await response.json();
    console.log(data);
    location.reload();
  } catch (err) {
    console.log(err);
  }
}

async function markComplete() {
  const todoId = this.parentNode.dataset.id;
  try {
    const response = await fetch("todos/markComplete", {
      method: "put",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({
        todoIdFromJSFile: todoId,
      }),
    });
    const data = await response.json();
    console.log(data);
    location.reload();
  } catch (err) {
    console.log(err);
  }
}

async function markIncomplete() {
  const todoId = this.parentNode.dataset.id;
  try {
    const response = await fetch("todos/markIncomplete", {
      method: "put",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({
        todoIdFromJSFile: todoId,
      }),
    });
    const data = await response.json();
    console.log(data);
    location.reload();
  } catch (err) {
    console.log(err);
  }
}

function editTodoInfo() {
  let id = this.parentNode.dataset.id;
  let todoText = this.parentNode.children[1];
  let saveChanges = this.parentNode.children[3];
  if (id) {
    this.hidden = true;
    saveChanges.hidden = false;
    todoText.setAttribute("contenteditable", true);
    todoText.style.background = "#C8CFD2";
    todoText.border = "1px solid black";
    todoText.focus();
  }
}

async function updateTodoInfo() {
  let todoId = this.parentNode.dataset.id;
  let todoText = this.parentNode.children[1];
  let editItem = this.parentNode.children[2];
  console.log(todoText.innerText);

  if (todoId) {
    this.hidden = true;
    editItem.hidden = false;
    todoText.setAttribute("contenteditable", false);
    todoText.style.background = "none";
    todoText.border = "none";
  }
  try {
    await fetch("/todos/updateTodo", {
      method: "put",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        todoIdFromJSFile: todoId,
        textInput: todoText.innerText,
      }),
    });
  } catch (err) {
    console.log(err);
  }
}
