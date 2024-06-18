/*
    Style your *Tweet* component using a CSS class.
 */


// Tweet
// props: 
//          'username' of the user who wrote the tweet, 
//          'name' of the user who wrote the tweet, 
//          'date' of the tweet, 
//          'message' being tweeted.


const Tweet = ({username,name,message,date = new Date()}) => 
                (
                    <div className="tweet-body">
                        <h2>Tweet from {name} ({username}): </h2>
                        <p>{message}</p>
                        <small>{date instanceof Date ? date.toLocaleDateString('en-gb',
                                                        {year: 'numeric', month: 'long', day: 'numeric'}
                                                       ):
                                                       new Date(date).toLocaleDateString('en-gb',
                                                       {year: 'numeric', month: 'long', day: 'numeric'}
                                                      )}
                        </small>
                    </div>
                );


// App
// renders a *div* with props.children inside it.
const App = (props) => (<div>{props.children}</div>);

ReactDOM.render(<App>
    <Tweet name="Leon" username="leon123" message="This is my message." />
    <Tweet name="Kevin" username="kevDurant" message="This is another message." date="Jan 5,2020" />
    <Tweet name="Derrick" username="derrick44" message="Hello everyone, here is a message." date="03/12/2023" />
</App>,
document.getElementById("root"));