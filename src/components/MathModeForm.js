import React, { Component } from 'react';

class MathModeForm extends Component {

    constructor(props) {
        super(props);

        this.handleInputChange = this.handleInputChange.bind(this);
    }

    handleInputChange(event) {
        this.props.onSubmit(event.target.value);
    }

    render() {
        return (
            <form>
                <p>Choose a math graphing mode</p>
                <input
                    type="radio"
                    name="mode"
                    value="cartesian"
                    checked={this.props.mode === "cartesian"}
                    onChange={this.handleInputChange}
                />
                Cartesian
                <input
                    type="radio"
                    name="mode"
                    value="parametric"
                    checked={this.props.mode === "parametric"}
                    onChange={this.handleInputChange}
                />
                Parametric
                <input
                    type="radio"
                    name="mode"
                    value="new"
                    checked={this.props.mode === "new"}
                    onChange={this.handleInputChange}
                />
                New
            </form>
        );
    }

}

export default MathModeForm;
