import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyB_QXoVeyo-mDO52kh09fLytJYxHFkDcEE",
  authDomain: "cargadireta-d559b.firebaseapp.com",
  projectId: "cargadireta-d559b",
  storageBucket: "cargadireta-d559b.appspot.com",
  messagingSenderId: "857565697300",
  appId: "1:857565697300:web:e956df1c3b6afc7b579e01",
  measurementId: "G-173ZNP619P",
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

export { auth };
