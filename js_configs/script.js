
let parent = document.querySelector('main');
let popup = document.querySelector('.popup');

async function fetchData(name){

    try{
        const arr = name.split(' '), params = arr.map((element, index) => index < arr.length - 1 ? `${element}+` : element);

        let data = await fetch(`https://api.themoviedb.org/3/search/movie?query=${params.join('')}&api_key=${api_key.key}`)

        if (!data.ok){
            throw new Error(`Fetching response isn't okay status ${data.status}`)
        }

        return await data.json();
    }

    catch(err){
        console.error(`fetching error status : ${err}`)
        return [null, name];
    }
}

async function fetchTrailer(id){
    const options = {
        method: 'GET',
        headers: {
          accept: 'application/json',
          Authorization: `Bearer ${api_key.token}`
        }
    };

    try{
        let response = await fetch(`https://api.themoviedb.org/3/movie/${id}/videos?language=en-US`, options)
        
        if (!response.ok){
            return [null, response.status];
        }
        
        return await response.json();
    }

    catch(err){
        return [null, err];
    }
    
}


async function display(name){
    try{

        let jsonData = await fetchData(name);
        let genres = await fetch("js_configs/genres_ids.json")

        let idKeys = await genres.json()

        if(jsonData[0] === null){
            let error = document.createElement('h1')

            error.innerText = `Couldn't find any resaults with the name ${jsonData[1]}`

            parent.appendChild(error)
            return;
        }

    
        else{
            if(jsonData.results.length === 0){
                let error = document.createElement('h1')
    
                error.innerText = `Couldn't find any resaults with the name ${name}`
    
                parent.appendChild(error)
                return;
            }

            else{
                console.log(jsonData.results)
            
            jsonData.results.forEach(element => {

                const container = document.createElement('div'),
                    textContainer = document.createElement('div'), 
                        houseAllThatShit = document.createElement('div'),
                            headerContainer = document.createElement('div'),
                                genresContainer = document.createElement('div')


                let cover = document.createElement('img'),
                    title = document.createElement("h1"), 
                        description = document.createElement('p'), 
                            ogtitle = document.createElement('h3'),
                                release_date = document.createElement('h6')


                container.classList.add('outercontainer')
                    textContainer.classList.add('innerContainer')
                        houseAllThatShit.classList.add('houseAllThatShit')
                            genresContainer.classList.add("genresContainer") 


                if(element.poster_path){
                    cover.src = `https://image.tmdb.org/t/p/w185/${element.poster_path}`
                }   else{
                    cover.src = 'assets/placeHolderPoster.jpg'
                }


                title.innerText = element.title
                    ogtitle.innerText = `Original title: ${element.original_title}`
                        description.innerText = element.overview
                            release_date.innerText = element.release_date


                element.genre_ids.forEach(ids =>{
                    let genre = document.createElement('p')
                    
                    genre.innerText = idKeys[ids]

                    genresContainer.appendChild(genre)
                });


                container.appendChild(cover)
                    headerContainer.appendChild(title)
                        textContainer.appendChild(headerContainer)
                            textContainer.appendChild(ogtitle)
                                textContainer.appendChild(release_date)
                                    textContainer.appendChild(description)
                                        textContainer.appendChild(genresContainer)
                                        

                houseAllThatShit.appendChild(container)
                    houseAllThatShit.appendChild(textContainer)

                parent.appendChild(houseAllThatShit)

                houseAllThatShit.addEventListener('click', async ()=>{

                    popup.innerHTML = ''

                    let trailerData = await fetchTrailer(element.id);

                    let trailerContainer = document.createElement('div');
                    trailerContainer.classList.add('trailer-container');

                    if (trailerData[0] === null){
                        let errMsg = document.createElement('p')
                        errMsg.innerText = `There was an error fetching the trailer status : ${trailerData[1]}`
                        return;
                    }
                    
                    else{

                        trailerData.results.forEach(element => {
                            if(element.type === "Trailer"){
                                let video = document.createElement('iframe')
                                video.src = `https://www.youtube.com/embed/${element.key}`;
                                video.setAttribute('allowfullscreen', true);
                                trailerContainer.appendChild(video)
                            }
                        });
                    }

                    if (trailerContainer.innerHTML === ''){
                        let msg = document.createElement('h1')
                        msg.innerText = `Couldn't find trailers`

                        trailerContainer.appendChild(msg)
                    }

                    let exit = document.createElement('div'),
                        wrapper = document.createElement('div'),
                            exButton = document.createElement('button'),
                                videoheader = document.createElement('div'),
                                    videoContainer = document.createElement('div'),
                                        headerWithin = document.createElement('h1')
                    
                    wrapper.classList.add('wrapper')
                        headerContainer.classList.add('headerContainer')
                            exit.classList.add('exit')
                                exButton.innerText = '❌'
                                    headerWithin.innerText = 'Trailers'
                    
                    exit.appendChild(exButton)
                        popup.appendChild(exit)
                            popup.appendChild(headerContainer)
                                wrapper.appendChild(container)
                                    wrapper.appendChild(textContainer)
                                        popup.appendChild(wrapper)
                                            videoheader.appendChild(headerWithin)
                                                videoContainer.appendChild(videoheader)
                                                    videoContainer.appendChild(trailerContainer)
                                                        popup.appendChild(videoContainer)

                    popup.style.visibility = 'visible'
                    document.body.style.overflowY = "hidden"

                    exButton.addEventListener('click', ()=>{
                        document.body.style.overflowY = "visible"
                        popup.style.visibility = 'hidden'

                        container.appendChild(cover)
                            headerContainer.appendChild(title)
                                textContainer.appendChild(headerContainer)
                                    textContainer.appendChild(ogtitle)
                                        textContainer.appendChild(release_date)
                                            textContainer.appendChild(description)
                                                textContainer.appendChild(genresContainer)

                        houseAllThatShit.appendChild(container)
                            houseAllThatShit.appendChild(textContainer)
                    });
                });
            });

            }
            
        }
    } 
    
    catch(err){
        console.error(err)
    }
}

// Function to handle page-specific logic
function handlePageSpecificLogic() {
    if (window.location.pathname.includes('search.html')) {
        // On the search results page
        const params = new URLSearchParams(window.location.search);
        const query = params.get('query');

        if (query) {
            display(query);
        } else {
            console.warn('No query parameter found.');
        }
    } else {
        // On the search input page
        const inputField = document.getElementById('searchInput');
        const searchButton = document.getElementById('searchbtn');

        if (inputField && searchButton) {
            inputField.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    performSearch();
                }
            });

            searchButton.addEventListener('click', performSearch);
        }
    }
}

// Function to perform search and redirect
function performSearch() {
    const query = document.getElementById('searchInput').value.trim();

    if (query) {
        window.location.href = `search.html?query=${encodeURIComponent(query)}`;
    } else {
        console.warn('Search query is empty.');
        Swal.fire({
            title: "Error",
            text: "You Can't leave the search box empty",
            icon: "warning",
            customClass: {
                popup: 'popupclass'
            }
        });
    }
}

// Initialize page-specific logic
handlePageSpecificLogic();

function init(){
    let name = document.getElementById('innerSearchInput').value.trim();
    if (name){
        parent.innerHTML = ''
        display(name)
    }

    else{
        Swal.fire({
            title: "Error",
            text: "You Can't leave the search box empty",
            icon: "warning",
            customClass: {
                popup: 'popupclass'
            }
        });
        
    }
}

document.getElementById('innerSearchInput').addEventListener('keyup', (e)=>{
    if (e.key === 'Enter'){
        init()
    }
})

document.getElementById('innerSearchBtn').addEventListener('click', init)