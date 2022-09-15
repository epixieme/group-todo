const deleteBtn = document.querySelectorAll(".del");
const todoItem = document.querySelectorAll("input.check-incomplete");
const todoComplete = document.querySelectorAll("input.check-completed");
const editBtn = document.querySelectorAll(".edit");
const updateBtn = document.querySelectorAll(".update");
const searchBtn = document.getElementById("search-button");

Array.from(deleteBtn).forEach((el) => {
  el.addEventListener("click", deleteTodo);
});

Array.from(todoItem).forEach((el) => {
  el.addEventListener("click", markComplete);
});

Array.from(todoComplete).forEach((el) => {
  el.addEventListener("click", markIncomplete);
});

// Search feature

searchBtn.addEventListener("click", async () => {
  try {
    const searchQuery = document.getElementById("searchBar").value;
    const response = await fetch(`/todos/search/${searchQuery}`);
    const data = await response.json();
    displayResults(data);
  } catch (error) {
    console.log(error);
  }
});

function displayResults(items) {
  const searchResult = document.querySelector(".search-result");
  searchResult.innerHTML = "";
  const searchHead = document.createElement("h2");
  searchResult.appendChild(searchHead);
  if (items.length === 0) searchHead.innerText = "No items found.";
  else {
    searchHead.innerText = "Search Results:";
    let resultList = document.createElement("ul");
    searchResult.appendChild(resultList);
    items.forEach((item) => {
      let todoItem = document.createElement("li");
      setAttributes(todoItem, { class: "todoItem", "data-id": item._id });
      let checkBox = document.createElement("input");
      let itemName = document.createElement("span");
      itemName.innerText = item.todo;
      let editItem = document.createElement("input");
      setAttributes(editItem, {
        type: "image",
        class: "edit",
        src: "/images/pencil.svg",
        alt: "Edit item",
        title: "Edit item",
      });
      editItem.addEventListener("click", editTodoInfo);
      let saveItem = document.createElement("input");
      setAttributes(saveItem, {
        type: "image",
        class: "update",
        src: "/images/save.svg",
        alt: "Save changes",
        title: "Save changes",
      });
      saveItem.hidden = true;
      saveItem.addEventListener("click", updateTodoInfo);
      let deleteItem = document.createElement("input");
      setAttributes(deleteItem, {
        type: "image",
        class: "del",
        src: "/images/trash.svg",
        alt: "Delete item",
        title: "Delete item",
      });
      deleteItem.addEventListener("click", deleteTodo);
      if (item.completed == true) {
        setAttributes(checkBox, {
          type: "image",
          class: "check-completed",
          src: "/images/check-square-fill.svg",
        });
        itemName.classList.add("completed");
        checkBox.addEventListener("click", markIncomplete);
      } else {
        setAttributes(checkBox, {
          type: "image",
          class: "check-incomplete",
          src: "/images/square.svg",
        });
        itemName.classList.add("not");
        checkBox.addEventListener("click", markComplete);
      }
      resultList.appendChild(todoItem);
      todoItem.appendChild(checkBox);
      todoItem.appendChild(itemName);
      todoItem.appendChild(editItem);
      todoItem.appendChild(saveItem);
      todoItem.appendChild(deleteItem);
    });
  }
}

function setAttributes(elem, attributes) {
  for (let entry in attributes) {
    elem.setAttribute(entry, attributes[entry]);
  }
}

// what is the point of these?
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
    todoText.style.border = "1px solid black";
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
    location.reload();
  } catch (err) {
    console.log(err);
  }
}
