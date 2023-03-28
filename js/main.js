function appendMovie(movie,container){
  container.insertAdjacentHTML(
    'beforeend',
    '<a href = "#!/movies/' + movie._id + '"><div class="movie"> \
<div class="title">' + movie.title + '</div> \
<img src="' + movie.posterURL + '" width="180" height="270" alt="' + movie.title + '" movie poster"/> \
<div class="rating">' + movie.rating + '%</div> \
</div></a>'
  );
}

function appendMovieTitle(movie,list){
  list.insertAdjacentHTML(
    'beforeend',
    '<li><a href = "#!/movies/' + movie._id + '">' + movie.title +
      '</a></li>'
  );
}

function renderCommon(){
  var recentlyAdded = document.querySelector('#recently-added ol');
  movies.sort(function(a,b){
    return new Date(b.dateAdded) - new Date(a.dateAdded);
  });
  for(var i = 0;i<movies.length;i++)
    appendMovieTitle(movies[i],recentlyAdded);
}

function findMovie(id){
  return movies.find(function(movie){return movie._id === id;});
}

function renderHome(){
  document.querySelector('main').innerHTML = '<section id="featured">' +
    '<h2>Featured</h2>' +
    '</section>' +
    '<section id="top-rated">' +
    '<h2>Top Rated</h2>' +
    '</section>';

  var featuredIDs = ['c81e728d9d4c2f636f067f89cc14862c',
                     'c4ca4238a0b923820dcc509a6f75849b',
                     'a87ff679a2f3e71d9181a67b7542122c']

  var featured = document.getElementById('featured');
  for(var i = 0;i<featuredIDs.length;i++)
    appendMovie(findMovie(featuredIDs[i]),featured);

  var topRated = document.getElementById('top-rated');
  movies.sort(function(a,b){
    return b.rating-a.rating;
  });
  for(var i = 0;i<movies.length;i++)
    appendMovie(movies[i],topRated);
}

function renderMovie(routeParameters){
  var movie = findMovie(routeParameters.id);
  document.querySelector('main').innerHTML =
    '<div class="movie-details">' +
    '<h2>' + movie.title + '</h2>' +
    '<div class ="trailer" >' +
    movie.trailer +
    '</div>' +
    '<div class="plot-summary" >' +
    '<h3>Plot Summary</h3>' +
    '<p>' + movie.summary +'</p>' + 
    '</div>' + 
    '<div class="credits" >' + 
    '<h3>Credits</h3>' + 
    '<div class="director">' + 
    'Director: <span class="name">' + movie.director + '</span>' + 
    '</div>' + 
    '<div class="cast-list">' + 
    'Cast: ' + 
    '<ul>' + 
    '</ul>' + 
    '</div>' + 
    '</div>' + 
    '</div>';
  var castList = document.querySelector('.cast-list ul');
  for(var i = 0 ; i < movie.cast.length; i++)
    castList.insertAdjacentHTML(
      'beforeend',
      '<li class="name">' + movie.cast[i] + '</li>'
    );
}

window.onload = function(){ 
  movies = JSON.parse(movies);
  renderCommon();

  var router = new RouteProvider();
  router.when('/',renderHome);
  router.when('/movies/:id/',renderMovie);
  router.start();
};
