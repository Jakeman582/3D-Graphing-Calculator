import React, {Component} from 'react';

class NewEvalForm extends Component {

    constructor(props) {
        super(props);

        this.state = {
            u: 0,
            v: 0
        };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
    }

    handleSubmit(event) {
        this.props.onSubmit(this.state);
        event.preventDefault();
    }

    handleInputChange(event) {
        this.setState({[event.target.name]: parseFloat(event.target.value)});
    }

    render() {
        return (
            <form onSubmit={this.handleSubmit}>
                <div className="row">
                    <div className="col-lg-4">
                        <label className="float-right">U Value:</label>
                    </div>
                    <div className="col-lg-8">
                        <input className="float-left" type="text" name="u" onChange={this.handleInputChange} />
                    </div>
                </div>
                <div className="row">
                    <div className="col-lg-4">
                        <label className="float-right">V Value:</label>
                    </div>
                    <div className="col-lg-8">
                        <input className="float-left" type="text" name="v" onChange={this.handleInputChange} />
                    </div>
                </div>
                <input type="submit" value="submit" className="mt-2" style={{width: "100%"}} />
            </form>
        );
    }

}

export default NewEvalForm;
