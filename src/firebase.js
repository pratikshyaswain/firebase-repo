import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyAykrlmLogdfkeZ2yyitXWNmgFqUAp7uHs",
  authDomain: "fir-3e207.firebaseapp.com",
  projectId: "fir-3e207",
  storageBucket: "fir-3e207.appspot.com",
  messagingSenderId: "188150010978",
  appId: "1:188150010978:web:d75a3ed87f5e3a5bff2d3b",
  measurementId: "G-0PJ11SM1QJ",
  databaseURL: "https://fir-3e207-default-rtdb.firebaseio.com",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
