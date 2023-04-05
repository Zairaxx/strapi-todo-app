let todoList = document.querySelector("ul");
let completedList = document.querySelector("#completed-list");

let todoTitle = document.querySelector("#todoTitle");
let todoDesc = document.querySelector("#todoDesc");
//REGISTRATION
let username = document.querySelector("#username");
let email = document.querySelector("#email");
let registerPassword = document.querySelector("#registerPassword");

//LOGIN
let identifier = document.querySelector("#identifier");
let loginPassword = document.querySelector("#password");

let renderPage = async () => {
  if (sessionStorage.getItem("token")) {
    document.querySelector("#authentication-box").classList.add("hidden");
    document.querySelector("#todos-box").classList.remove("hidden");
    let response = await axios.get("http://localhost:1337/api/todos", {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    });
    console.log(response.data.data);
    if (response.data) {
      todoList.innerHTML = "";
      completedList.innerHTML = "";
      let todos = response.data.data.filter(
        (todo) => !todo.attributes.completed
      );
      let completedTodos = response.data.data.filter(
        (todo) => todo.attributes.completed
      );

      todos.forEach((todo) => {
        todoList.innerHTML += `<li>
          <b>Title</b>:${todo.attributes.title}
          <b>Description:</b> ${todo.attributes.description}
          <button onclick="completeTodo(${todo.id})">Complete</button>
          <button onclick="deleteTodo(${todo.id})">Delete</button>
          <button onclick="toggleEdit(this)">Edit</button>
          <div class="editForm hidden">
            <input type="text" placeholder="Title" value="${todo.attributes.title}"></input>
            <input type="text" placeholder="Description" value="${todo.attributes.description}"></input>
            <button onclick="editTodo(this, ${todo.id})">Confirm</button>
          </div>
        </li>`;
      });
      completedTodos.forEach((todo) => {
        completedList.innerHTML += `<li>
          <b>Title</b>:${todo.attributes.title}
          <b>Description:</b> ${todo.attributes.description}
          <button onclick="deleteTodo(${todo.id})">Delete</button>
        </li>`;
      });
    }
  }
};

let completeTodo = async (id) => {
  await axios.put(
    `http://localhost:1337/api/todos/${id}`,
    {
      data: {
        completed: true,
      },
    },
    {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    }
  );
  renderPage();
};

let toggleEdit = (e) => {
  let editForm = e.nextElementSibling;
  editForm.classList.remove("hidden");
};
let editTodo = async (element, id) => {
  let desc = element.previousElementSibling;
  let title = desc.previousElementSibling;
  console.log(title, desc);
  await axios.put(
    `http://localhost:1337/api/todos/${id}`,
    {
      data: {
        title: title.value,
        description: desc.value,
      },
    },
    {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    }
  );
  renderPage();
};

let deleteTodo = async (id) => {
  await axios.delete(`http://localhost:1337/api/todos/${id}`, {
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem("token")}`,
    },
  });
  renderPage();
};

let register = async () => {
  await axios.post("http://localhost:1337/api/auth/local/register", {
    username: username.value,
    email: email.value,
    password: registerPassword.value,
  });
  alert("User has been created! Please login :) ");
};

let login = async () => {
  let response = await axios.post("http://localhost:1337/api/auth/local", {
    identifier: identifier.value,
    password: loginPassword.value,
  });
  sessionStorage.setItem("token", response.data.jwt);
  renderPage();
};

let addTodo = async () => {
  await axios.post(
    "http://localhost:1337/api/todos",
    {
      data: {
        title: todoTitle.value,
        description: todoDesc.value,
        completed: false,
      },
    },
    {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    }
  );
  renderPage();
};

document.querySelector("#addTodo").addEventListener("click", addTodo);
document.querySelector("#register").addEventListener("click", register);
document.querySelector("#login").addEventListener("click", login);

renderPage();
