import React, {Component} from "react";
import animationData from "../../lottie/network.json";
import Lottie from "lottie-web";

//Componenta ce modeleaza animatia continua a logo-ului aplicatiei de pe navbar-ul acesteia.
class AnimationLottie extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    //Render componenta
    render() {

        //Optiuni animatie
        const defaultOptions = {
            loop: true,
            autoplay: true,
            animationData,
        };

        return (
            <div>
                <Lottie options={defaultOptions}
                        height={400}
                        width={400}/>
            </div>
        );
    }


}

export default AnimationLottie;

