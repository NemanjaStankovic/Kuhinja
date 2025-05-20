const {useState, useEffect, useRef} = React;

function SearchBox() {
    const [options, setOptions] = useState({
        time: [],
        portions: [],
        types: []
      });
    const [ingredients, setIngredients] = useState([]);
    const [selected, setSelected] = useState([]);
    const [selectedIngredients, setSelectedIngredients] = useState([]);
    const [recipes, setRecipes] = useState([]);
    const [recipeToShow, setRecipeToShow] = useState([]);
    const inputRef1 = useRef(null);
    const inputRef2 = useRef(null);
    const inputRef3 = useRef(null);
    const ingrRef = useRef(null);
    const amountFilterRef = useRef(null);

    useEffect(() => {
        console.log(selected);
        console.log(selectedIngredients);
        preuzmiRecepte(selectedToUrl());
        amountFilterRef.current.value='';
    }, [selected, selectedIngredients]);
    const fetchIngredients = () => {
        fetch('https://localhost:7003/Recipe/preuzmiSastojke')
            .then(res => res.json())
            .then(data => {console.log("Fetched ingredients:", data);setIngredients(data);})
            .catch(err => console.error(err));
    };
    useEffect(() => {
        async function fetchData() {
            try {
                const [categoriesRes, ingredientsRes, recipesRes] = await Promise.all([
                    fetch('https://localhost:7003/Recipe/preuzmiKategorije').then(res => res.json()),
                    fetch('https://localhost:7003/Recipe/preuzmiSastojke').then(res => res.json()),
                    fetch('https://localhost:7003/Recipe/preuzmiRecepte', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify([
                        ])
                    }).then(res => res.json())
                ]);
                
                setOptions(categoriesRes);//.map(item => ({ id: item.id, name: item.name, type: item.type }))
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
        // if (selectedIngredients.length > 0) {
        //     urlExtension += selectedIngredients.reduce((acc, curr) => acc + 'ingredients=' + encodeURIComponent(curr.name) + '&', '').slice(0, -1);
        // }
        return urlExtension;
    }

    async function preuzmiRecepte(url) {
        try {
            console.log(url);
            const response = await fetch('https://localhost:7003/Recipe/preuzmiRecepte' + url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(
                    selectedIngredients.map(sl =>({"name":sl.name, "amount":sl.amount}))
                )
            });
            const data = await response.json();
            setRecipes(data);
        } catch (error) {
            console.error('Error fetching recipes:', error);
        }
    }

    const handleCategoryChange = (e, itemCtg = null) => {
        console.log(itemCtg);
        if(itemCtg)
        {
            setSelected(prev => [...prev, itemCtg]);
            return
        }
        const matchedOption1 = itemCtg || options.time.find(opt => opt.name === inputRef1.current.value);
        if (matchedOption1 && !selected.some(sel => sel.name === matchedOption1.name)) {
            setSelected(prev => {
                const filtered = prev.filter(cat=>cat.type != matchedOption1.type);
                return [...filtered, matchedOption1];
            })
        }
        if (!itemCtg) inputRef1.current.value = '';

        const matchedOption2 = itemCtg || options.portions.find(opt => opt.name === inputRef2.current.value);
        if (matchedOption2 && !selected.some(sel => sel.name === matchedOption2.name)) {
            setSelected(prev => {
                const filtered = prev.filter(cat=>cat.type != matchedOption2.type);
                return [...filtered, matchedOption2];
            })
        }
        if (!itemCtg) inputRef2.current.value = '';

        const matchedOption3 = itemCtg || options.types.find(opt => opt.name === inputRef3.current.value);
        if (matchedOption3 && !selected.some(sel => sel.name === matchedOption3.name)) {
            setSelected(prev => [...prev, matchedOption3]);
        }
        if (!itemCtg) inputRef3.current.value = '';
    };

    const handleIngredientChange = (e, itemIng = null) => {
        const locName = itemIng?itemIng:ingrRef.current.value
        const matchedOption = ingredients.find(opt => opt.name === locName);
        if (matchedOption && !selectedIngredients.some(sel => sel.name === matchedOption.name)) {
            setSelectedIngredients(prev => [...prev, {...matchedOption, amount:(itemIng || amountFilterRef.current.value==''?9999:amountFilterRef.current.value)}]);
        }
        if (!itemIng) ingrRef.current.value = '';
    };

    const removeCategory = (id) => {
        setSelected(prev => prev.filter(e => e.id !== id));
    };

    const removeIngredient = (id) => {
        setSelectedIngredients(prev => prev.filter(e => e.id !== id));
    };

    return (
        <div>
            <SearchInputs 
                recipes={recipes}
                options={options}
                ingredients={ingredients}
                selected={selected}
                selectedIngredients={selectedIngredients}
                inputRef1={inputRef1}
                inputRef2={inputRef2}
                inputRef3={inputRef3}
                ingrRef={ingrRef}
                handleCategoryChange={handleCategoryChange}
                handleIngredientChange={handleIngredientChange}
                removeCategory={removeCategory}
                removeIngredient={removeIngredient}
                amountFilterRef={amountFilterRef}
                fetchIngredients={fetchIngredients}
            />
        </div>
    );
}

function SearchInputs({ recipes, options, ingredients, selected, selectedIngredients, inputRef1, inputRef2, inputRef3, ingrRef, handleCategoryChange, handleIngredientChange, removeCategory, removeIngredient, amountFilterRef, fetchIngredients }) {
    return (
        <div>
            <h1 class="text-blue-500 text-5xl font-medium text-center" style={{ fontFamily: 'Patrick Hand, cursive' }}>Find out what you can make!</h1>
            <h3 class="text-xl overline text-center pb-4" style={{ fontFamily: 'Patrick Hand, cursive' }}>Choose ingredients you have and its amount and show recepies you can make now!</h3>
            <div class="flex">
                <div class="flex inline-flex min-h-screen max-w-xl p-6 bg-white/20 backdrop-blur-sm rounded-2xl shadow-md">
                    <div>
                        <h1 style={{ fontFamily: 'Patrick Hand, cursive' }} class="text-blue-500 text-3xl">Filter</h1>
                        <label htmlFor="searchCat">Choose a category:</label><br></br>
                        <input class="rounded text-blue-500 border border-blue-500 border-2 m-2" list="searchCat-categories-time" id="searchCat-time" name="searchCat-time" ref={inputRef1} placeholder={`Vreme spremanja`}/><br></br>
                        <datalist id="searchCat-categories-time">
                            {options.time.length > 0 ? options.time.map(ctg => (
                                <option key={ctg.id} value={ctg.name}>{ctg.name}</option>
                            )) : (<option>none</option>)}
                        </datalist>
                        <input class="rounded text-blue-500 border border-blue-500 border-2 m-2" list="searchCat-categories-portions" id="searchCat-portions" name="searchCat-portions" ref={inputRef2} placeholder={`Broj porcija`}/><br></br>
                        <datalist id="searchCat-categories-portions">
                            {options.portions.length > 0 ? options.portions.map(ctg => (
                                <option key={ctg.id} value={ctg.name}>{ctg.name}</option>
                            )) : (<option>none</option>)}
                        </datalist>
                        <input class="rounded text-blue-500 border border-blue-500 border-2 m-2" list="searchCat-categories-types" id="searchCat-types" name="searchCat-types" ref={inputRef3} placeholder={`Tipovi`}/><br></br>
                        <datalist id="searchCat-categories-types">
                            {options.types.length > 0 ? options.types.map(ctg => (
                                <option key={ctg.id} value={ctg.name}>{ctg.name}</option>
                            )) : (<option>none</option>)}
                        </datalist>
                        <button class="bg-blue-500 px-2 rounded text-white m-2" onClick={(e) => handleCategoryChange(e, null)}>Confirm</button><br></br>

                        <label htmlFor="searchIng">Choose an ingredient:</label><br></br>
                        <div>
                            <input class="rounded text-blue-500 border border-blue-500 border-2 m-2" list="searchIng-ingredients" id="searchIng" name="searchIng" ref={ingrRef} placeholder={`Sastojak`}/><br></br>
                            <datalist id="searchIng-ingredients">
                                {ingredients.length > 0 ? ingredients.map(ing => (
                                    <option key={ing.id} value={ing.name}>{ing.name}({ing.unitOfMeassure})</option>
                                )) : (<option>none</option>)}
                            </datalist>
                            <input class="rounded text-blue-500 border border-blue-500 border-2 m-2" id="ing-amount-you-have" placeholder={`Kolicina`} ref={amountFilterRef}/><br></br>
                        </div>
                        <button class="bg-blue-500 px-2 rounded text-white m-2" onClick={(e) => handleIngredientChange(e, null)}>Confirm</button>
                         {
                         selected!=null && selected.length!=0?<div><label>Category filters:</label><br></br></div>:null}
                         {selected.map(e => (
                            <div>
                                <button class="border text-blue-500 border-blue-500 rounded-2xl p-1" key={e.id}>
                                    {e.name} <span onClick={() => removeCategory(e.id)}>❌</span>
                                </button><br></br>
                            </div>
                        ))}
                        {
                         selectedIngredients!=null && selectedIngredients.length!=0?<div><br></br><label>Ingredients filters:</label><br></br></div>:null}
                        {selectedIngredients.map(e => (
                            <div>
                                <button class="border text-blue-500 border-blue-500 rounded-2xl p-1" key={e.id}>
                                    {e.name} ({e.amount} {e.unitOfMeassure}) <span onClick={() => removeIngredient(e.id)}>❌</span>
                                </button><br></br>
                            </div>
                        ))}
                    </div>
                </div>
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
                
                <SelectedRecipe
                recipes={recipes}
                options={options}
                ingredients={ingredients}
                selected={selected}
                selectedIngredients={selectedIngredients}
                fetchIngredients = {fetchIngredients}
                />

            </div>
            <AddRecipe 
            recipes={recipes}
            options={options}
            ingredients={ingredients}
            selected={selected}
            selectedIngredients={selectedIngredients}
            fetchIngredients = {fetchIngredients} />
        </div>
    );
}

function SelectedRecipe({ options, ingredients, selected, selectedIngredients, fetchIngredients }){
    return (
        <div class="flex inline-flex max-w-9/10 p-6 bg-white/20 backdrop-blur-sm rounded-2xl shadow-md">
            
        </div>);
}

function RecipeList({ recipes, options, ingredients, selected, selectedIngredients, handleCategoryChange, handleIngredientChange, removeCategory, removeIngredient}) {
    return (
        <div class="flex items-start p-4 grow rounded flex-wrap overflow-visible">
            {recipes.map(item => (
                <div onClick={()=> alert('Div clicked!')} class="relative group cursor-pointer">
                    <div class="shadow m-1 p-2 rounded-2xl grow flex max-w-xs overflow-hidden transition-all duration-300 max-h-[400px] group-hover:max-h-[1000px] bg-white">
                        <div key={item.id}>
                            <h1 class="font-bold text-xl mb-2">{item.title}</h1>
                            <h3 class="line-clamp-2 max-w-xs">{item.instructions}</h3>
                            <img class="max-w-xs max-h-48 object-contain md:object-cover rounded-lg shadow-md"src={item.imageUrl} alt={`Recipe image ${item.id}`} key={item.id} /><br></br>
                            <h4 style={{ fontFamily: 'Patrick Hand, cursive' }}>Recipe categories</h4>
                            {item.categories.map(itemCtg => (
                                <button class="bg-blue-500 text-white m-1 px-2 rounded " key={itemCtg.id} onClick={(e)=>handleCategoryChange(e, itemCtg)}>{itemCtg.name}</button>
                            ))}
                            <h4 style={{ fontFamily: 'Patrick Hand, cursive' }}>Recipe ingredients</h4>
                            {item.recipeIngredients.map(itemIng => (
                                <button class="bg-blue-500 text-white m-1 px-2 rounded " key={itemIng.ingredient.id} onClick={(e)=>handleIngredientChange(e, itemIng.ingredient.name)}>{itemIng.ingredient.name}</button>
                            ))}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

function AddRecipe({ options, ingredients, selected, selectedIngredients, fetchIngredients }){
    const [addRecCat, setAddRecCat] = useState([]);
    const [addRecIng, setAddRecIng] = useState([]);
    const addRecIngRef = useRef(null);
    const addRecIngAmountRef = useRef(null);
    const optionsUOM = ["komada", "pakovanje", "kašičica", "kašika", "g(grama)","kg(kilograma)","l(litra)","ml(mililitra)", "prstohvat", "po ukusu"];
    const inputRef1 = useRef(null);
    const inputRef2 = useRef(null);
    const inputRef3 = useRef(null);
    const addRecTitleRef = useRef(null);
    const addRecInstRef = useRef(null);
    const addRecImgRef = useRef(null);
    const newIng = useRef(null);
    const newUOM = useRef(null);

    useEffect(() => {
        console.log(addRecCat);
    }, [addRecCat]);

    const addNewIngredient = (event) => {
        fetch('https://localhost:7003/Recipe/dodajSastojak/'+newIng.current.value+'/'+newUOM.current.value, {
            method: 'POST'
          })
          .then(res => {
            if (!res.ok) throw new Error('Failed to add');
            return res.text();
          })
          .then(()=>{
            alert("Sastojak uspesno dodat!");
            newIng.current.value='';
            newUOM.current.value='';
            fetchIngredients();
          })
          .catch(err=>console.error(err));
    };
    const handleCategoryChange = (e) => {
        const matchedOption1 = options.time.find(opt => opt.name === inputRef1.current.value);
        if(matchedOption1){
            setAddRecCat(prev => {
                const filtered = prev.filter(cat=>cat.type != matchedOption1.type);
                return [...filtered, matchedOption1];
            });
        }
        inputRef1.current.value = '';

        const matchedOption2 = options.portions.find(opt => opt.name === inputRef2.current.value);
        if(matchedOption2){
            setAddRecCat(prev => {
                const filtered = prev.filter(cat=>cat.type != matchedOption2.type);
                return [...filtered, matchedOption2];
            });
        }
        inputRef2.current.value = '';

        const matchedOption3 = options.types.find(opt => opt.name === inputRef3.current.value);
        if (matchedOption3 && !addRecCat.some(sel => sel.name === matchedOption3.name)) {
            setAddRecCat(prev => [...prev, matchedOption3]);
        }
        inputRef3.current.value = '';
    }
    const handleIngredientChange = (e, itemIng=null) => {
        const matchedOption = itemIng || ingredients.find(opt => opt.name === addRecIngRef.current.value);
        if (matchedOption && !addRecIng.some(sel => sel.name === matchedOption.name)) {
            setAddRecIng(prev => [...prev, {...matchedOption, amount:addRecIngAmountRef.current.value||9999}]);
        }
        if (!itemIng) addRecIngRef.current.value = '';
    }
    const removeCategory = (id) => {
        setAddRecCat(prev => prev.filter(e => e.id !== id));
    };
    const removeIngredient = (id) => {
        setAddRecIng(prev => prev.filter(e => e.id !== id));
    };
    const handleSubmit = async (e) => {
        e.preventDefault();

        const title = addRecTitleRef.current.value.trim();
        const instructions = addRecInstRef.current.value.trim();
        const fileInput = addRecImgRef.current;
        const file = fileInput && fileInput.files && fileInput.files[0];
        if (!file) {
            alert("No image selected!");
            return;
        }

        if(!title) {
            alert("Title is required.");
            return;
        }

        if(!instructions) {
            alert("Instructions are required.");
            return;
        }

        if(addRecIng.length === 0) {
            alert("Please add at least one ingredient.");
            return;
        }

        for(let ing of addRecIng) {
            if (!ing.amount || isNaN(ing.amount) || Number(ing.amount) <= 0) {
                alert(`Invalid amount of ingredient: ${ing.name}`);
                return;
            }
        }

        if(addRecCat.length === 0) {
            alert("Please add at least one category.");
            return;
        }

        const formData = new FormData();
        formData.append("title", addRecTitleRef.current.value);
        formData.append("instructions", addRecInstRef.current.value);
        formData.append("image", file);
        console.log(addRecIng, addRecCat);
        addRecIng.forEach(ing => {
            formData.append("ingredients", JSON.stringify({
                Id: ing.id,
                Name: ing.name,
                Amount: parseFloat(ing.amount)
            }));
        });

        addRecCat.forEach(cat => {
            formData.append("categories", JSON.stringify({
                Id:cat.id,
                Name: cat.name
            }))
        })

        try{
            const res = await fetch('https://localhost:7003/Recipe/dodajRecept', {
                method: "POST",
                body: formData
            });

            if(!res.ok) {
                throw new Error("Failed to submit recipe");
            }
        const data = await res.json();
        console.log("Recipe submitted!", data);
        alert("Recipe added successfully!");
        // Optionally: clear form or navigate
        } catch (err) {
            console.error(err.message);
            alert("Something went wrong while submitting.");
        }
    }
    return(
        <div class="flex inline-flex max-w-9/10 p-6 bg-white/20 backdrop-blur-sm rounded-2xl shadow-md">
            <h1 style={{ fontFamily: 'Patrick Hand, cursive' }} class="text-blue-500 text-3xl px-6">Add Recipe</h1>
            <form id="addrecipe" encType="multipart/form-data" onSubmit={handleSubmit}>
                <input class="rounded text-blue-500 border border-blue-500 border-2 m-2" type="text" id="title" name="title" ref={addRecTitleRef} required placeholder="Title"></input><br></br>

                <textarea class="rounded text-blue-500 border border-blue-500 border-2 m-2" id="instructions" name="instructions" rows="5" cols="40" ref={addRecInstRef} required placeholder="Instructions"></textarea><br></br>

                <label htmlFor="image">Upload Image:</label>
                <input class="rounded-5xl text-blue-500 border border-blue-500 border-2 m-2" type="file" id="image" name="image" accept="image/*" ref={addRecImgRef} required></input><br></br>

                <label htmlFor="searchCat">Choose a category:</label>
                <input class="rounded text-blue-500 border border-blue-500 border-2 m-2" list="searchCat-categories-time" id="searchCat-time" name="searchCat-time" ref={inputRef1} placeholder={`Vreme spremanja`}/>
                <datalist id="searchCat-categories-time">
                    {options.time.length > 0 ? options.time.map(ctg => (
                        <option key={ctg.id} value={ctg.name}>{ctg.name}</option>
                    )) : (<option>none</option>)}
                </datalist>
                <input class="rounded text-blue-500 border border-blue-500 border-2 m-2" list="searchCat-categories-portions" id="searchCat-portions" name="searchCat-portions" ref={inputRef2} placeholder={`Broj porcija`}/>
                <datalist id="searchCat-categories-portions">
                    {options.portions.length > 0 ? options.portions.map(ctg => (
                        <option key={ctg.id} value={ctg.name}>{ctg.name}</option>
                    )) : (<option>none</option>)}
                </datalist>
                <input class="rounded text-blue-500 border border-blue-500 border-2 m-2" list="searchCat-categories-types" id="searchCat-types" name="searchCat-types" ref={inputRef3} placeholder={`Tipovi`}/>
                <datalist id="searchCat-categories-types">
                    {options.types.length > 0 ? options.types.map(ctg => (
                        <option key={ctg.id} value={ctg.name}>{ctg.name}</option>
                    )) : (<option>none</option>)}
                </datalist>
                <button class="bg-blue-500 px-2 rounded text-white m-2" type="button" onClick={(e) => handleCategoryChange(e)}>Confirm</button><br></br>

                {addRecCat.map(e => (
                    <button class="border text-blue-500 border-blue-500 rounded-2xl p-1" key={e.id}>
                        {e.name} <span onClick={() => removeCategory(e.id)}>❌</span>
                    </button>
                ))}
                <br></br>
                <label htmlFor="addRecIng">Add Recipe Ingredient:</label>
                <input class="rounded text-blue-500 border border-blue-500 border-2 m-2" list="addRec-ingredients" id="addRecIng" name="addRecIng" placeholder={`Ingredient`} ref={addRecIngRef}/>
                <datalist id="addRec-ingredients">
                    {ingredients.length > 0 ? ingredients.map(ing => (
                        <option key={ing.id} value={ing.name}>{ing.name}({ing.unitOfMeassure})</option>
                    )) : (<option>none</option>)}
                </datalist>
                <input class="rounded text-blue-500 border border-blue-500 border-2 m-2" id="addRec-ingredients-amount" placeholder={`Amount`} ref={addRecIngAmountRef}/>
                <button class="bg-blue-500 px-2 rounded text-white m-2" type="button" onClick={(e) => handleIngredientChange(e, null)}>Confirm</button><br></br>

                <label>Ingredient doesnt exist? Add it!</label>
                <input class="rounded text-blue-500 border border-blue-500 border-2 m-2" ref={newIng} placeholder="ingredient name"></input>
                <input class="rounded text-blue-500 border border-blue-500 border-2 m-2" list="ingrUOM" ref={newUOM} placeholder="ingredient unit of measure"></input>
                <datalist id="ingrUOM">
                    {optionsUOM.length > 0 ? optionsUOM.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                    )) : (<option>none</option>)}
                </datalist>
                <button class="bg-blue-500 px-2 rounded text-white m-2" type="button" onClick={(e)=> addNewIngredient(e)}>ADD</button><br></br>

                {addRecIng.map(e => (
                    <button class="border text-blue-500 border-blue-500 rounded-2xl p-1" key={e.id}>
                        {e.name} ({e.amount} {e.unitOfMeassure})<span onClick={() => removeIngredient(e.id)}>❌</span>
                    </button>
                ))}
                <br></br>
                <button class="bg-blue-500 px-2 rounded text-white m-2" type="submit">Submit</button>
            </form>
        </div>
    );
}

// Render it!
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <div className="min-h-screen bg-[url('/images/background/bg.jpg')] bg-cover bg-center">
        <SearchBox />
    </div>
);
