const {useState, useEffect, useRef} = React;

function SearchBox() {
    const [options, setOptions] = useState([]);
    const [ingredients, setIngredients] = useState([]);
    const [selected, setSelected] = useState([]);
    const [selectedIngredients, setSelectedIngredients] = useState([]);
    const [recipes, setRecipes] = useState([]);
    const inputRef = useRef(null);
    const ingrRef = useRef(null);

    useEffect(() => {
        preuzmiRecepte(selectedToUrl());
    }, [selected, selectedIngredients]);

    useEffect(() => {
        async function fetchData() {
            try {
                const [categoriesRes, ingredientsRes, recipesRes] = await Promise.all([
                    fetch('https://localhost:7003/Recipe/preuzmiKategorije').then(res => res.json()),
                    fetch('https://localhost:7003/Recipe/preuzmiSastojke').then(res => res.json()),
                    fetch('https://localhost:7003/Recipe/preuzmiRecepte').then(res => res.json())
                ]);
                
                setOptions(categoriesRes.map(item => ({ id: item.id, name: item.name })));
                setIngredients(ingredientsRes.map(item => ({ id: item.id, name: item.name, unitOfMeassure: item.unitOfMeassure })));
                setRecipes(recipesRes);
                console.log({ categoriesRes, ingredientsRes, recipesRes });
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }

        fetchData();
    }, []);

    function selectedToUrl() {
        let urlExtension = '';
        if (selected.length > 0) {
            urlExtension += '?' + selected.reduce((acc, curr) => acc + 'categories=' + encodeURIComponent(curr.name) + '&', '').slice(0, -1);
        }
        urlExtension += urlExtension !== '' ? '&' : '?';
        if (selectedIngredients.length > 0) {
            urlExtension += selectedIngredients.reduce((acc, curr) => acc + 'ingredients=' + encodeURIComponent(curr.name) + '&', '').slice(0, -1);
        }
        return urlExtension;
    }

    async function preuzmiRecepte(url) {
        try {
            const response = await fetch('https://localhost:7003/Recipe/preuzmiRecepte' + url);
            const data = await response.json();
            setRecipes(data);
        } catch (error) {
            console.error('Error fetching recipes:', error);
        }
    }

    const handleCategoryChange = (e, itemCtg = null) => {
        console.log('Category changed');
        const matchedOption = itemCtg || options.find(opt => opt.name === inputRef.current.value);
        if (matchedOption && !selected.some(sel => sel.name === matchedOption.name)) {
            setSelected(prev => [...prev, matchedOption]);
        }
        if (!itemCtg) inputRef.current.value = '';
    };

    const handleIngredientChange = (e, itemIng = null) => {
        const matchedOption = itemIng || ingredients.find(opt => opt.name === ingrRef.current.value);
        if (matchedOption && !selectedIngredients.some(sel => sel.name === matchedOption.name)) {
            setSelectedIngredients(prev => [...prev, matchedOption]);
        }
        if (!itemIng) ingrRef.current.value = '';
    };

    const removeCategory = (id) => {
        setSelected(prev => prev.filter(e => e.id !== id));
    };

    const removeIngredient = (id) => {
        setSelectedIngredients(prev => prev.filter(e => e.id !== id));
        // setTimeout(() => preuzmiRecepte(selectedToUrl()), 0);
    };

    return (
        <div>
            <SearchInputs 
                options={options}
                ingredients={ingredients}
                selected={selected}
                selectedIngredients={selectedIngredients}
                inputRef={inputRef}
                ingrRef={ingrRef}
                handleCategoryChange={handleCategoryChange}
                handleIngredientChange={handleIngredientChange}
                removeCategory={removeCategory}
                removeIngredient={removeIngredient}
            />
            <RecipeList 
                recipes={recipes}
                options={options}
                ingredients={ingredients}
                selected={selected}
                selectedIngredients={selectedIngredients}
                handleCategoryChange={handleCategoryChange}
                handleIngredientChange={handleIngredientChange}
                removeCategory={removeCategory}
                removeIngredient={removeIngredient} />
        </div>
    );
}

function SearchInputs({ options, ingredients, selected, selectedIngredients, inputRef, ingrRef, handleCategoryChange, handleIngredientChange, removeCategory, removeIngredient }) {
    return (
        <div>
            <label htmlFor="searchCat">Choose a category:</label>
            <input list="searchCat-categories" id="searchCat" name="searchCat" ref={inputRef}/>
            <datalist id="searchCat-categories">
                {options.length > 0 ? options.map(ctg => (
                    <option key={ctg.id} value={ctg.name}>{ctg.name}</option>
                )) : (<option>none</option>)}
            </datalist>
            <button onClick={(e) => handleCategoryChange(e, null)}>Confirm</button>

            {selected.map(e => (
                <button key={e.id}>
                    {e.name} <span onClick={() => removeCategory(e.id)}>❌</span>
                </button>
            ))}

            <label htmlFor="searchIng">Choose an ingredient:</label>
            <input list="searchIng-ingredients" id="searchIng" name="searchIng" ref={ingrRef}/>
            <datalist id="searchIng-ingredients">
                {ingredients.length > 0 ? ingredients.map(ing => (
                    <option key={ing.id} value={ing.name}>{ing.name}({ing.unitOfMeassure})</option>
                )) : (<option>none</option>)}
            </datalist>
            <button onClick={(e) => handleIngredientChange(e, null)}>Confirm</button>

            {selectedIngredients.map(e => (
                <button key={e.id}>
                    {e.name} <span onClick={() => removeIngredient(e.id)}>❌</span>
                </button>
            ))}
        </div>
    );
}

function RecipeList({ recipes, options, ingredients, selected, selectedIngredients, handleCategoryChange, handleIngredientChange, removeCategory, removeIngredient}) {
    return (
        <div>
            {recipes.map(item => (
                <div key={item.id}>
                    <h1>{item.title}</h1>
                    <h3>{item.instructions}</h3>
                    <h4>Recipe categories</h4>
                    {item.categories.map(itemCtg => (
                        <button key={itemCtg.id} onClick={(e)=>handleCategoryChange(e, itemCtg)}>{itemCtg.name}</button>
                    ))}
                    <h4>Recipe ingredients</h4>
                    {item.recipeIngredients.map(itemIng => (
                        <button key={itemIng.ingredient.id} onClick={(e)=>handleIngredientChange(e, itemIng.ingredient)}>{itemIng.ingredient.name}</button>
                    ))}
                </div>
            ))}
        </div>
    );
}

// Render it!
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<SearchBox />);
