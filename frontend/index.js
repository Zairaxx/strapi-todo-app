let todoList = document.querySelector("ul");
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
      let todos = response.data.data;
      todos.forEach((todo) => {
        todoList.innerHTML += `<li> <b>Title</b>:${todo.attributes.title} <b>Description:</b> ${todo.attributes.description}</li>`;
      });
    }
  }
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
