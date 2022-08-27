import React, { Component } from 'react';

class CartesianMathForm extends Component {

    constructor(props) {
        super(props);

        this.state = {
            expression: 0,
            xMin: -1,
            xMax: 1,
            deltaX: 1,
            yMin: -1,
            yMax: 1,
            deltaY: 1
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
        const value = name === 'expression' ? target.value : parseFloat(target.value);

        this.setState({[name]: value});
    }

    render() {
        return (
            <form onSubmit={this.handleSubmit} className="">
                <div className="row">
                    <div className="col-lg-4">
                        <label className="float-right">Minimum X:</label>
                    </div>
                    <div className="col-lg-8">
                        <input className="float-left" type="text" name="xMin" onChange={this.handleInputChange} />
                    </div>
                </div>
                <div className="row">
                    <div className="col-lg-4">
                        <label className="float-right">Maximum X:</label>
                    </div>
                    <div className="col-lg-8">
                        <input className="float-left" type="text" name="xMax" onChange={this.handleInputChange} />
                    </div>
                </div>
                <div className="row">
                    <div className="col-lg-4">
                        <label className="float-right">Delta X:</label>
                    </div>
                    <div className="col-lg-8">
                        <input className="float-left" type="text" name="deltaX" onChange={this.handleInputChange} />
                    </div>
                </div>
                <div className="row">
                    <div className="col-lg-4">
                        <label className="float-right">Minimum Y:</label>
                    </div>
                    <div className="col-lg-8">
                        <input className="float-left" type="text" name="yMin" onChange={this.handleInputChange} />
                    </div>
                </div>
                <div className="row">
                    <div className="col-lg-4">
                        <label className="float-right">Maximum Y:</label>
                    </div>
                    <div className="col-lg-8">
                        <input className="float-left" type="text" name="yMax" onChange={this.handleInputChange} />
                    </div>
                </div>
                <div className="row">
                    <div className="col-lg-4">
                        <label className="float-right">Delta Y:</label>
                    </div>
                    <div className="col-lg-8">
                        <input className="float-left" type="text" name="deltaY" onChange={this.handleInputChange} />
                    </div>
                </div>
                <div className="row">
                    <div className="col-lg-4">
                        <label className="float-right">Expression:</label>
                    </div>
                    <div className="col-lg-8">
                        <input className="float-left" type="text" name="expression" onChange={this.handleInputChange} />
                    </div>
                </div>
                <input type="submit" value="submit" className="mt-2" style={{width: "100%"}} />
            </form>
        );
    }

}

export default CartesianMathForm;
