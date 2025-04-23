class SearchBox extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            options: [],
            selected: []
        }
        this.inputRef = React.createRef();
    }
    componentDidMount() {
        fetch('https://localhost:7003/Recipe/preuzmiKategorije')
            .then(response => response.json())
            .then(data => {
                const formatted = data.map(item => ({
                    index: item.id,
                    value:item.name
                }))
                this.setState({options: formatted})
            })
            .catch(error => {
                console.error('Error fetching data:', error)
        })
    }
    handleChange = (e) => {
        const inputValue = this.inputRef.current.value;
        const matchedOption = this.state.options.find(e=>e.value==inputValue);
        matchedOption && !this.state.selected.some(e=>e==matchedOption)?this.setState((prevState)=>({...prevState, selected: [...prevState.selected, matchedOption]})):null;
        console.log(this.state.selected);
    }
    render() {
        return (
            <div>
                <label for="searchCat">Choose a category:</label>
                <input list="searchCat-categories" id="searchCat" name="searchCat" ref={this.inputRef}/>
                <datalist id="searchCat-categories">
                {
                this.state.options!=null && this.state.options.length!=0?this.state.options.map((ctg) => (
                    <option key={ctg.index} value={ctg.value}>{ctg.value}</option>
                )):(<option>none</option>)
                }
                </datalist>
                <button onClick={this.handleChange}>Confirm</button>
                {
                    this.state.selected.map(e => (
                    <h1 key={e.index}>{e.value}</h1>
                ))
                }
            </div>
        );
    }
}


// Render app
ReactDOM.render(
    <SearchBox/>,
    document.getElementById("root")
);