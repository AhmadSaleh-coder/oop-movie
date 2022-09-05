//the API documentation site https://developers.themoviedb.org/3/

class App {
    static async run() {
        const movies = await APIService.fetchMovies()
        HomePage.renderMovies(movies);
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
    }

    //fetching movie cast
    static async fetchActors(movie_id){
        const url = APIService._constructUrl(`movie/${movie_id}/credits`)
        const response = await fetch(url)
        const data = await response.json()
        // console.log(data)
        return data.cast
    }


}

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
}


class Movies {
    static async run(movie) {
        const movieData = await APIService.fetchMovie(movie.id)
        // console.log(movieData)
        MoviePage.renderMovieSection(movieData);
        // APIService.fetchActors(movieData.id)
        const movieCredits = await APIService.fetchActors(movieData.id)
        // console.log(movieCredits)
        MoviePage.renderMovieCast(movieCredits);
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
}

class MovieSection {
    static renderMovie(movie) {
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
      <h3>Actors:</h3>
    `;
    }
    static renderCast(movie) {
        console.log(movie)
        const div = document.createElement('div');


        let template=  `
        <div class='col-12'
        <h2>Cast</h2>
        <div class="cast-list">
        <ol class="people scroller">

        </ol>
        </div>
        </div>`


        div.innerHTML = template;
        MoviePage.container.appendChild(div);



    }

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




document.addEventListener("DOMContentLoaded", App.run);