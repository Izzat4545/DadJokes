function getLiderBoard(){
    console.log("nice")
}
function searchJoke(search){
    console.log(search)
}

if(process.argv[2] && process.argv[2] === "--leaderboard"){
    return getLiderBoard()
}
if(process.argv[2] && process.argv[2] === '--searchTerm' && process.argv[3]){
    return searchJoke(process.argv[3])
}
else{
    console.log('Available options:');
    console.log('  --searchTerm <term>  Search for the specified term.');
    console.log('  --leaderboard        Display the leaderboard.');
}