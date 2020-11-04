import React, {Component} from 'react';
import '../styles/CityInput.css';
import logo from '../images/logo.png'

/**
 * Component of a form to submit a searched city and recuperate its weather 
*/

class CityInput extends  Component {
    constructor(props) {
        super(props);
        this.state = {
            city: "",
            errorMessage : "",
        }
    }

    onChange = (e) => this.setState({city: e.target.value})

    /**
     * Submit the name of the entered city in order to get the state of weather there
     */
    onSubmit = (e) => {
        e.preventDefault();
        const { city } = this.state
        if (city) {  // the user enter a city name
            this.setState({errorMessage: ''})       
            this.props.getWeatherDataAndParse(city); // get data weather and parse it
        } else { // no name is entered
            this.setState( { errorMessage: "Please enter a city name before even trying to search for it" } )
        }  
    }

    render(){
        const { errorMessage } = this.state
        return (
            <React.Fragment>
                <img alt="logo" src={logo} />
                <form className="search-form" onSubmit = {this.onSubmit}>
                <input                
                    type = "text" 
                    name = "city"
                    className="city"
                    placeholder = "Search any City..."
                    value = {this.state.city}
                    onChange = {this.onChange}
                />
                <button type = "submit" className="search-btn"> 
                    <img alt="" src="https://i.ibb.co/0J6q21Q/search-icon.png"/>
                </button>    
                { errorMessage && 
                    <div style={{ color:"red", margin: "25px", textAlign: "center",}} >
                        {errorMessage}
                    </div> 
                }
                </form>
            </React.Fragment>
        )
    }
}
export default CityInput;