import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

import MathDisplay from './components/MathDisplay';

class App extends Component {
    render() {
        return (
            <div className="app">
                <MathDisplay />
            </div>
        );
    }
}

// === Hook into the root element of the DOM ===
ReactDOM.render(
    <App />,
    document.getElementById('root')
);
