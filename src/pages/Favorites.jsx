import { useEffect, useState } from "react";
import MovieCard from "../components/MovieCard";

function Favorites() {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const storedFavorites = JSON.parse(localStorage.getItem("favorites") || "[]");
    setFavorites(storedFavorites);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-pink-50 px-6 md:px-14 py-14">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-pink-600 mb-14">
          My Favorite Movies
        </h1>

        {favorites.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[40vh]">
            <img
              src="https://cdn-icons-png.flaticon.com/128/6598/6598519.png"
              alt="Empty Favorites"
              className="mb-6 h-20 w-auto grayscale opacity-50"
            />
            <p className="text-gray-500 text-sm">You haven't added anything yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-10">
            {favorites.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Favorites;
