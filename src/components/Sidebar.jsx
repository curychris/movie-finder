import { useEffect, useState } from 'react';
import axios from 'axios';

function Sidebar({ selectedCategory, setSelectedCategory, genres, selectedGenre, setSelectedGenre }) {
  return (
    <aside className="w-full md:w-52 p-4 bg-white shadow-md rounded-2xl h-fit md:sticky top-24">
      <h2 className="text-sm font-semibold mb-4 text-pink-600">Genres</h2>
      <ul className="space-y-2 max-h-[calc(100vh-200px)] overflow-y-auto hide-scrollbar pr-1">
        {/* Kategori Populer */}
        <li key="popular">
          <button
            onClick={() => {
              setSelectedGenre(null);
              setSelectedCategory('popular');
            }}
            className={`w-full text-left px-3 py-2 rounded-2xl text-sm ${
              selectedGenre === null && selectedCategory === 'popular'
                ? "bg-pink-600 text-white"
                : "hover:bg-pink-100"
            }`}
          >
            Populer
          </button>
        </li>

        {/* Daftar genre dari API */}
        {genres.map((genre) => (
          <li key={genre.id}>
            <button
              onClick={() => {
                setSelectedGenre(genre.id);
                setSelectedCategory(''); // kosongkan category agar tidak bentrok
              }}
              className={`w-full text-left px-3 py-2 rounded-2xl text-sm ${
                selectedGenre === genre.id
                  ? "bg-pink-600 text-white"
                  : "hover:bg-pink-100"
              }`}
            >
              {genre.name}
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}

export default Sidebar;
