import { Link } from "react-router-dom"; 
import { useState, useEffect } from "react"; 
import { FaHeart, FaRegHeart } from "react-icons/fa"; 
import toast from "react-hot-toast";

function MovieCard({ movie }) {
  const [hovered, setHovered] = useState(false);  // apakah kartu sedang di-hover
  const [showTooltip, setShowTooltip] = useState(false);  // menampilkan tooltip saat di-hover
  const [isFavorite, setIsFavorite] = useState(false); // menandai apakah film ini sudah jadi favorit

  useEffect(() => {
    const existingFavorites = JSON.parse(localStorage.getItem("favorites") || "[]");
    setIsFavorite(existingFavorites.some(item => item.id === movie.id));
  }, [movie.id]);

  // Fungsi untuk menambahkan atau menghapus film dari favorit
  const toggleFavorite = () => {
    const existingFavorites = JSON.parse(localStorage.getItem("favorites") || "[]");
    const isAlreadyFavorite = existingFavorites.some(item => item.id === movie.id);
  
    if (isAlreadyFavorite) {
      // Hapus dari favorit
      const updatedFavorites = existingFavorites.filter(item => item.id !== movie.id);
      localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
      setIsFavorite(false);
      toast.success(`${movie.title} removed from favorites.`);
  
      // Reload hanya jika di halaman Favorites
      if (window.location.pathname.includes("/favorites")) {
        window.location.reload(); // tanpa delay
      }
    } else {
      // Tambah ke favorit
      const updatedFavorites = [...existingFavorites, movie];
      localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
      setIsFavorite(true);
      toast.success(`${movie.title} added to favorites!`);
    }
  };  

  return (
    <Link to={`/movie/${movie.id}`}>
      <div
        className="bg-white hover:scale-105 duration-200 ease-in-out cursor-pointer rounded-2xl shadow-sm hover:shadow-md transition overflow-hidden text-center flex flex-col relative"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => {
          setHovered(false);
          setShowTooltip(false);
        }}
      >
        <div className="relative w-full h-[300px]"> {/* Menurunkan tinggi gambar */}
          <img
            src={movie.poster_path 
              ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` 
              : "https://via.placeholder.com/300x450?text=No+Image"}
            alt={movie.title}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />

          <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${hovered ? "bg-black bg-opacity-50 opacity-100" : "opacity-0"}`}>
            {hovered && (
              <div
                className="text-white cursor-pointer transition-transform duration-300 hover:scale-110"
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
                onClick={(e) => {
                  e.stopPropagation(); // Hindari trigger event Link
                  e.preventDefault(); // Hindari pindah halaman
                  toggleFavorite(); // Tambah/hapus favorit
                }}
              >
                {isFavorite 
                  ? <FaHeart className="w-8 h-8 text-red-500" /> // Mengurangi ukuran icon
                  : <FaRegHeart className="w-8 h-8 fill-white" />}
                {showTooltip && (
                  <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded shadow">
                    {isFavorite ? "Remove from favorites?" : "Add to favorites?"}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Informasi dasar film */}
        <div className="px-2 py-3 flex flex-col justify-between h-[120px]"> {/* Menurunkan tinggi card */}
          <div>
            <h2 className="text-sm font-semibold text-gray-800 line-clamp-2">{movie.title}</h2>
            <p className="text-xs text-gray-500">{movie.release_date?.split("-")[0]}</p>
          </div>
          
          <Link
            to={`/movie/${movie.id}`}
            className="inline-block text-xs px-3 py-1 bg-pink-600 text-white rounded-2xl hover:bg-pink-700 mt-2 transition-colors duration-200"
          >
            Detail
          </Link>
        </div>
      </div>
    </Link>
  );
}

export default MovieCard;
