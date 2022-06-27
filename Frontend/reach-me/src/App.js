
import './App.css';
import Login from './components/authentication/Login';
import React from "react";
import lottie from "lottie-web";
import anim from './lottie/network.json'
import Homepage from './components/homepage/homepage';

//Entry point aplicatie React
function App() {

  //Incarcarea animatiei continue de pe navigationBar
  React.useEffect(() => {
    lottie.loadAnimation({
      container: document.querySelector("#logoAnimation"),
      animationData: anim,
    });
    return () => lottie.destroy();

  }, []);

  //Render aplicatie:
  return (
    <div className="App">
      {localStorage.getItem(`accounts`) === undefined || localStorage.getItem(`accounts`) === null
        ? < Login />
        : <Homepage />
      }
    </div >
  );
}

export default App;
