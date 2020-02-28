import React from 'react';

import Lottie from 'lottie-react-web';

import { Mutation } from 'react-apollo';
import { Style } from "react-style-tag";

import lz from 'lz-string';
import { ADD_PROJECT } from "../schema.js";
import { SERVER_URL } from '../graphql';

export default class FullScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isStopped: false,
            isPaused: false,
            json: '',
            active: 'x',
            text: '',
            downloaded: false
        };

        this.layers = [];
    }

    componentDidMount() {
        let jsn = JSON.parse(this.props.location.state.json);

        if (jsn.length == 0) {
            fetch(`${SERVER_URL}/json/` + this.props.match.params.animation + '.json')
                .then(response => response.json())
                .then((jsonData) => {
                    this.setState({
                        json: jsonData
                    });

                    this.state.json['layers'].forEach((layer, id) => {
                        if (layer['t'] != undefined) {
                            this.layers.unshift({
                                num: id,
                                text: layer
                            })
                        }

                        if (id+1 == this.state.json['layers'].length) {
                            this.forceUpdate();
                        }
                    });
                })
        } else {
            fetch(`${SERVER_URL}/json/` + this.props.match.params.animation + '.json')
                .then(response => response.json())
                .then((jsonData) => {
                    this.setState({
                        json: jsn
                    });

                    this.state.json['layers'].forEach((layer, id) => {
                        if (layer['t'] != undefined) {
                            this.layers.unshift({
                                num: id,
                                text: layer
                            })
                        }

                        if (id+1 == this.state.json['layers'].length) {
                            this.forceUpdate();
                        }
                    });
                });
        }
    }

    render() {
        var { json } = this.state;

        document.documentElement.requestFullscreen();
        return (
            <div className="center">
                <Style>{`header { display: none }`}</Style>
                <div onClick={() => {
                    this.setState({isPaused: !this.state.isPaused})
                }} className="full_animation" id="animation">
                    <Lottie options={{
                        loop: true,
                        autoplay: true,
                        animationData: json,
                        rendererSettings: {
                            preserveAspectRatio: 'xMidYMid slice',
                        }
                    }}
                            height={`auto`}
                            width={`auto`}
                            isStopped={this.state.isStopped}
                            isPaused={this.state.isPaused}/>
                </div>
            </div>
        );
    };
}
