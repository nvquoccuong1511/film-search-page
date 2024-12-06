/* =================================All needed variables ==========================================
                        Web Programming I Fall 2024 - Assignment 4
                        Created by: Cuong Ngo
                        Student ID: 2238147  
 ==================================================================================================*/



// =================================All needed variables ==========================================

const warningMessage = document.getElementById("searchWarningMessage");
const searchInput = document.getElementById("filmName");
const resultContainer = document.getElementById("resultContainer");
const noResult = document.getElementById("no-result");
const showDetail = document.getElementById("showDetail");
const seasonContainer = document.getElementById("seasonContainer");
const espisodeContainer = document.getElementById("espisodesContainer");

// ==================================================================================================

showDetail.innerHTML = '';

searchInput.addEventListener('input', () => {
    warningMessage.style.display = 'none';
});
// fetchData function process the user input from the search bar in order to fetch the matching movies they are looking for
async function fetchData() {
    try {
        espisodeContainer.innerHTML=''; // clear the espisodesContainer block before any search is implemented
        resultContainer.innerHTML = ''; //reset the result to nothing before showing new result
        showDetail.innerHTML ='';
        let count = 0;
        const maxResult = 3; // max number of results from search
        const filmName = searchInput.value; // prompt search from the user in the search bar
        const minimumLetter =3;
        // Condition to prevent user from type too little character
        if (filmName.length <= minimumLetter && filmName.length >= 0) {
            warningMessage.style.display = 'block';
            return;
        }
        const response = await fetch(`https://api.tvmaze.com/search/shows?q=${filmName}`);
        if (!response.ok) 
        {
            throw new Error("Could not fetch resource");
        }
        const data = await response.json(); // keep in mind the return is an array of result
        // console.log(data);
        noResult.style.display = 'none';
        const resultBlock = document.createElement('h2')
        resultBlock.classList.add('result-heading');
        resultBlock.textContent=`Result for "${filmName}"`
        resultContainer.appendChild(resultBlock);

        data.forEach((item) => {
            // if img is exists and only retrieve 3 results
            if (item.show.image && count < maxResult) {
                
                count++;
                
                const filmContainer = document.createElement('div');
                filmContainer.className = 'film-container';
                
                const title = document.createElement('h3');
                title.textContent = item.show.name;
                const img = document.createElement('img');
                img.src = item.show.image.medium;
                img.alt = item.show.name;
                const avgRating = document.createElement('p');
                avgRating.className = "rating";
                avgRating.textContent = item.show.rating?.average ? `Rating: ${item.show.rating.average} ⭐️` : "Rating: N/A";
                
                filmContainer.appendChild(title);
                filmContainer.appendChild(img);
                filmContainer.appendChild(avgRating);

                resultContainer.appendChild(filmContainer);
                // add listener for film container when user click
                filmContainer.addEventListener('click', () => ShowDetail(item.show));
            }
        });
        
        
        if (data.length === 0) {
            noResult.textContent = `No results found for "${filmName}"`;
            noResult.style.display = 'block';
        }
        searchInput.value='';

    } catch (err) {
        console.log(err);
    }
}
// this function will fetch all the seasons of a show, it take the showId object as an argument 
async function fetchSeasons(showId) {
   console.log(showId);
    const response = await fetch(`https://api.tvmaze.com/shows/${showId}/seasons`);
    if (!response.ok){
        throw new Error("Could not fetch show seasons resource");
    }
    const season = await response.json();
    console.log(season)
    DisplayEspisodes(season)
}
// this ShowDetail function will take the selected show by the user to display the view of such show in more details
function ShowDetail(show) {
    console.log(`ShowId: ${show.id}`)
    showDetail.innerHTML = `
    <div class="content-details">
    <h2>${show.name}</h2>
    <div class="show-info">
    <img src="${show.image.medium}" alt="${show.name}">
    <p><strong>Language:</strong> ${show.language}</p>
    <p><strong>Genres:</strong> ${show.genres ? show.genres.join(', ') : "N/A"}</p>
    <p><strong>Rating:</strong> ${show.rating?.average ? `${show.rating.average} ⭐️` : "N/A"}</p>
    <p class="summary">${show.summary || "No summary available."}</p>
    <a href="${show.url}" target="_blank">View on TVMaze</a>
    </div>
    </div>
    `;
    fetchSeasons(show.id); 
}
// this function a list of season of a show to fetch the list of espisode available in each season
async function DisplayEspisodes(filmSeasons){
    espisodeContainer.innerHTML=''; // clear the espisodesContainer block before any search is implemented
    // for each show
    console.log(filmSeasons.length)
    if(filmSeasons.length!=0){
        let countSeason=1
        for (const season of filmSeasons) {
            try{
                const response = await fetch(`https://api.tvmaze.com/seasons/${season.id}/episodes`);
                if (!response.ok){
                    throw new Error("Could not fetch show espisodes resource");
                }
                const data = await response.json();// return all seasons
                const seasonSection = document.createElement('div');
                seasonSection.className = 'season-section'
                seasonSection.innerHTML=`<h4>Season ${countSeason++}</h4>`;
                // espisode list
                const espisodeList = document.createElement('div');
                espisodeList.className = 'episode-list';
                data.forEach(espisode => {
                    // console.log(espisode)
                    espisodeList.innerHTML +=
                    `
                    <img src="${espisode.image.medium}" alt="">
                    <p><a href="${espisode.url}" target="_blank">${espisode.name}</a><p>
                    `
                    // console.log(espisode.url)
                });
                seasonSection.appendChild(espisodeList);
                espisodeContainer.appendChild(seasonSection);
            }
            catch (err) {
                console.error(`Error fetching episodes for season ${season.number}:`, err);
            }
        };

    }
};