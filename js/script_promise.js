const searchForm = document.querySelector("#search-form");
const movie = document.querySelector('#movies');

searchForm.addEventListener('submit', apiSearch);

function apiSearch(event) {
    event.preventDefault();
    
    const searchText = document.querySelector(".form-control").value;
    const server =
      "https://api.themoviedb.org/3/search/multi?api_key=9ca5999a113d7dca92c8d8143186a699&language=ru&query=" +
      searchText;
    
    movie.innerHTML = 'Load';
    
    // https://api.themoviedb.org/3/search/multi?api_key=9ca5999a113d7dca92c8d8143186a699&language=ru
    // 9ca5999a113d7dca92c8d8143186a699
    requestApi('GET', server)
        .then(function (result) {

            const output = JSON.parse(result);
            let inner = '';

            output.results.forEach(function (item, i) {
                let nameItem = item.name || item.title;
                inner += `<div class="col-12 col-md-4 col-xl-3">${nameItem}</div>`;
            });

            movie.innerHTML = inner; 
        })
        .catch(function (reason) {
            movie.innerHTML = 'Oops... ';
        });
}

function requestApi(method, url) {

    return new Promise (function (resolve, reject) {
        const request = new XMLHttpRequest();
        request.open(method, url);

        request.addEventListener('load', function () {

            if (request.status != 200) {
                reject({
                    status: request.status
                });
                return;
            }

            resolve(request.response)
        });

        request.addEventListener('error', function () {
            
            reject({
                status: request.status
            });
        });

        request.send(); 
    });
}

// function requestApi(method, url) {
    
//     const request = new XMLHttpRequest();
//     request.open(method, url);
//     request.send();

//     request.addEventListener('readystatechange', () => {
        
//         if (request.readyState !== 4) {
//             movie.innerHTML = 'Load';
//             return;
//         };

//         if (request.status !== 200) {
//             movie.innerHTML = 'Oops... ';
//             console.log('error: ' + request.status);
//             return;
//         }    

//         const output = JSON.parse(request.responseText);
//         let inner = '';

        
//         output.results.forEach(function (item, i) {
//             let nameItem = item.name || item.title;
//             inner += `<div class="col-12 col-md-4 col-xl-3">${nameItem}</div>`;
//         });
 
//         movie.innerHTML = inner;
        
//     });
// }
 