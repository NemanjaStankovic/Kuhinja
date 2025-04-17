const { createStore } = Redux;
const { Provider, connect } = ReactRedux;


const UPDATE = 'UPDATE';
const CLEAR = 'CLEAR';
const EVAL = 'EVAL';

const updateExp = (sign) => ({ type: UPDATE, sign });
const clrNum = () => ({ type: CLEAR });
const evalNum = () => ({ type: EVAL });

const calculatorReducer = (state = { expression: "0", lastSign: "" }, action) => {
    switch (action.type) {
        case UPDATE: {
            if (state.expression === "0" && state.expression.length === 1 && !isNaN(action.sign)) {
                return { expression: action.sign, lastSign: action.sign };
            }
            if (regex.test(action.sign)) {
                if (state.lastSign === "." && action.sign === ".") {
                    return { expression: state.expression, lastSign: state.lastSign };
                } else {
                    return { expression: state.expression + action.sign, lastSign: action.sign };
                }
            }
            return { expression: state.expression + action.sign, lastSign: action.sign };
        }

        case EVAL: {
            let cleaned = state.expression.replace(/[\+\-\*\/]{2,}/g, match =>
                match.at(-1) === '-' ? match.at(-2) + '-' : match.at(-1)
            );
            const result = eval(cleaned).toString();
            return { expression: result, lastSign: "" };
        }

        case CLEAR: {
            return { expression: "0", lastSign: "" };
        }

        default:
            return state;
    }
};

const store = createStore(calculatorReducer);

// React components
class Presentational extends React.Component {
    render() {
        return (
            <div>
                
            </div>
        );
    }
}

class SearchBox extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            options: [],
        }
    }
    componentDidMount() {
        fetch('https://localhost:7003/Recipe/preuzmiKategorije')
            .then(response => response.json())
            .then(data => {
                const formatted = data.map(item => ({
                    value: item.id,
                    label:item.name
                }))
                this.setState({options: formatted})
            })
            .catch(error => {
                console.error('Error fetching data:', error)
        })
    }
    render() {
        return (
            <div>
                <Select options={this.state.options}
                    isMulti
                    placeholder="Categories..."
                />
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    expression: state.expression,
    lastSign: state.lastSign
});

const mapDispatchToProps = (dispatch) => ({
    updateExpression: (sign) => dispatch(updateExp(sign)),
    clearExpression: () => dispatch(clrNum()),
    evaluateExpression: () => dispatch(evalNum())
});

const ConnectedPresentational = connect(mapStateToProps, mapDispatchToProps)(Presentational);
const ConnectedButtons = connect(null, mapDispatchToProps)(Buttons);

// Render app
ReactDOM.render(
    <Provider store={store}>
        <ConnectedPresentational />
    </Provider>,
    document.getElementById("root")
);