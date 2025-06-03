import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { FaStar, FaStarHalfAlt, FaRegStar, FaHeart, FaRegHeart } from "react-icons/fa";
import toast from "react-hot-toast";

function MovieDetail() {
  const { id } = useParams(); // Mengambil ID film dari URL
  const [movie, setMovie] = useState(null); 
  const [cast, setCast] = useState([]); 
  const [director, setDirector] = useState("N/A"); 
  const [isFavorite, setIsFavorite] = useState(false); // Status apakah film sudah difavoritkan
  const apiKey = "6cda9e6c5cecf0aedb8200dc2b30388b"; // TMDb API key

  useEffect(() => {
    const fetchMovieData = async () => {
      try {
        const movieData = await fetchData(`https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}&language=en-US`);
        const creditsData = await fetchData(`https://api.themoviedb.org/3/movie/${id}/credits?api_key=${apiKey}&language=en-US`);
        
        setMovie(movieData);
        setDirector(creditsData.crew.find(person => person.job === "Director")?.name || "N/A");
        setCast(creditsData.cast.slice(0, 5)); // Ambil 5 pemeran teratas
      } catch (error) {
        console.error("Error fetching movie data:", error);
      }
    };

    fetchMovieData();
    checkFavorite(); // Cek apakah film ini ada di favorit
  }, [id]);

  // Fungsi ambil data dari URL menggunakan axios
  const fetchData = async (url) => {
    const { data } = await axios.get(url);
    return data;
  };

  // Menampilkan bintang berdasarkan rating (skala 10 → 5 bintang)
  const renderStars = (rating) => {
    const stars = Array.from({ length: 5 }, (_, index) => {
      if (index < Math.floor(rating / 2)) return <FaStar key={index} className="text-yellow-400" />;
      if (index === Math.floor(rating / 2) && rating % 2) return <FaStarHalfAlt key={index} className="text-yellow-400" />;
      return <FaRegStar key={index} className="text-gray-300" />;
    });
    return stars;
  };

  // Mengecek apakah film ini sudah ada di daftar favorit
  const checkFavorite = () => {
    const storedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
    setIsFavorite(storedFavorites.some(item => item.id === parseInt(id)));
  };

  // Fungsi tambah/hapus favorit
  const toggleFavorite = () => {
    const storedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
    const isAlreadyFavorite = storedFavorites.some(item => item.id === movie.id);
    const updatedFavorites = isAlreadyFavorite 
      ? storedFavorites.filter(item => item.id !== movie.id) 
      : [...storedFavorites, movie];

    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
    setIsFavorite(!isAlreadyFavorite);
    toast.success(`${movie.title} ${isAlreadyFavorite ? 'removed from' : 'added to'} favorites!`);
  };

  // Tampilkan pesan loading jika data belum tersedia
  if (!movie) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white">
        <div className="w-4 h-4 bg-pink-600 rounded-full animate-ping mb-4"></div>
        <p className="text-gray-500 text-lg animate-pulse">Please wait...</p>
      </div>
    );
  }  

  // Tampilan utama halaman detail
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-pink-50 py-10 px-4">
      <div className="max-w-5xl mx-auto bg-white shadow-md rounded-2xl overflow-hidden p-6">
        <div className="text-right mb-6">
          <Link to="/" className="inline-block text-pink-600 hover:text-pink-700 text-sm font-medium">
            ← Back to homepage
          </Link>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-1/3 relative hover:scale-105 duration-200 ease-in-out cursor-pointer">
            <img
              src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : "https://via.placeholder.com/300x450?text=No+Image"}
              alt={movie.title}
              className="rounded-2xl shadow-2xl w-full h-auto object-cover transition"
            />
            <button onClick={toggleFavorite} className="absolute top-3 right-3 bg-white rounded-full p-2 shadow-md hover:bg-pink-100 transition" title={isFavorite ? "Remove from Favorites" : "Add to Favorites"}>
              {isFavorite ? <FaHeart className="text-pink-500 " /> : <FaRegHeart className="text-gray-500" />}
            </button>
          </div>

          {/* Detail film */}
          <div className="flex-1 space-y-4">
            <h1 className="text-3xl font-bold text-gray-800">{movie.title}</h1>
            <p className="text-sm font-semibold text-gray-800">{movie.tagline}</p>
            <p className="text-sm text-gray-500 flex items-center gap-2">
              <span>{movie.runtime} mins</span>
              <span className="text-gray-400 mx-2">|</span>
              <span className="flex items-center gap-1">
                {renderStars(movie.vote_average)}
                <span className="ml-1 text-xs text-gray-500">{movie.vote_average.toFixed(1)} / 10</span>
              </span>
            </p>

            <div className="space-y-3 text-sm text-gray-700 pt-6 border-t border-gray-200">
              {renderMovieDetails(movie, director)}
              <div className="pt-4 border-t border-gray-200">
                <p className="text-justify">
                  <span className="font-semibold">Plot</span>: <span className="text-gray-600">{movie.overview}</span>
                </p>
              </div>
              <div className="pt-4 border-t border-gray-200">
                <p className="font-semibold mb-3">Top Cast:</p>
                <div className="flex flex-wrap gap-8">
                  {cast.length > 0 ? (
                    cast.map(actor => (
                      <div key={actor.id} className="relative group w-24 text-center">
                        <img
                          src={actor.profile_path ? `https://image.tmdb.org/t/p/w185${actor.profile_path}` : "https://via.placeholder.com/100x100?text=No+Image"}
                          alt={actor.name}
                          className="w-20 h-20 object-cover rounded-full mx-auto"
                        />
                        <div className="mt-2 font-semibold text-[11px] text-gray-800">{actor.name}</div>
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block bg-gray-700 text-white text-xs rounded px-2 py-1 z-10">
                          as {actor.character}
                          <div className="absolute left-1/2 transform -translate-x-1/2 top-full w-2 h-2 bg-gray-700 rotate-45"></div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <span>N/A</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>  
    </div>
  );
}

// info dasar film
const renderMovieDetails = (movie, director) => (
  <>
    <div className="flex">
      <span className="w-28 font-semibold">Genre</span>
      <span>: {movie.genres.map(g => g.name).join(", ")}</span>
    </div>
    <div className="flex">
      <span className="w-28 font-semibold">Released</span>
      <span>: {movie.release_date}</span>
    </div>
    <div className="flex">
      <span className="w-28 font-semibold">Director</span>
      <span>: {director}</span>
    </div>
    <div className="flex">
      <span className="w-28 font-semibold">Language</span>
      <span>: {movie.spoken_languages[0]?.name || "N/A"}</span>
    </div>
  </>
);

export default MovieDetail;
 
// 163