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
                    id: item.id,
                    name:item.name
                }))
                this.setState({options: formatted})
            })
            .catch(error => {
                console.error('Error fetching data:', error)
        })
    }
    addCategory = (itemCtg) => {
        this.setState((prevState)=>({...prevState, selected:[...prevState.selected, itemCtg]}))
    }
    handleChange = (e, itemCtg) => {
        var matchedOption;
        if(!itemCtg)
        {
            const inputValue = this.inputRef.current.value;
            matchedOption = this.state.options.find(e=>e.name==inputValue);
        }
        else
        {
            matchedOption=itemCtg;
        }
        console.log(matchedOption);
        matchedOption && !this.state.selected.some(e=>e.name==matchedOption.name)?(this.setState((prevState)=>({...prevState, selected: [...prevState.selected, matchedOption]})), this.inputRef.current.value=''):null;
        fetch('https://localhost:7003/Recipe/preuzmiRecepte')
            .then(response => response.json())    
            .then(data => {
                this.setState({recipes:data});
            });
    }
    removeCategory = (e, id) => {
        console.log('removing category ', id);
        this.setState((prevState)=>({selected:prevState.selected.filter(e=>e.id!=id)}));
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
                    <option key={ctg.id} value={ctg.name}>{ctg.name}</option>
                )):(<option>none</option>)
                }
                </datalist>
                <button onClick={(e)=>this.handleChange(e, null)}>Confirm</button>
                {
                    this.state.selected.map(e => (
                    <button key={e.id}>{e.name}<span onClick={(event)=>this.removeCategory(event, e.id)}>❌</span></button>
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
                                <button  key={itemIng.id} value={itemIng}>{itemIng.name}</button>
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