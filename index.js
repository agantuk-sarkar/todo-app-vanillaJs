// todo api
const url = "https://jsonplaceholder.typicode.com/todos";

// getting html elements into js
const user_id_container = document.querySelector(".user-id-container");

// function to fetch todos details
const getTodosData = async () => {
  try {
    const responseObject = await fetch(url);
    if (responseObject.ok && responseObject.status === 200) {
      const todosData = await responseObject.json();
      // console.log("todosData:",todosData);
      storingUserIdsInObject(todosData);
    } else {
      throw new Error("Invalid Url");
    }
  } catch (error) {
    console.log("error:", error);
  }
};
getTodosData();

// function to store userIds
const storingUserIdsInObject = (todosData) => {
  let userIdsObject = {};
  // userIdsObject= {
  //     1: [{},{},{}],
  //     2: [{},{},{}],
  //     3: [{},{},{}],
  // }

  todosData?.forEach((users) => {
    if (!userIdsObject[users.userId]) {
      userIdsObject[users.userId] = [];
      userIdsObject[users.userId].push(users);
    } else {
      userIdsObject[users.userId].push(users);
    }
  });

  // console.log("userIdsObject:",userIdsObject);
  displayUserIds(userIdsObject);
};

// function to display each user in UI
const displayUserIds = (userIdsObject) => {
  for (let key in userIdsObject) {
    const user_div = document.createElement("div");
    user_div.textContent = `User - ${key}`;
    // adding click event for each user div
    user_div.addEventListener("click", () => {
      displayModal(userIdsObject[key], key);
    });

    user_id_container.append(user_div);
  }
};

// function to display modal after clicking on each user
const displayModal = (selectedUserId, key) => {
  // console.log("selectedUser:",selectedUserId);
  const modal_mainDiv = document.createElement("div");
  modal_mainDiv.classList.add("modal-mainDiv");

  // modal content which is inside modal main container
  const modal_content_div = document.createElement("div");
  modal_content_div.classList.add("modal-content-div");

  // there will be first, second and third different boxes which is inside modal content div
  const first_modalDiv = document.createElement("div");
  first_modalDiv.classList.add("first-modal-div");

  // the second modal div will have three tabs for all todos, completed todos and pending todos
  const second_modalDiv = document.createElement("div");
  second_modalDiv.classList.add("second-modal-div");

  // the third modal div will contain content according to the tabs clicked from all todos, completed todos and pending todos
  const third_modal_div = document.createElement("div");
  third_modal_div.classList.add("third-modal-div");

  // first modal div will have one close button and particular user id shown
  const user_id_text = document.createElement("p");
  user_id_text.textContent = `User: ${key}`;

  const close_button = document.createElement("div");
  close_button.classList.add("close-button");
  close_button.textContent = "Close";
  // add click event for close button
  close_button.addEventListener("click", () => {
    modal_mainDiv.style.display = "none";
  });

  // appending userid text and close button inside first modal div
  first_modalDiv.append(user_id_text, close_button);

  // all todos tab
  const all_todos_tab = document.createElement("div");
  all_todos_tab.classList.add("all-todos-tab");
  all_todos_tab.textContent = "All Todos";

  // adding click event for all todo tab
  all_todos_tab.addEventListener("click", () => {

    all_todos_tab.classList.add("tab-background");
    completed_todos.classList.remove("tab-background");
    pending_todos.classList.remove("tab-background");

    third_modal_div.innerHTML = "";

    selectedUserId?.forEach((user, ind) => {
      // using destructuring of objects
      const { userId, title, completed } = getObj(user);

      const eachUser_div = document.createElement("div");
      eachUser_div.classList.add("each-user-div");

      if (completed) {
        const each_user_text = document.createElement("p");
        each_user_text.classList.add("each-user-text");
        each_user_text.innerHTML = `${
          ind + 1
        }. ${title} <span class="completed-spanTag">Completed</span>`;
        eachUser_div.append(each_user_text);
      } else {
        const each_user_text = document.createElement("p");
        each_user_text.classList.add("each-user-text");
        each_user_text.innerHTML = `${
          ind + 1
        }. ${title} <span class="pending-spanTag">Pending</span>`;
        eachUser_div.append(each_user_text);
      }

      third_modal_div.append(eachUser_div);
    });
  });

  // completed todos tab
  const completed_todos = document.createElement("div");
  completed_todos.classList.add("completed-todos");
  completed_todos.textContent = "Completed";
  // adding click event for completed todos tab
  completed_todos.addEventListener("click", () => {

    completed_todos.classList.add("tab-background");
    all_todos_tab.classList.remove("tab-background");
    pending_todos.classList.remove("tab-background");


    third_modal_div.innerHTML = "";

    let completedIndex = 0;

    selectedUserId?.forEach((completedUsers, ind) => {
      const { userId, title, completed } = getObj(completedUsers);

      const completedUser_div = document.createElement("div");
      completedUser_div.classList.add("completed-user-div");

      if (completed) {
        completedIndex++;
        const completed_user_text = document.createElement("p");
        completed_user_text.classList.add("completed_user_text");
        completed_user_text.textContent = `${completedIndex}. ${title}`;
        completedUser_div.append(completed_user_text);
        third_modal_div.append(completedUser_div);
      }
    });
  });

  // pending todos tab
  const pending_todos = document.createElement("div");
  pending_todos.classList.add("pending-todos");
  pending_todos.textContent = "Pending";

  // adding click event for pending todos tab
  pending_todos.addEventListener("click", () => {

    pending_todos.classList.add("tab-background");
    all_todos_tab.classList.remove("tab-background");
    completed_todos.classList.remove("tab-background");

    third_modal_div.innerHTML = "";

    let pendingIndex = 0;


    selectedUserId?.forEach((pendingUsers) => {

      const { userId, title, completed } = getObj(pendingUsers);

      const pendingUser_div = document.createElement("div");
      pendingUser_div.classList.add("pending-user-div");

      if (!completed) {
        pendingIndex++;
        const pending_user_text = document.createElement("p");
        pending_user_text.textContent = `${pendingIndex}. ${title}`;
        pendingUser_div.append(pending_user_text);

        third_modal_div.append(pendingUser_div);
      }
    });
  });

  // appending all, complete and pending todos inside second modal div
  second_modalDiv.append(all_todos_tab, completed_todos, pending_todos);

  all_todos_tab.classList.add("tab-background");

  //  this section is creating all todos list of selected user by default
  selectedUserId?.forEach((user, ind) => {

    // using destructuring of objects
    const { userId, title, completed } = getObj(user);

    const eachUser_div = document.createElement("div");
    eachUser_div.classList.add("each-user-div");

    if (completed) {
      const each_user_text = document.createElement("p");
      each_user_text.classList.add("each-user-text");
      each_user_text.innerHTML = `${
        ind + 1
      }. ${title} <span class="completed-spanTag">Completed</span>`;
      eachUser_div.append(each_user_text);
    } else {
      const each_user_text = document.createElement("p");
      each_user_text.classList.add("each-user-text");
      each_user_text.innerHTML = `${
        ind + 1
      }. ${title} <span class="pending-spanTag">Pending</span>`;
      eachUser_div.append(each_user_text);
    }

    third_modal_div.append(eachUser_div);
  });

  // appending first modal, second modal, third modal div inside modal content div
  modal_content_div.append(first_modalDiv, second_modalDiv, third_modal_div);

  // appending modal content div inside modal main container
  modal_mainDiv.append(modal_content_div);

  document.querySelector(".main-container").append(modal_mainDiv);
};

// function which will return object like userId, title and completed
const getObj = (obj) => {
  return {
    userId: obj.userId,
    title: obj.title,
    completed: obj.completed,
  };
};
