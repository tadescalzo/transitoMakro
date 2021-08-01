let logBtn = document.querySelector("#logBtn");
let usrInput = document.querySelector("#usrInput");
let pswInput = document.querySelector("#pswInput");
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

/* function googleSingin() {
  var provider = new firebase.auth.GoogleAuthProvider();
  firebase
    .auth()
    .signInWithPopup(provider)
    .then(function (result) {
      // code which runs on success
      var user = result.user;
      console.log(user.displayName, user.email);
    })
    .catch(function (error) {
      // Handle Errors here.
      var errorCode = error.code;
      console.log(errorCode);
      alert(errorCode);

      var errorMessage = error.message;
      console.log(errorMessage);
      alert(errorMessage);
    });
}

function googleSingout() {
  firebase
    .auth()
    .signOut()
    .then(() => {
      console.log("saliste");
    })
    .catch((error) => {
      console.log("no habia cuenta");
    });
} */
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
    });
};

logBtn.addEventListener("click", () => {
  let password = pswInput.value;
  let email = usrInput.value;
  logFunct(email, password);
});
