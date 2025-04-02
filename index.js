const fetchData = async(searchTerm) => {
    const response = await axios.get("http://omdbapi.com", {
        params: {
            apikey:"ec8f83a2",
            s: searchTerm
        }
    })

    if(response.data.Error){
        return []
    }

    console.log(response.data.Search)
    return response.data.Search
}

fetchData()

createAutoComplete({
    ...autoCompleteConfig,
    root: document.querySelector('#left-autocomplete'),
    onOptionSelect (movie){
        document.querySelector('.tutorial').classList.add('is-hidden')
        onMovieSelect(movie, document.querySelector('#left-summery'),left)
    }
})

createAutoComplete({
    ...autoCompleteConfig,
    root: document.querySelector('#right-autocomplete'),
    onOptionSelect (movie){
        document.querySelector('.tutorial').classList.add('is-hidden')
        onMovieSelect(movie, document.querySelector('#right-summery'), right)
    }
})

//Crear variables para leftmovie y rightmovie
let leftMovie
let rightMovie

const onMovieSelect = async (movie, summaryElement, side) => {
    const response = await axios.get("http://omdbapi.com", {
        params: {
            apikey:"ec8f83a2",
            i: movie.imdbID
        }
    })
    console.log(response.data)
    summaryElement.innerHTML = movieTemplate(response.data)
    //Preguntamos cual lado es
    if (side === 'left'){
        leftMovie = response.data
    } else {
        rightMovie = response.data
    }

    //preguntamos si tenemos ambos lados
    if(leftMovie && rightMovie){
        //entonces ejecutamos la funcion de comparacion
        runComparison()
    }
}

const runComparison = () => {
    console.lof('Comparacion de Peliculas')
    const leftSideStats = document.querySelectorAll('#left-sumary .notification')
    const rightSideStats = document.querySelectorAll('#right-sumary .notification')
}

leftSideStats.foreach((leftStat, index) =>{
    const rightSideStat = rightSideStats[index]
    const leftSideValue = parseInt(leftStat.dataset.value)
    const rightSideValue = parseInt(rightStat.dataset.value)

    if(rightSideValue > leftSideValue){
        leftStat.classList.remove('is-primary')
        leftStat.classList.remove('is-danger')
    } else {
        rightStat.classList.remove('is-primary')
        rightStat.classList.remove('is-danger')
    }
})

const movieTemplate = (movieDetails) => {
    // Trasnsmormar los numeros a string
    const dollars = parseInt(movieDetails.BoxOffice.replace(/\$/g,'').replace(/\$/g,''))}
    
    console.log(dollars)
    const metascore = parseInt(movieDetails.Metascore)
    const imdbRating = parseInt(movieDetails.imdbRating)
    const imdbVotes = parseInt(movieDetails.imdbVotes.replace(/,/g,''))
    console.log(metascore, imdbRating, imdbVotes)
    const awards= movieDetails.Awards.split('').reduce((prev, word) => {
        const value = parseInt(word)

        if (isNaN(value)){
            return prev
        } else {
            return prev + value
        }
    }, 0)
    console.log('Awards', awards)

    // agregar propiedad data-value a cada elemento del template
    return `
        <article class="media">
            <figure class="media-left">
                <p class="image">
                    <img src="${movieDetails.Poster}"/>
                </p>
            </figure>
            <div class="media-content">
                <div class="content">
                    <h1>${movieDetails.Title}</hi>
                    <h4>${movieDetails.Genre}</h4>
                    <p>${movieDetails.Plot}</p>
                </div>
            </div>
        </article>
        <article data-values=${awards} class="notification is-primary">
            <p class="title">${movieDetail.Awards}</p>
            <p>class="subtitle">Awards</p>
        </article>
        <article data-values=${dollars} class="notification is-primary">
            <p class="title">${movieDetail.BoxOffice}</p>
            <p>class="subtitle">Box Office</p>
        </article>
        <article data-values=${metascore} class="notification is-primary">
            <p class="title">${movieDetail.Metascore}</p>
            <p>class="subtitle">Metascore</p>
        </article>
        <article data-values=${imdbRating} class="notification is-primary">
            <p class="title">${movieDetail.imdbRating}</p>
            <p>class="subtitle">Rating</p>
        </article>
        <article data-values=${imdbVotes} class="notification is-primary">
            <p class="title">${movieDetail.imdbVotes}</p>
            <p>class="subtitle">Votes</p>
        </article>
    `


const root = document.querySelector(".autocomplete")
root.innerHTML = `
<label><b>Busqueda de peliculas</b></label>
<input class="input" />
<div class="dropdown">
<div class="dopdown-menu">
<div class="dropdown-content results"></div>
</div>
</div>
`
const input = document.querySelector("input")
const dropdown = document.querySelector(".dropdown")
const resultsWrapper = document.querySelector(".results")

const debonce = (func, delay = 1000) =>{
    let timeoutId
    return(...args) => {
        clearTimeout(timeoutId)
        timeoutId = setTimeout(() => {
            func.apply(null,args)
        }, delay)
    }
}

const onInput = async(event) =>{
const movies = await fetchData(event.target.value)
console.log("MOVIES:", movies)

if(!movies.legth){
    dropdown.classList.remove("is-active")
    return
}

resultsWrapper.innerHTML = ""
dropdown.classList.add("is-active")

for(let movie of movies){
    const option = document.createElement("a")
    const imgSrc = movie.Poster === "N/A" ? "": movie.Poster

    option.classList.add("dropdown-item")
    option.innerHTML = `
    <img src="${imgSrc}" />
    ${movies.Title}
    `
    option.addEventListener("click",() => {
        dropdown.classList.remover("is-active")
        input.value = movie.Title
        onMovieSelect(movie)
    })
    resultsWrapper.appendChild(option)
    }
} 

input.addEventListener('input', debonce(onInput, 100))

document.addEventListener('click', event => {
    if(root.contains(event.target)){
        dropdown.classList.remove('is-active')
    }
})