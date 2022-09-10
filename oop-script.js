//the API documentation site https://developers.themoviedb.org/3/
class App {
    static async run() {
        const movies = await APIService.fetchMovies()
        HomePage.renderMovies(movies);

        document.getElementById("searchMovie").addEventListener("click", function (event) {
            event.preventDefault();
            const searchedValues = document.getElementById("searchedMovie").value;
            // console.log(searchedValues);
            Search.run(searchedValues);
        });
    }
}

//api key 9d89c6af3c3fafed4c909cb6c9cc7353
class APIService {
    static TMDB_BASE_URL = 'https://api.themoviedb.org/3';
    static async fetchMovies() {
        const url = APIService._constructUrl(`movie/now_playing`)
        const response = await fetch(url)
        const data = await response.json()
        return data.results.map(movie => new Movie(movie))
    }
    static async fetchMovie(movieId) {
        const url = APIService._constructUrl(`movie/${movieId}`)
        const response = await fetch(url)
        const data = await response.json()
        return new Movie(data)
    }
    static _constructUrl(path) {
        return `${this.TMDB_BASE_URL}/${path}?api_key=${atob('NTQyMDAzOTE4NzY5ZGY1MDA4M2ExM2M0MTViYmM2MDI=')}`;
        // api_key='542003918769df50083a13c415bbc602';
        ///https://api.themoviedb.org/3/movie/now_playing?api_key=542003918769df50083a13c415bbc602
    }

    static _constructUrlSeacrh(path, query) {
        return `${this.TMDB_BASE_URL}/${path}?api_key=${atob('NTQyMDAzOTE4NzY5ZGY1MDA4M2ExM2M0MTViYmM2MDI=')}${query}`;
        //https://api.themoviedb.org/3/search/movie?api_key=542003918769df50083a13c415bbc602&query=moviename
    }

    //fetching movie cast
    static async fetchActors(movie_id){
        const url = APIService._constructUrl(`movie/${movie_id}/credits`)
        const response = await fetch(url)
        const data = await response.json()
        return data.cast
    }

    //fetching movie trailer
    static async fetchTrailer(movie_id){
        const url = APIService._constructUrl(`movie/${movie_id}/videos`)
        const response = await fetch(url)
        const data = await response.json()
        return data
    }

    //fetching similar movies
    static async fetchSimilarMovies(movie_id){
        const url = APIService._constructUrl(`movie/${movie_id}/similar`)
        const response = await fetch(url)
        const data = await response.json()
        return data
    }

    //fetching searched movies
    static async fetchSearchedMovies(movieName) {
        const url = APIService._constructUrlSeacrh(`search/movie`, `&query=${movieName}`)
        const response = await fetch(url)
        const data = await response.json()
        console.log(data);
        return data.results.map(result => new Movie(result))

    }

}

const form =  document.getElementById('form');
const search = document.getElementById('search');

class HomePage {
    static container = document.querySelector('.row');
    static renderMovies(movies) {
        movies.forEach(movie => {
            const movieDiv = document.createElement("div");
            movieDiv.classList='col-lg-4 col-sm-12 col-md-6 d-flex flex-column align-items-center'
            const movieImage = document.createElement("img");
            movieImage.src = `${movie.backdropUrl}`;
            movieImage.classList='card-img-top'
            movieImage.style= "width:300px;"
            movieImage.style= "height:200px;"
            const movieTitle = document.createElement("h5");
            movieTitle.textContent = `${movie.title}`;
            movieImage.addEventListener("click", function() {
                Movies.run(movie);
            });

            movieDiv.appendChild(movieTitle);
            movieDiv.appendChild(movieImage);
            this.container.appendChild(movieDiv);
        })
    }

    static renderSearchedMovies(movies) {
        this.container.innerHTML = "";
        const movieRow = document.createElement("div");
        movieRow.className = "row flex";
        movieRow.setAttribute('id', 'movieRow')
        movies.forEach(movie => {

            const movieDiv = document.createElement("div");
            movieDiv.className = "searchResult-card col-md-2 col-sm-3 col-6";


            const movieImage = document.createElement("img");
            movieImage.src = `${movie.backdropUrl}`;
            movieImage.className = "img-fluid";
            const movieTitle = document.createElement("h4");
            movieTitle.textContent = `${movie.title}`;
            movieTitle.setAttribute('data-movie-id', movie.id)



            movieImage.addEventListener("click", function () {
                Movies.run(movie.id);
            });

            movieTitle.addEventListener("click", function () {
                Movies.run(movie.id);
            });


            movieDiv.appendChild(movieTitle);
            movieDiv.appendChild(movieImage);
            movieRow.appendChild(movieDiv);
            this.container.appendChild(movieRow);
        })

    }

}


class Movies {
    static async run(movie) {
        const movieData = await APIService.fetchMovie(movie.id)

        MoviePage.renderMovieSection(movieData);
        // APIService.fetchActors(movieData.id)
        const movieCredits = await APIService.fetchActors(movieData.id)

        MoviePage.renderMovieCast(movieCredits);

        const movieTrailer =await APIService.fetchTrailer(movieData.id)

        MoviePage.renderMovieTrailer(movieTrailer);

        const SimilarMovies =await APIService.fetchSimilarMovies(movieData.id)

        MoviePage.renderSimilarMovies(SimilarMovies);
    }

}

class MoviePage {
    static container = document.getElementById('container');
    static renderMovieSection(movie) {
        MovieSection.renderMovie(movie);
    }
    static renderMovieCast (movie){
        MovieSection.renderCast(movie);
    }
    static renderMovieTrailer(movie){
        MovieSection.renderTrailer(movie);

    }

    static renderSimilarMovies(movie){
        MovieSection.renderMovies(movie);
    }


}

class MovieSection {
    static renderMovie(movie) {
        console.log(movie);
        MoviePage.container.innerHTML = `
      <div class="row">
        <div class="col-md-4">
          <img id="movie-backdrop" src=${movie.backdropUrl}>
        </div>
        <div class="col-md-8">
          <h2 id="movie-title">${movie.title}</h2>
          <p id="genres">${movie.genres}</p>
          <p id="movie-release-date">${movie.releaseDate}</p>
          <p id="movie-runtime">${movie.runtime}</p>
          <h3>Overview:</h3>
          <p id="movie-overview">${movie.overview}</p>
        </div>
      </div>
      <h3>Movie Cast:</h3>
    `;
    }
    static renderCast(movie) {
        const actorDiv = document.createElement("div");
        actorDiv.classList='row gx-3 my-2'
        movie.forEach(movie => {

            const actorCard= document.createElement('div')
            actorCard.classList=' col-md-2 col-sm-4 col-6"'
            const actorImage = document.createElement("img");
            actorImage.src = `https://image.tmdb.org/t/p/original${movie.profile_path}`;
            actorImage.classList='img-fluid'
            const actorName = document.createElement("h6");
            actorName.textContent = `${movie.name}`;
            actorCard.appendChild(actorName);
            actorCard.appendChild(actorImage);
            actorDiv.appendChild(actorCard);
            MoviePage.container.appendChild(actorDiv);
        })

    }

    static renderTrailer(movie){

        movie.results.forEach(movie => {
            const videoDiv = document.createElement("div");
            videoDiv.classList="trailerDiv row align-items-center container-fluid ";
            const header= document.createElement('h3');
            header.innerHTML='Trailer';
            header.classList='text-center';
            const trailer=document.createElement('iframe');
            trailer.width='300';
            trailer.height='300';
            trailer.innerHTML=`${movie.id}`;
            trailer.src = `https://www.youtube.com/embed/${movie.key}`;
            videoDiv.appendChild(header);
            videoDiv.appendChild(trailer);
            MoviePage.container.appendChild(videoDiv);
        })
    }

    static renderMovies(movie){
        console.log(movie);
        const moviesDiv = document.createElement("div");
        moviesDiv.classList= 'column my-4';
        const title = document.createElement("h6");
        title.innerHTML = `Movies that you might like`;
        const movieImage= document.createElement('img')
        movieImage.src = `http://image.tmdb.org/t/p/w780/b5ug4LyLQFeR6azAJyIPBQz5ur9.jpg`;
        moviesDiv.appendChild(movieImage);
        moviesDiv.appendChild(title);
    }

    ///submit button


}


class Movie {
    static BACKDROP_BASE_URL = 'http://image.tmdb.org/t/p/w780';
    constructor(json) {
        this.id = json.id;
        this.title = json.title;
        this.releaseDate = json.release_date;
        this.runtime = json.runtime + " minutes";
        this.overview = json.overview;
        this.backdropPath = json.backdrop_path;
    }

    get backdropUrl() {
        return this.backdropPath ? Movie.BACKDROP_BASE_URL + this.backdropPath : "";
    }

}

class Search {
    static run(searchedValues) {
        // this.forPeople(searchedValues)
        this.forMovies(searchedValues)
    }

    static async forMovies(movie) {
        const movieData = await APIService.fetchSearchedMovies(movie)
        HomePage.renderSearchedMovies(movieData);
    }


}



document.addEventListener("DOMContentLoaded", App.run);