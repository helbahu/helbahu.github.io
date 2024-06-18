// FirstComponent
// renders an *h1* with the text “My very first component”.

const FirstComponent = () => (<h1>My very first component</h1>);

// NamedComponent
// renders a *p* that should accept a property of “name” and display text “My name is *name*”.

const NamedComponent = (props) => (<p>My name is {props.name}</p>);


// App
// renders a *div* with instances of the other two components.

const App = (props) => (<div>{props.children}</div>);

ReactDOM.render(<App>
    <FirstComponent/>
    <NamedComponent name="Terrence" />
</App>,
document.getElementById("root"));