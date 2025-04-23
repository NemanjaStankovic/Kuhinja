class SearchBox extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            options: [],
            selected: [],
            recipes: []
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
    addCategory = (itemCtg) => {
        console.log(itemCtg);
        this.setState((prevState)=>({...prevState, selected:[...prevState.selected, itemCtg]}))
        console.log(this.state.selected);
    }
    handleChange = (e, itemCtg) => {
        var matchedOption;
        console.log(itemCtg);
        if(!itemCtg)
        {
            const inputValue = this.inputRef.current.value;
            matchedOption = this.state.options.find(e=>e.value==inputValue);
        }
        else
        {
            matchedOption=itemCtg;
        }
        console.log(matchedOption && !this.state.selected.some(e=>e.value==matchedOption.value));
        matchedOption && !this.state.selected.some(e=>e.value==matchedOption.value)?this.setState((prevState)=>({...prevState, selected: [...prevState.selected, matchedOption]})):null;
        fetch('https://localhost:7003/Recipe/preuzmiRecepte')
            .then(response => response.json())    
            .then(data => {
                this.setState({recipes:data});
            });
        console.log(this.state);

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
                <button onClick={(e)=>this.handleChange(e, null)}>Confirm</button>
                {
                    this.state.selected.map(e => (
                    <button key={e.index}>{e.value}</button>
                ))
                }
                <div>
                    {this.state.recipes.map(item=>
                        <div>
                            <h1 key={item.id}>{item.title}</h1>
                            <h3>{item.instructions}</h3>
                            <h4>Recipe categories</h4>
                            {item.categories.map(itemCtg=>
                                <button onClick={(e)=>this.handleChange(e, itemCtg)}>{itemCtg.name}</button>
                            )}
                            <h4>Recipe ingredients</h4>
                            {item.ingredients.map(itemIng=>
                                <button  value={itemIng}>{itemIng.name}</button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        );
    }
}


// Render app
ReactDOM.render(
    <SearchBox/>,
    document.getElementById("root")
);