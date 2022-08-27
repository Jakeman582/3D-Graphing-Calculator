import React, { Component } from 'react';

class NewMathForm extends Component {

    constructor(props) {
        super(props);

        this.state = {
            expressionX: 0,
            expressionY: 0,
            expressionZ: 0,
            uStart: 0,
            uEnd: 0,
            uStep: 0,
            vStart: 0,
            vEnd: 0,
            vStep: 0
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
                        <label className="float-right">u Start:</label>
                    </div>
                    <div className="col-lg-8">
                        <input className="float-left" type="text" name="uStart" onChange={this.handleInputChange} />
                    </div>
                </div>
                <div className="row">
                    <div className="col-lg-4">
                        <label className="float-right">u End:</label>
                    </div>
                    <div className="col-lg-8">
                        <input className="float-left" type="text" name="uEnd" onChange={this.handleInputChange} />
                    </div>
                </div>
                <div className="row">
                    <div className="col-lg-4">
                        <label className="float-right">u Step:</label>
                    </div>
                    <div className="col-lg-8">
                        <input className="float-left" type="text" name="uStep" onChange={this.handleInputChange} />
                    </div>
                </div>
                <div className="row">
                    <div className="col-lg-4">
                        <label className="float-right">v Start:</label>
                    </div>
                    <div className="col-lg-8">
                        <input className="float-left" type="text" name="vStart" onChange={this.handleInputChange} />
                    </div>
                </div>
                <div className="row">
                    <div className="col-lg-4">
                        <label className="float-right">v End:</label>
                    </div>
                    <div className="col-lg-8">
                        <input className="float-left" type="text" name="vEnd" onChange={this.handleInputChange} />
                    </div>
                </div>
                <div className="row">
                    <div className="col-lg-4">
                        <label className="float-right">v Step:</label>
                    </div>
                    <div className="col-lg-8">
                        <input className="float-left" type="text" name="vStep" onChange={this.handleInputChange} />
                    </div>
                </div>
                <div className="row">
                    <div className="col-lg-4">
                        <label className="float-right">x(u, v):</label>
                    </div>
                    <div className="col-lg-8">
                        <input className="float-left" type="text" name="expressionX" onChange={this.handleInputChange} />
                    </div>
                </div>
                <div className="row">
                    <div className="col-lg-4">
                        <label className="float-right">y(u, v):</label>
                    </div>
                    <div className="col-lg-8">
                        <input className="float-left" type="text" name="expressionY" onChange={this.handleInputChange} />
                    </div>
                </div>
                <div className="row">
                    <div className="col-lg-4">
                        <label className="float-right">z(u, v):</label>
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

export default NewMathForm
