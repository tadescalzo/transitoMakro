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
let registerInfo = document.querySelector("#registerInfo");
let registerUser = document.querySelector("#registerUser");
let registerStore = document.querySelector("#registerStore");
let registerName = document.querySelector("#registerName");
let infoRegBtn = document.querySelector("#infoRegBtn");
let homeBtn = document.querySelector("#home");
let itemList = new Array();
let userItems = new Array();
let resolved = false;
let pruebita = [
  { nombre: "vacio", apellido: "funciona" },
  { nombre: "segunda", apellido: "linea" },
];
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
home.checked = true;

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
  registerInfo.style.display = "flex";
});

modalCancelBtn.addEventListener("click", () => {
  registerModal.style.display = "none";
  modalEmail.value = "";
  modalPwd.value = "";
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

/*verifica que haya usuario*/
firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    loginSection.style.display = "none";
    mainSection.style.display = "flex";
    navName.innerHTML = `Bienvenido ${user.displayName}`;
    itemsSection.innerHTML = "";
    /*buscamos en la base de datos la info del usuario*/
    let docRef = db.collection("users").doc(user.uid);
    docRef
      .get()
      .then((doc) => {
        /*si existe el usuario guardamos los datos del mismo*/
        if (doc.exists) {
          let usuario = doc.data();
          const {
            userName,
            userStatus,
            userDisplayname,
            userStore,
            userMail,
            userId,
          } = usuario;
          /*en esta funcion guardamos todos los items que haya enviado este usuario en el array userItems*/
          function resolveAfter2Seconds() {
            userItems.length = 0;
            return new Promise((resolve) => {
              db.collection("itemsTransito")
                .get()
                .then((querySnapshot) => {
                  querySnapshot.forEach((doc) => {
                    let indItem = doc.data();
                    indItem.userDb == userId
                      ? userItems.push(indItem)
                      : console.log("nada");
                  });
                });
              /*timeout para evitar bug*/
              setTimeout(() => {
                resolve(userItems);
                itemsSection.innerHTML == "";
              }, 2000);
            });
          }

          /*funcion asincronica para hacer la busqueda de los items*/
          async function asyncCall() {
            result = await resolveAfter2Seconds();
            result.forEach((indItem) =>
              printItem(
                indItem.title,
                indItem.tkt,
                indItem.desc,
                indItem.urg,
                indItem.store,
                indItem.owner,
                indItem.date
              )
            );
          }
          /*llamamos a la funcion que nos devuelve el array de objetos*/
          asyncCall();

          /*modal para agregar item*/
          modalSubmitBtn.addEventListener("click", (e) => {
            e.preventDefault();
            title = modalTitle.value;
            tkt = modalTkt.value;
            desc = modalDesc.value;
            urg = modalOptions.options[modalOptions.selectedIndex].value;
            owner = user.displayName;
            date = new Date().toLocaleDateString();
            store = user.photoURL;
            userDb = user.uid;
            /*AGREGAMOS ITEM A LA COLECCION DE ITEMS*/
            db.collection("itemsTransito")
              .add({
                title: this.title,
                tkt: this.tkt,
                desc: this.desc,
                urg: this.urg,
                store: this.store,
                owner: this.owner,
                date: this.date,
                userDb: this.userDb,
              })
              .then((docRef) => {
                /*UNA VEZ AGREGADO EL ITEM A LA COLECCION SE CARGAN TODOS LOS ITEMS*/
                asyncCall();
                console.log("click");
              })
              .catch((error) => {
                console.error("Error adding document: ", error);
              });

            modalSection.style.display = "none";
            modalTitle.value = "";
            modalTkt.value = "";
            modalDesc.value = "";
          });

          /*si no existe documento de usuario se abre el modal para finalizar registro de usuario*/
        } else {
          registerInfo.style.display = "flex";
        }
      })
      .catch((error) => {
        console.log("Error getting document:", error);
      });

    /*FUNCION DE REGISTRO DE INFO ADICIONAL*/
    infoRegBtn.addEventListener("click", (e) => {
      e.preventDefault();
      userId = user.uid;
      userName = registerUser.value;
      userStore = registerStore.value;
      userMail = user.email;
      userDisplayname = registerName.value;
      db.collection("users")
        .doc(userId)
        .set({
          userName: userName,
          userStore: userStore,
          userMail: userMail,
          userStatus: "user",
          userDisplayname: userDisplayname,
          userId: userId,
        })
        .then(() => {
          console.log("Document successfully written!");
        })
        .catch((error) => {
          console.error("Error writing document: ", error);
        });
      registerInfo.style.display = "none";
      registerStore.value = "";
      registerName.value = "";
      registerUser.value = "";
    });
  } else {
    userItems.length = 0;
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
  <span class="itemCardOwner">por ${owner}</span>
  <span class='itemCardDate'>${date}</span>
  <span class='itemCardBtns'><input class="borrarItem" type="button" value="Borrar">
  <input class="imprimirItem" type="button" value="Imprimir"> </span>
</li>`;
  itemsSection.innerHTML += model;
};
