import { useEffect, useState } from 'react';
import axios from 'axios'; 
import MovieCard from '../components/MovieCard';
import Sidebar from '../components/Sidebar';

function Home() {
  const [movies, setMovies] = useState([]);
  // Inisialisasi query dari localStorage
  const [query, setQuery] = useState(() => localStorage.getItem('query') || '');
  const [selectedCategory, setSelectedCategory] = useState("popular");
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const API_KEY = '6cda9e6c5cecf0aedb8200dc2b30388b'; // TMDb API Key

  // Efek: jika query tidak kosong, lakukan fetch berdasarkan query,
  // dan simpan query ke localStorage
  useEffect(() => {
    if (query.trim()) {
      fetchMovies(query); 
    }
    localStorage.setItem('query', query);
  }, [query]);

  // Efek: Ambil genre dari TMDB saat pertama kali komponen dipasang
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const { data } = await axios.get(`https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}`);
        setGenres(data.genres);
      } catch (error) {
        console.error(error);
      }
    };

    fetchGenres();
  }, []);

  // Efek: Jika query kosong, ambil film default berdasarkan kategori atau genre
  useEffect(() => {
    if (!query.trim()) {
      fetchMovies();
    }
  }, [selectedCategory, selectedGenre]);

  // Fungsi fetchMovies; jika diberi parameter searchQuery, gunakan itu, jika tidak gunakan default kategori/genre
  const fetchMovies = async (searchQuery = '') => {
    let url = `https://api.themoviedb.org/3/movie/${selectedCategory}?api_key=${API_KEY}&page=1`;

    if (selectedGenre) {
      url = `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=${selectedGenre}&page=1`;
    }

    if (searchQuery.trim()) {
      url = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${searchQuery}&page=1`;
    }

    try {
      const { data } = await axios.get(url);
      setMovies(data.results || []); 
    } catch (error) {
      console.error(error);
    }
  };

  // Handle pencarian film
  const handleSearch = (e) => {
    e.preventDefault();
    setQuery(e.target.elements.search.value);
  };

  // Handle clear pencarian, yang juga memanggil fetchMovies default (popular)
  const handleClear = () => {
    setQuery('');
    setSelectedGenre(null);
    localStorage.removeItem('query');
    fetchMovies();
  };

  // Fungsi untuk scroll kembali ke atas
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-pink-50 px-10 py-16 flex gap-8">
      <Sidebar
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        genres={genres}
        selectedGenre={selectedGenre}
        setSelectedGenre={setSelectedGenre}
      />

      <div className="flex-1">
        <h1 className="text-4xl font-bold text-center text-pink-600 mb-10 tracking-tight">
          Find Your Fav Movies Here!
        </h1>

        <form onSubmit={handleSearch} className="flex justify-center mb-14 gap-3 flex-wrap">
          <input
            type="text"
            name="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search movies..."
            className="w-full max-w-md px-5 py-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-400 shadow-sm transition"
          />
          <button
            type="button"
            onClick={handleClear}
            className="bg-pink-600 text-white px-6 py-3 rounded-full hover:bg-pink-700 transition font-medium shadow-sm"
          >
            Clear
          </button>
        </form>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-10">
          {movies.length > 0 ? (
            // Tampilkan MovieCard jika hasil ditemukan
            movies.map((movie) => <MovieCard key={movie.id} movie={movie} />)
          ) : (
            query.trim() && (
              <p className="col-span-full text-center text-gray-500">
                Sorry, we couldn't find your favourite movies :(
              </p>
            )
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;
