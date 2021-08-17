let logBtn = document.querySelector("#logBtn");
let logOut = document.querySelector("#logOut");
let regBtn = document.querySelector("#regBtn");
let usrInput = document.querySelector("#usrInput");
let pswInput = document.querySelector("#pswInput");
let loginSection = document.querySelector("#loginSection");
let mainSection = document.querySelector("#mainSection");
let navName = document.querySelector(".navName");
let linkAdd = document.querySelector("#linkAdd");
let modalSection = document.querySelector("#modalSection");
let modalSubmitBtn = document.querySelector(".modalSubmitBtn");
let modalCloseBtn = document.querySelector(".modalCloseBtn");
let modalTitle = document.querySelector("#modalTitle");
let modalTkt = document.querySelector("#modalTkt");
let modalDesc = document.querySelector("#modalDesc");
let modalType = document.querySelector("#modalType");
let modalOptions = document.querySelector("#options");
let itemsSection = document.querySelector(".items");
let itemsList = document.querySelector(".itemsList");
let modalRegisterBtn = document.querySelector(".modalRegisterBtn");
let modalCancelBtn = document.querySelector(".modalCancelBtn");
let modalUser = document.querySelector("#modalUser");
let modalPwd = document.querySelector("#modalPwd");
let modalEmail = document.querySelector("#modalEmail");
let modalStore = document.querySelector("#modalStore");
let registerModal = document.querySelector("#registerModal");
let itemList = new Array();
var firebaseConfig = {
  apiKey: "AIzaSyAobg1h5aqprSpyT9T5XMtm9Z2H69z8T64",
  authDomain: "transito-makro.firebaseapp.com",
  projectId: "transito-makro",
  storageBucket: "transito-makro.appspot.com",
  messagingSenderId: "552286622434",
  appId: "1:552286622434:web:a49a53fe669a907c91c4bb",
  measurementId: "G-BXB2FGR5MV",
};
firebase.initializeApp(firebaseConfig);
firebase.auth();
var db = firebase.firestore();

logFunct = (email, password) => {
  firebase
    .auth()
    .signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      var user = userCredential.user;
    })
    .catch((error) => {
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log(errorCode);
      if (errorCode == "auth/wrong-password") {
        pswInput.style.border = "2px solid #ff6b6b";
      } else {
        usrInput.style.border = "2px solid #ff6b6b";
      }
    });
};

logOutFunc = () => {
  firebase
    .auth()
    .signOut()
    .then(() => {
      mainSection.style.display = "none";
      loginSection.style.display = "flex";
    })
    .catch((error) => {});
};

regFunc = (email, password) => {
  firebase
    .auth()
    .createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      db.collection(userCredential)
        .add({
          email: userCredential.email,
        })
        .then((docRef) => {
          console.log("Document written with ID: ", docRef.id);
        })
        .catch((error) => {
          console.error("Error adding document: ", error);
        });
    })
    .catch((error) => {
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log(email, password);
    });
};

logBtn.addEventListener("click", () => {
  let password = pswInput.value;
  let email = usrInput.value;
  logFunct(email, password);
  usrInput.value = "";
  pswInput.value = "";
});

logOut.addEventListener("click", () => {
  logOutFunc();
});

regBtn.addEventListener("click", (e) => {
  e.preventDefault();
  registerModal.style.display = "flex";
});

modalRegisterBtn.addEventListener("click", () => {
  email = modalEmail.value;
  password = modalPwd.value;
  regFunc(email, password);
  modalEmail.value = "";
  modalPwd.value = "";
  registerModal.style.display = "none";
});

modalCancelBtn.addEventListener("click", () => {
  registerModal.style.display = "none";
});

firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    loginSection.style.display = "none";
    mainSection.style.display = "flex";
    navName.innerHTML = `Bienvenido ${user.displayName}`;
    itemsSection.innerHTML = "";
    db.collection("itemsTransito")
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          let indItem = doc.data();
          printItem(
            indItem.title,
            indItem.tkt,
            indItem.desc,
            indItem.urg,
            indItem.store,
            indItem.owner,
            indItem.date
          );
        });
      });

    linkAdd.addEventListener("click", (e) => {
      e.preventDefault();
      modalSection.style.display = "flex";
    });

    modalCloseBtn.addEventListener("click", (e) => {
      e.preventDefault();
      modalSection.style.display = "none";
      modalTitle.value = "";
      modalTkt.value = "";
      modalDesc.value = "";
      modalType.value = "";
    });
    modalSubmitBtn.addEventListener("click", (e) => {
      e.preventDefault();
      title = modalTitle.value;
      tkt = modalTkt.value;
      desc = modalDesc.value;
      urg = modalOptions.options[modalOptions.selectedIndex].value;
      owner = user.displayName;
      date = new Date().toLocaleDateString();
      store = user.photoURL;
      console.log(title, tkt, desc, urg, owner, date, store);
      db.collection("itemsTransito")
        .add({
          title: this.title,
          tkt: this.tkt,
          desc: this.desc,
          urg: this.urg,
          store: this.store,
          owner: this.owner,
          date: this.date,
        })
        .then((docRef) => {
          itemsSection.innerHTML = "";
          db.collection("itemsTransito")
            .get()
            .then((querySnapshot) => {
              querySnapshot.forEach((doc) => {
                let indItem = doc.data();
                printItem(
                  indItem.title,
                  indItem.tkt,
                  indItem.desc,
                  indItem.urg,
                  indItem.store,
                  indItem.owner,
                  indItem.date
                );
              });
            });
        })
        .catch((error) => {
          console.error("Error adding document: ", error);
        });

      modalSection.style.display = "none";
      modalTitle.value = "";
      modalTkt.value = "";
      modalDesc.value = "";
    });
  } else {
    mainSection.style.display = "none";
    loginSection.style.display = "flex";
  }
});

printItem = (title, tkt, desc, urg, store, owner, date) => {
  let model = `<li class="itemCard">
  <span class="itemCardTitle"> ${title}</span>
  <span class="itemCardTkt"> Ticket #${tkt}</span>
  <span class="itemCardDesc">${desc}</span>
  <span class="itemCardStatus">Estado: ${urg}</span>
  <span class='itemCardStore'>Enviado de tienda ${store}</span>
  <span class="itemCardOwner">Recepcionado por ${owner}</span>
  <span class='itemCardDate'>${date}</span>
  <span class='itemCardBtns'><input class="borrarItem" type="button" value="Borrar">
  <input class="imprimirItem" type="button" value="Imprimir"> </span>
</li>`;
  itemsSection.innerHTML += model;
};
