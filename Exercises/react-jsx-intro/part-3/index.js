/* 
Create a component called *Person*. Inside of this component, render a *p* tag which displays “Learn some information about this person”. 
Each person should have name and age properties.

If the person is over 18 years old, display an additional *h3* that says “please go vote!”. 
Otherwise, display an *h3* that says “you must be 18”. 

If the person’s name is longer than 8 characters, only display the first six characters of their name.

Add a property called hobbies to your *Person* component that accepts an array of hobbies (an array of strings). 
Your Person component should list each one of these hobbies as an *li*.

Add an *App* component that renders at least three copies of the *Person* component on the page.

*/

const Person = ({name,age,hobbies}) => (
    <div>
        <p>Learn some information about this person</p>
        <p>Name: {name.length <= 8 ? name : name.slice(0,6)}</p>

        {age > 18 ? <h3>Please go vote!</h3>:
                    <h3>You must be 18.</h3>}        

        <h2>Hobbies</h2>
        <ul>
            {hobbies.map(hobby => <li>{hobby}</li>)}
        </ul>
    </div>
)

// App
// renders a *div* with props.children inside it.
const App = (props) => (<div>{props.children}</div>);

ReactDOM.render(<App>
    <Person name="Joe Smith" age={18} hobbies={["Basketball","Video Games","Hiking"]} />
    <Person name="Roger Johnson" age={48} hobbies={["Golf","Swimming"]} />
    <Person name="Angelina" age={30} hobbies={["Running","Tennis"]} />
</App>,
document.getElementById("root"));
