import { useEffect, useState } from "react";
import axios from "axios";
import Joke from "./Joke";
import "./JokeList.css";

/** List of jokes. */
const JokeList = ({numJokesToGet = 5}) => {
  const [jokesList,setJokesList] = useState([]);
  const [isLoading,setIsLoading] = useState(true);

  /* retrieve jokes from API */
  const getJokes = async () => {
    try {
      // load jokes one at a time, adding not-yet-seen jokes
      let jokes = [];
      let seenJokes = new Set();

      while (jokes.length < numJokesToGet) {
        let res = await axios.get("https://icanhazdadjoke.com", {
          headers: { Accept: "application/json" }
        });
        let { ...joke } = res.data;

        if (!seenJokes.has(joke.id)) {
          seenJokes.add(joke.id);
          jokes.push({ ...joke, votes: 0 });
        } else {
          console.log("duplicate found!");
        }
      }
      setJokesList(j=>jokes);
      setIsLoading(bool=>false);

    } catch (err) {
      console.error(err);
    }
  }

  /* empty joke list, set to loading state, and then call getJokes */
  const generateNewJokes = () => {
    setJokesList(j=>[]);
    getJokes();
  }

  /* change vote for this id by delta (+1 or -1) */
  const vote = (id, delta) => {
    setJokesList(jokes=> jokes.map(j => j.id === id ? { ...j, votes: j.votes + delta } : j ));
    setJokesList(jokes=> [...jokes].sort((a, b) => b.votes - a.votes));
  }

  /* at mount, get jokes */
  useEffect(()=>{
    getJokes();
  },[])

  /* render: either loading spinner or list of sorted jokes. */
  return (
    <>
      {
        isLoading ?
            <div className="loading">
              <i className="fas fa-4x fa-spinner fa-spin" />
            </div>:
            <div className="JokeList">
              <button className="JokeList-getmore" onClick={generateNewJokes}> Get New Jokes </button>
              {jokesList.map(j => (
                <Joke
                  text={j.joke}
                  key={j.id}
                  id={j.id}
                  votes={j.votes}
                  vote={vote}
                />
              ))}
            </div>
      }
    </>
  )
}


export default JokeList;
