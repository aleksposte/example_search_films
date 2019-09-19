const searchForm = document.querySelector("#search-form");
const movie = document.querySelector('#movies');
const urlPoster = 'https://image.tmdb.org/t/p/w500';
const key = '9ca5999a113d7dca92c8d8143186a699';

document.addEventListener('DOMContentLoaded', () => {
    const urlTrends = `https://api.themoviedb.org/3/trending/all/day?api_key=${key}&language=ru`;

    fetch(urlTrends)
        .then((value) => {
            if (value.status != 200) {
                return Promise.reject(new Error('Error'));
            }
            return value.json();
        })
        .then((output) => {
            let inner = '<h4 class="col-12 text-center text-info">популярные фильмы</h4>';

            if (output.results.length === 0) {
                inner = '<h2 class="col-12 text-center text-info">к сожалению ничего не найдено</h2>';
            }
            output.results.forEach((item, i) => {
                let nameItem = item.name || item.title;
                let mediaType = item.title ? 'movie' : 'tv';
                let poster = item.poster_path ? urlPoster + item.poster_path : './img/no_poster.jpg';
                let dataInfo = `data-id="${item.id}" data-type="${mediaType}"`;

                inner += `
                    <div class="col-12 col-md-4 col-xl-3 item">
                    <img src="${poster}"  alt="${nameItem}" ${dataInfo}>
                    <h5>${nameItem}</h5>
                    </div>
                    `;
            });

            movie.innerHTML = inner;
            addEventMedia();
        })
        .catch((reason) => {
            movie.innerHTML = 'oops... ';
        });
});

searchForm.addEventListener('submit', apiSearch);

function apiSearch(event) {
    event.preventDefault();

    const searchText = document.querySelector(".form-control").value;
    const urlSearch = `https://api.themoviedb.org/3/search/multi?api_key=${key}&language=ru&query=${searchText}`;

    if (searchText.trim().length === 0) {
        movie.innerHTML = '<h2 class="col-12 text-center text-danger">введите название фильма</h2>';
        return;
    }
    
    movie.innerHTML = '<div class="spinner"></div>';

    fetch(urlSearch)
        .then((value) => {
            if (value.status != 200) {
                return Promise.reject(new Error('Error'));
            }
            return value.json();
        })
        .then((output) => {
            let inner = '';

            if (output.results.length === 0) {
                inner = '<h2 class="col-12 text-center text-info">к сожалению ничего не найдено</h2>';
            }
            output.results.forEach((item, i) => {
                let nameItem = item.name || item.title;
                let poster = item.poster_path ? urlPoster + item.poster_path : './img/no_poster.jpg';
                let dataInfo = '';
                if (item.media_type !== 'person') dataInfo = `data-id="${item.id}" data-type="${item.media_type}"`;
                inner += `
                    <div class="col-12 col-md-4 col-xl-3 item">
                    <img src="${poster}"  alt="${nameItem}" ${dataInfo}>
                    <h5>${nameItem}</h5>
                    </div>
                    `;
            });

            movie.innerHTML = inner;
            addEventMedia();
        })
        .catch((reason) => {
            movie.innerHTML = 'oops... ';
        });
}

function addEventMedia() {
    const media = movie.querySelectorAll('img[data-id]');
    
    media.forEach((elem) => {
        elem.style.cursor = "pointer";
        elem.addEventListener('click', showFullInfo)
    });
}

function showFullInfo() {
    let urlInfo = '';
    const typeMedia = this.dataset.type;
    const idMedia = this.dataset.id;

    if (this.dataset.type === 'movie') {
        urlInfo = `https://api.themoviedb.org/3/movie/${idMedia}?api_key=${key}&language=ru`;
    } else if (this.dataset.type === 'tv') {
        urlInfo = `https://api.themoviedb.org/3/tv/${idMedia}?api_key=${key}&language=ru`;
    } else {
        movie.innerHTML = '<h2 class="col-12 text-center text-info">произошла ошибка, повторите запрос позже</h2>';
    }

    fetch(urlInfo)
        .then((value) => {
            if (value.status != 200) {
                return Promise.reject(new Error('Error'));
            }
            return value.json();
        })
        .then((output) => {
            movie.innerHTML = `
                <h4 class="col-12 text-center text-info">${output.name || output.title}</h4>
                <div class="col-4">
                    <img src="${urlPoster + output.poster_path}" alt="${output.name || output.title}">
                    ${ (output.homepage) ? `<p class="text-center"><a href="${output.homepage}" target="_blank">официальная страница</a></p>` : '' }
                    ${ (output.imdb_id) ? `<p class="text-center"><a href="https://imdb.com/title/${output.imdb_id}" target="_blank">страница на IMDB</a></p>` : '' }
                </div>
                <div class="col-8">
                    <p class="text-left"><span class="text-info">популятность:</span> ${output.vote_average}</p>
                    <p class="text-left"><span class="text-info">премьера:</span> ${output.firts_air_date || output.release_date}</p>

                    <p><span class="text-info">описание:</span> ${output.overview}</p>
                    <br>
                    <div class="youtube"></div>
                </div>
                `;
            
            getVideo(typeMedia, idMedia);    
        })
        .catch((reason) => {
            movie.innerHTML = 'oops... ';
        });
        
}

function getVideo(typeMedia, idMedia) {
    let youtube = movie.querySelector(".youtube");
    let videoFrame = '<h5 class="col-12 text-center text-info">трейлеры</h5>';
    const urlTrailers = `https://api.themoviedb.org/3/${typeMedia}/${idMedia}/videos?api_key=${key}&language=ru`;

    fetch(urlTrailers)
        .then((value) => {
            if (value.status != 200) {
                return Promise.reject(new Error('Error'));
            }
            return value.json();
        })
        .then((output) => {
            if (output.results.length === 0) {
                videoFrame = '<p>к сожалению трейлеры не найдены</p>';
            }
            output.results.forEach((item) => {
                videoFrame += `<iframe class="col-12" width="500" height="315" src="https://www.youtube.com/embed/${item.key}" frameborder="0" allow="accelerometer; autoplay; encrypted - media; gyroscope; picture -in -picture" allowfullscreen></iframe>`;
            });

            youtube.innerHTML = videoFrame;
        })
        .catch((reason) => {
            youtube.innerHTML = 'видео не найдены';
            // console.error(reason || reason.status)
        });
}
