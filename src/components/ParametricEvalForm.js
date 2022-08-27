import React, {Component} from 'react';

class ParametricEvalForm extends Component {

    constructor(props) {
        super(props);

        this.state = {
            t: 0
        };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
    }

    handleSubmit(event) {
        this.props.onSubmit(this.state);
        event.preventDefault();
    }

    handleInputChange(event) {
        this.setState({t: event.target.value});
    }

    render() {
        return (
            <form onSubmit={this.handleSubmit}>
                <div className="row">
                    <div className="col-lg-4">
                        <label className="float-right">t value:</label>
                    </div>
                    <div className="col-lg-8">
                        <input className="float-left" type="text" name="t" onChange={this.handleInputChange} />
                    </div>
                </div>
                <input className="mt-2" type="submit" value="submit" style={{width: "100%"}} />
            </form>
        );
    }

}

export default ParametricEvalForm;
