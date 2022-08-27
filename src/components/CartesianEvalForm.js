import React, {Component} from 'react';

class CartesianEvalForm extends Component {

    constructor(props) {
        super(props);

        this.state = {
            x: 0,
            y: 0
        };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
    }

    handleSubmit(event) {
        this.props.onSubmit(this.state);
        event.preventDefault();
    }

    handleInputChange(event) {
        const name = event.target.name;
        this.setState({[name]: parseFloat(event.target.value)});
    }

    render() {
        return (
            <form onSubmit={this.handleSubmit}>
                <div className="row">
                    <div className="col-lg-4">
                        <label className="float-right">X Value:</label>
                    </div>
                    <div className="col-lg-8">
                        <input className="float-left" type="text" name="x" onChange={this.handleInputChange} />
                    </div>
                </div>
                <div className="row">
                    <div className="col-lg-4">
                        <label className="float-right">Y Value:</label>
                    </div>
                    <div className="col-lg-8">
                        <input className="float-left" type="text" name="y" onChange={this.handleInputChange} />
                    </div>
                </div>
                <input type="submit" value="submit" className="mt-2" style={{width: "100%"}} />
            </form>
        );
    }

}

export default CartesianEvalForm;
