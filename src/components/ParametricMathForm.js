import React, { Component } from 'react';

class ParametricMathForm extends Component {

    constructor(props) {
        super(props);

        this.state = {
            expressionX: 0,
            expressionY: 0,
            expressionZ: 0,
            tStart: 0,
            tEnd: 1,
            tStep: 1
        };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
    }

    handleSubmit(event) {
        this.props.onSubmit(this.state);
        event.preventDefault();
    }

    handleInputChange(event) {
        const target = event.target;
        const name = target.name;
        let value = '';
        if(name === 'expressionX' || name === 'expressionY' || name === 'expressionZ') {
            value = target.value;
        } else {
            value = parseFloat(target.value);
        }

        this.setState({[name]: value});
    }

    render() {
        return (
            <form onSubmit={this.handleSubmit} className="text-center">
                <div className="row">
                    <div className="col-lg-4">
                        <label className="float-right">t Start:</label>
                    </div>
                    <div className="col-lg-8">
                        <input className="float-left" type="text" name="tStart" onChange={this.handleInputChange} />
                    </div>
                </div>
                <div className="row">
                    <div className="col-lg-4">
                        <label className="float-right">t End:</label>
                    </div>
                    <div className="col-lg-8">
                        <input className="float-left" type="text" name="tEnd" onChange={this.handleInputChange} />
                    </div>
                </div>
                <div className="row">
                    <div className="col-lg-4">
                        <label className="float-right">t Step:</label>
                    </div>
                    <div className="col-lg-8">
                        <input className="float-left" type="text" name="tStep" onChange={this.handleInputChange} />
                    </div>
                </div>
                <div className="row">
                    <div className="col-lg-4">
                        <label className="float-right">x(t):</label>
                    </div>
                    <div className="col-lg-8">
                        <input className="float-left" type="text" name="expressionX" onChange={this.handleInputChange} />
                    </div>
                </div>
                <div className="row">
                    <div className="col-lg-4">
                        <label className="float-right">y(t):</label>
                    </div>
                    <div className="col-lg-8">
                        <input className="float-left" type="text" name="expressionY" onChange={this.handleInputChange} />
                    </div>
                </div>
                <div className="row">
                    <div className="col-lg-4">
                        <label className="float-right">z(t):</label>
                    </div>
                    <div className="col-lg-8">
                        <input className="float-left" type="text" name="expressionZ" onChange={this.handleInputChange} />
                    </div>
                </div>
                <input type="submit" value="submit" className="mt-2" style={{width: "100%"}} />
            </form>
        );
    }
}

export default ParametricMathForm;
