class SearchBox extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            options: [],
            ingredients: [],
            selected: [],
            selectedIngredients: [],
            recipes: []
        }
        this.inputRef = React.createRef();
        this.ingrRef = React.createRef();
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
            }).then(
                fetch('https://localhost:7003/Recipe/preuzmiSastojke')
                .then(response => response.json())
                .then(data => {
                    const formatted = data.map(item => ({
                        id: item.id,
                        name:item.name
                    }))
                    this.setState({ingredients: formatted})
                }))
            .catch(error => {
                console.error('Error fetching data:', error);
            }).then(
                fetch('https://localhost:7003/Recipe/preuzmiRecepte')
                .then(response => response.json())    
                .then(data => {
                    this.setState({recipes:data});
                }))
            .catch(error => {
                console.error('Error fetching data:', error);
        });
    }
    addCategory = (itemCtg) => {
        this.setState((prevState)=>({...prevState, selected:[...prevState.selected, itemCtg]}))
    }
    preuzmiRecepte(url){
        fetch('https://localhost:7003/Recipe/preuzmiRecepte'+url)
            .then(response => response.json())    
            .then(data => {
                this.setState({recipes:data});
            });
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
        matchedOption && !this.state.selected.some(e=>e.name==matchedOption.name)?(this.setState((prevState)=>({...prevState, selected: [...prevState.selected, matchedOption]}),  () => {this.preuzmiRecepte(this.selectedToUrl())}), this.inputRef.current.value=''):null;
    }
    handleIngredientChange = (e, itemIng) => {
        var matchedOption;
        if(!itemIng)
        {
            const inputValue = this.ingrRef.current.value;
            matchedOption = this.state.ingredients.find(e=>e.name==inputValue);
        }
        else
        {
            matchedOption=itemIng;
        }
        matchedOption && !this.state.selectedIngredients.some(e=>e.name==matchedOption.name)?(this.setState((prevState)=>({...prevState, selectedIngredients: [...prevState.selectedIngredients, matchedOption]}), () => {this.preuzmiRecepte(this.selectedToUrl())}), this.ingrRef.current.value=''):null;
    }
    selectedToUrl(){
        var urlExtension = '';
        if(this.state.selected.length>0)
        {
            urlExtension += '?'+this.state.selected.reduce((acc, curr) => {return acc + 'categories=' + curr.name.replace(' ','%20')+'&';}, '').slice(0,-1);
        }
        urlExtension+=urlExtension!=''?'&':'?';
        if(this.state.options.length>0)
        {
            urlExtension +=  this.state.selectedIngredients.reduce((acc, curr) => {return acc + 'ingredients=' + curr.name.replace(' ', '%20')+'&';}, '').slice(0,-1);
        }
        return urlExtension;
    }
    removeCategory = (e, id) => {
        this.setState((prevState)=>({selected:prevState.selected.filter(e=>e.id!=id)}), () => {this.preuzmiRecepte(this.selectedToUrl())});
    }
    removeIngredient = (e, id) => {
        this.setState((prevState)=>({selectedIngredients: prevState.selectedIngredients.filter(e=>e.id!=id)}), () => {this.preuzmiRecepte(this.selectedToUrl())});
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
                <label for="searchIng">Choose an ingredient:</label>
                <input list="searchIng-ingredients" id="searchIng" name="searchInt" ref={this.ingrRef}/>
                <datalist id="searchIng-ingredients">
                {
                this.state.ingredients!=null && this.state.ingredients.length!=0?this.state.ingredients.map((ing) => (
                    <option key={ing.id} value={ing.name}>{ing.name}</option>
                )):(<option>none</option>)
                }
                </datalist>
                <button onClick={(e)=>this.handleIngredientChange(e, null)}>Confirm</button>
                {
                    this.state.selectedIngredients.map(e => (
                    <button key={e.id}>{e.name}<span onClick={(event)=>this.removeIngredient(event, e.id)}>❌</span></button>
                ))
                }
                <div>
                    {this.state.recipes.map(item=>
                        <div>
                            <h1 key={item.id}>{item.title}</h1>
                            <h3>{item.instructions}</h3>
                            <h4>Recipe categories</h4>
                            {item.categories.map(itemCtg=>
                                <button onClick={(e)=>this.handleIngredientChange(e, itemCtg)}>{itemCtg.name}</button>
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