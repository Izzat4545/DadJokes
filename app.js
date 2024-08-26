const https = require("node:https");
const fs = require("fs");

const BASE_URL = "https://icanhazdadjoke.com";

const options = {
  headers: {
    Accept: "application/json",
  },
};

function saveRandomJoke(jokes) {
  const randomJoke = jokes[Math.floor(Math.random() * jokes.length)];
  console.log(`Here's a random joke: ${randomJoke.joke}`);

  let jokesData = [];

  // Check if jokes.json exists
  if (fs.existsSync("jokes.json")) {
    const jsonData = fs.readFileSync("jokes.json", "utf-8");
    jokesData = JSON.parse(jsonData);
  }

  // Check if the joke already exists
  const existingJoke = jokesData.find((j) => j.id === randomJoke.id);
  if (existingJoke) {
    existingJoke.popularity += 1; // Increment popularity
  } else {
    // Add the new joke with popularity set to 1
    randomJoke.popularity = 1;
    jokesData.push(randomJoke);
  }

  // Save updated jokes to jokes.json
  fs.writeFileSync("jokes.json", JSON.stringify(jokesData, null, 2), "utf-8");
  console.log("Joke saved to jokes.json");
}

function getLeaderBoard() {
  if (fs.existsSync("jokes.json")) {
    const jsonData = fs.readFileSync("jokes.json", "utf-8");
    const jokesData = JSON.parse(jsonData);

    // Sort jokes by popularity
    jokesData.sort((a, b) => b.popularity - a.popularity);

    console.log("Leaderboard (Most Popular Jokes):");
    jokesData.forEach((joke) => {
      console.log(`Joke: "${joke.joke}" - Popularity: ${joke.popularity}`);
    });
  } else {
    console.log("No jokes found in jokes.json");
  }
}

function searchJoke(search) {
  let data = "";
  https
    .get(
      `${BASE_URL}/search?term=${encodeURIComponent(search)}`,
      options,
      (res) => {
        if (res.statusCode !== 200) {
          console.error(`Request Failed. Status Code: ${res.statusCode}`);
          return;
        }

        res.on("data", (chunk) => {
          data += chunk;
        });
        res.on("end", () => {
          try {
            const jokesData = JSON.parse(data);
            if (jokesData.results.length > 0) {
              const jokes = jokesData.results;
              saveRandomJoke(jokes);
            } else {
              console.log(`No jokes found for the search term: "${search}"`);
            }
          } catch (e) {
            console.error("Error parsing JSON:", e);
          }
        });
      }
    )
    .on("error", (e) => {
      console.error(e);
    });
}

const args = process.argv.slice(2);

if (args[0] === "--leaderboard") {
  return getLeaderBoard();
}
if (args[0] === "--searchTerm" && args[1]) {
  return searchJoke(args[1]);
} else {
  console.log("Available options:");
  console.log("  --searchTerm <term>  Search for the specified term.");
  console.log("  --leaderboard        Display the leaderboard.");
}
