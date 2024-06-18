const Alert = (props) => 
                (
                    <div className={`alert-body ${props.className}`}>
                        {props.children}
                    </div>
                );



ReactDOM.render(<Alert className="alert-dark" >
    <h2>This is the heading</h2>
    <p>Testing sentence lorem asldfk askdjfk asd</p>
</Alert>,
document.getElementById("root"));