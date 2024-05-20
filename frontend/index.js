//Globals Start

//Containers
const mainPage = document.querySelector("#mainPage");
const loginContainer = document.querySelector(".login-container");
const registerContainer = document.querySelector(".register-container");

//Buttons
const mainHead = document.querySelector("#mainHead");
const loginBtn = document.querySelector("#loginBtn");
const signUpBtn = document.querySelector("#signUpBtn");
const enterBtn = document.querySelector("#enterBtn");
const registerBtn = document.querySelector("#registerBtn");
const logoutBtn = document.querySelector("#logoutBtn");
const myBookPage = document.querySelector("#myBookpage");

//Input fields
// const loginUser = document.querySelector("#loginUser");
// const loginPassword = document.querySelector("#loginPassword");
// const registerUser = document.querySelector("#registerUser");
// const registerPassword = document.querySelector("#registerPassword");
const inputSort = document.querySelector("#sort");

//Globals End

//EventListeners

mainHead.addEventListener("click", () => {
  mainPage.style.display = "grid";
  registerContainer.style.display = "none";
  loginContainer.style.display = "none";
  renderPage();
});
loginBtn.addEventListener("click", () => {
  mainPage.style.display = "none";
  registerContainer.style.display = "none";
  loginContainer.style.display = "flex";
});
signUpBtn.addEventListener("click", () => {
  mainPage.style.display = "none";
  loginContainer.style.display = "none";
  registerContainer.style.display = "flex";
});
registerBtn.addEventListener("click", () => {
  mainPage.style.display = "none";
  registerContainer.style.display = "none";
  loginContainer.style.display = "flex";
  regUser();
});
enterBtn.addEventListener("click", () => {
  mainPage.style.display = "grid";
  registerContainer.style.display = "none";
  loginContainer.style.display = "none";
  logUser();
});
logoutBtn.addEventListener("click", () => {
  logOutUser();
});
myBookPage.addEventListener("click", () => {
  console.log("My book page click");
  renderMyPage();
});
// bookMarkBtn.add("click", () => {
//   console.log("bookmark clicked");
//   bookMarkFunk();
// });

//API
//http://localhost:1338/api/books
//http://localhost:1338/api/books?populate=*
//http://localhost:1338/api/users
//http://localhost:1338/api/users?populate=*

//Functions

//Create Register and Login

const regUser = async () => {
  let registerUser = document.querySelector("#registerUser").value;
  let registerPassword = document.querySelector("#registerPassword").value;
  console.log(registerUser, registerPassword);

  try {
    const response = await axios.post(
      "http://localhost:1338/api/auth/local/register",
      {
        username: registerUser,
        email: `${registerUser}@hagson.se`,
        password: registerPassword,
      }
    );
    console.log(response.data);
  } catch (error) {
    console.error("Error", error);
  }
};

const logUser = async () => {
  const loginUser = document.querySelector("#loginUser").value;
  const loginPassword = document.querySelector("#loginPassword").value;

  try {
    let response = await axios.post("http://localhost:1338/api/auth/local", {
      identifier: loginUser,
      password: loginPassword,
    });
    //Setting sessionStorage
    sessionStorage.setItem("token", response.data.jwt);
    sessionStorage.setItem("user", JSON.stringify(response.data.user));
    console.log(response.data, response.data.jwt);
    console.log("ADD USER HERE is logged in");
    //Catching errors
  } catch (error) {
    console.error("Error", error);
  }
  isLoggedIn();
  renderPage();
};
//Create Header, authorizaiton, bearer
const logOutUser = async () => {
  try {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    console.log(`User ADD USER HERE is logged out`);
  } catch (error) {
    console.error("Error logging ADD USER HERE out");
  }
  isLoggedIn();
  renderPage();
};
//Render Page. Remove login button if logged in etc.
//Add username to navbar, add some ducks.
//To loop out the bookmark foreach. its a node list
//Checks if user is online
const isLoggedIn = async () => {
  let userData = sessionStorage.getItem("user");
  if (userData) {
    // document.querySelectorAll(".bookMarkIcon").display.style = "block";
    myBookPage.style.display = "flex";
    loginBtn.style.display = "none";
    signUpBtn.style.display = "none";
    logoutBtn.style.display = "flex";
    let user = JSON.parse(userData);
    let username = user.username;
    document.querySelector("#userWelcome").innerHTML = `Welcome ${username}`;
  } else {
    // document
    //   .querySelectorAll(".bookMarkIcon")
    //   .forEach((bookmark) => (bookmark.display.style = "none"));
    myBookPage.style.display = "none";
    loginBtn.style.display = "flex";
    signUpBtn.style.display = "flex";
    logoutBtn.style.display = "none";
    document.querySelector("#userWelcome").innerHTML = `QuackQuack`;
  }
};
//Add single type - color theme
//Renders books
//Different url? is logged in or my page?
//set id on bookmark
//Create seperate parameters for myBooks and HomePage
const homeApi = "http://localhost:1338/api/books?populate=*";
const myBooksApi = "http://localhost:1338/api/users?populate=*";

const renderPage = async () => {
  mainPage.innerHTML = "";
  let response = await axios.get("http://localhost:1338/api/books?populate=*");
  // console.log(response.data.data); //All books
  let books = response.data.data;
  //Eventlistener on change
  renderBooks(books);
};
const renderMyPage = async () => {
  mainPage.innerHTML = "";
  let userId = JSON.parse(sessionStorage.getItem("user")).id;
  let response = await axios.get(
    `http://localhost:1338/api/users/${userId}?populate=deep,3`,
    {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    }
  );
  // console.log(response.data.books); // Users saved books
  let myBooks = response.data.books;
  renderBooks(myBooks);
};

const renderBooks = (bookArray) => {
  mainPage.innerHTML = "";
  console.log(bookArray);
  inputSort.addEventListener("change", () => {
    bookArray = sortList(bookArray, inputSort.value);
  });
  printBooks(bookArray);
};

const printBooks = (bookArray) => {
  mainPage.innerHTML = "";
  bookArray.map((book) => {
    let bookCard = document.createElement("div");
    bookCard.classList.add("bookCard");
    let bookTitle = document.createElement("h3");
    if (book.attributes) {
      bookTitle.innerText = book.attributes?.title;
    } else {
      bookTitle.innerText = book.title;
    }
    let bookImg = document.createElement("img");
    if (book.attributes) {
      bookImg.src =
        "http://localhost:1338" +
        book.attributes?.bookCover.data.attributes.url;
    } else {
      bookImg.src = "http://localhost:1338" + book.bookCover.url;
    }
    let bookInfo = document.createElement("div");
    bookInfo.classList.add("bookInfo");
    let bookAuthor = document.createElement("span");
    if (book.attributes) {
      bookAuthor.innerText = `Author: ${book.attributes.author}`;
    } else {
      bookAuthor.innerText = `Author: ${book.author}`;
    }
    let bookPages = document.createElement("span");
    if (book.attributes) {
      bookPages.innerText = `Pages: ${book.attributes.pages}`;
    } else {
      bookPages.innerText = `Pages: ${book.pages}`;
    }
    let bookPublished = document.createElement("span");
    if (book.attributes) {
      bookPublished.innerText = `Published: ${book.attributes.date}`;
    } else {
      bookPublished.innerText = `Published: ${book.date}`;
    }
    let bookRating = document.createElement("span");
    if (book.attributes) {
      bookRating.innerText = `${book.attributes.rating}/10`;
    } else {
      bookRating.innerText = `${book.rating}/10`;
    }
    bookRating.id = book.id;
    bookRating.classList.add("rating-container");
    let bookMark = document.createElement("i");
    bookMark.classList.add("bookMarkIcon");
    bookMark.innerHTML = "📒";
    bookMark.id = book.id;
    bookMark.setAttribute("savedBook", "false");
    //If logged in append bookMark?
    let userId = JSON.parse(sessionStorage.getItem("user"));
    if (userId) {
      bookCard.append(bookMark);
    }

    bookInfo.append(bookAuthor, bookPages, bookPublished);
    bookCard.append(bookTitle, bookImg, bookInfo, bookRating);
    mainPage.append(bookCard);
  });
};
const sortList = (bookArray, input) => {
  console.log(bookArray, input);
  if (input === "title") {
    bookArray.sort((a, b) =>
      a.attributes.title.localeCompare(b.attributes.title)
    );
    printBooks(bookArray);
  } else if (input === "author") {
    bookArray.sort((a, b) =>
      a.attributes.author.localeCompare(b.attributes.author)
    );
    printBooks(bookArray);
  } else if (input === "rating") {
    bookArray.sort(
      (a, b) => parseInt(b.attributes.rating) - parseInt(a.attributes.rating)
    );
    printBooks(bookArray);
  }
  return bookArray;
};
//BOOKMARK TOREAD BOOKS

document.addEventListener("click", (event) => {
  if (event.target.classList.contains("bookMarkIcon")) {
    let bookId = event.target.id;
    bookMarkFunk(bookId);
  }
});

const bookMarkFunk = async (bookId) => {
  console.log(bookId); //Id of the book clicked

  let userId = JSON.parse(sessionStorage.getItem("user")).id;
  console.log(userId); //Getting user

  let response = await axios.get(
    `http://localhost:1338/api/users/${userId}?populate=deep,3`,
    {
      headers: {
        authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    }
  );
  let userBooks = response.data.books;
  console.log(userBooks); //Array of books the user Bookmarked already existing

  //Remove bookmark
  let parsedBookId = parseInt(bookId);
  let bookIndex = userBooks.findIndex((book) => book.id === parsedBookId);
  console.log(bookIndex);

  if (bookIndex !== -1) {
    userBooks.splice(bookIndex, 1);
  } else {
    let bookResponse = await axios.get(
      `http://localhost:1338/api/books/${bookId}`,
      {
        headers: {
          authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      }
    );
    let selectedBook = bookResponse.data;
    userBooks.push(selectedBook.data);
    console.log(selectedBook); //The selected book to move to userBooks array
    console.log(userBooks);
  }

  //Updating the users bookmarked books

  await axios.put(
    `http://localhost:1338/api/users/${userId}`,
    {
      books: userBooks,
    },
    {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    }
  );
  renderMyPage();
};

//RATE BOOK

document.addEventListener("click", (event) => {
  if (event.target.classList.contains("rating-container")) {
    let bookId = event.target.id;
    let selectRating = document.createElement("select");

    for (let i = 1; i <= 10; i++) {
      let option = document.createElement("option");
      option.value = i;
      option.text = i;
      selectRating.append(option);
    }
    let ratingContainer = event.target;
    ratingContainer.appendChild(selectRating);

    selectRating.addEventListener("change", (event) => {
      let selectedRating = event.target.value;
      console.log(selectedRating);
      selectRating.style.display = "none";
      rateBook(bookId, selectedRating);
    });
  }
});

const rateBook = async (bookId, selectedRating) => {
  console.log(bookId, selectedRating); //the books ID and the selected rating
  //Get book rating
  let userId = JSON.parse(sessionStorage.getItem("user"));
  if (userId) {
    let response = await axios.get(
      `http://localhost:1338/api/books/${bookId}`,
      {
        headers: {
          authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      }
    );
    let oldRating = response.data.data.attributes.rating;
    console.log(oldRating); // The original rating preset
    //Set new rating

    let newRating = parseInt(
      (parseFloat(oldRating) + parseFloat(selectedRating)) / 2
    );
    console.log(newRating); // 10 + 5 = 7.5

    await axios.put(
      `http://localhost:1338/api/books/${bookId}`,
      {
        data: {
          rating: newRating,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      }
    );
    renderMyPage();
  } else {
    alert("you must login to rate a book ya fart");
    renderPage();
  }
};

const sortBooks = () => {
  console.log("Three buttons");
};

const setBackground = async () => {
  let response = await axios.get("http://localhost:1338/api/seasonal");
  console.log(response.data.data.attributes.pickColor);
  let newBookground = response.data.data.attributes.pickColor;
  document.querySelector(".main").style.background = newBookground;
};

setBackground();
isLoggedIn();
renderPage();
