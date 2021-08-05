let logBtn = document.querySelector("#logBtn");
let usrInput = document.querySelector("#usrInput");
let pswInput = document.querySelector("#pswInput");
let loginSection = document.querySelector("#loginSection");
let navName = document.querySelector(".navName");
let linkAdd = document.querySelector(".linkAdd");
let modalSection = document.querySelector("#modalSection");
let modalSubmitBtn = document.querySelector(".modalSubmitBtn");
let modalCloseBtn = document.querySelector(".modalCloseBtn");
let modalTitle = document.querySelector("#modalTitle");
let modalTkt = document.querySelector("#modalTkt");
let modalDesc = document.querySelector("#modalDesc");
let modalType = document.querySelector("#modalType");
var modalOptions = document.querySelector("#options");
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
      console.log(user);
      // ...
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

logBtn.addEventListener("click", () => {
  let password = pswInput.value;
  let email = usrInput.value;
  logFunct(email, password);
  usrInput.value = "";
  pswInput.value = "";
});

firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    var uid = user.uid;
    loginSection.style.display = "none";
    navName.innerHTML = `Bienvenido ${user.displayName}`;
  } else {
  }
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
  var valor = modalOptions.options[modalOptions.selectedIndex].value;
  console.log(valor);

  db.collection("itemsTransito")
    .add({
      title: this.title,
      tkt: this.tkt,
      desc: this.desc,
    })
    .then((docRef) => {
      db.collection("itemsTransito")
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            let indItem = doc.data();
            console.log(
              `${indItem.desc} => ${indItem.title} => ${indItem.tkt}`
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
