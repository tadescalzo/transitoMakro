let logBtn = document.querySelector("#logBtn");
let logOut = document.querySelector("#logOut");
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
            indItem.owner
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

      db.collection("itemsTransito")
        .add({
          title: this.title,
          tkt: this.tkt,
          desc: this.desc,
          urg: this.urg,
          owner: this.owner,
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
                  indItem.owner
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

printItem = (title, tkt, desc, urg, owner) => {
  let model = `<div class="itemCard">
  <span class="itemCardTitle"> ${title}</span>
  <hr class='itemCardLine' />
  <span class="itemCardTkt"> #${tkt}</span>
  <hr class='itemCardLine' />
  <span class="itemCardDesc">${desc}</span>
  <hr class='itemCardLine' />
  <span class="itemCardStatus">${urg}</span>
  <hr class='itemCardLine' />
  <span class="itemCardOwner">Recepcionado por ${owner}</span>
  <div>
  <input class="borrarItem" type="button" value="Borrar">
  <input class="imprimirItem" type="button" value="Imprimir">
  </div>
</div>`;
  itemsSection.innerHTML += model;
};
