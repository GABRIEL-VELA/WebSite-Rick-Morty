"use client"; // Asegura que el código se ejecute solo en el cliente

import { useEffect, useState } from "react";
import { getCharacters } from "@/services/api";
import SearchBar from "@/components/SearchBar";
import Link from "next/link";


export default function Characters() {
    const [characters, setCharacters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [filters, setFilters] = useState({
        name: "",
        status: "",
        species: "",
        type: "",
        gender: ""
    });

    const errorMessages = [
        "¡Wubba Lubba Dub Dub! No se encontraron caracteres...",
        "Pero los discursos son para campañas. Ahora es tiempo de tomar acciones. No se encontraron caracteres...",
        "Deja de decirme que me relaje. ¿Alguna vez has tratado de relajarte? Es una paradoja. No se encontraron caracteres..."
    ];

    const [errorMessage, setErrorMessage] = useState("");

    const handleSearch = (query: string) => {
        setFilters((prevFilters) => {
            if (prevFilters.name === query) {
                return prevFilters;
            }
            
            return { ...prevFilters, name: query };
        });
    };

    useEffect(() => {

        const fetchCharacters = async () => {
            try {
                const data = await getCharacters(page, filters);
                setCharacters(data.results);
                setTotalPages(data.info.pages);

                if (data.results.length === 0) {
                    // Selecciona un mensaje aleatorio
                    const randomMessage = errorMessages[Math.floor(Math.random() * errorMessages.length)];
                    setErrorMessage(randomMessage);

                    // Espera a que el estado se actualice antes de abrir el modal
                    setTimeout(() => {
                        const modal = document.getElementById("no_results_modal") as HTMLDialogElement;
                        if (modal) {
                            modal.showModal();
                        } else {
                            console.error("❌ No se encontró el modal en el DOM.");
                        }
                    }, 0);
                }
            } catch (error: any) {
                setError("Error al cargar los personajes.");
            } finally {
                setLoading(false);
            }
        };

        if (filters.name.length >= 3 || filters.name === "") { 
            fetchCharacters();
        }
    }, [page, filters]);

    if (loading) return <p>Cargando personajes...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="container mx-auto p-4">
            <SearchBar onSearch={handleSearch} />

            <h1 className="text-3xl font-bold text-center">Personajes de Rick and Morty</h1>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
                {characters.map((character: any) => (
            
                   <Link key={character.id} href={`/${character.id}`} className="bg-white shadow-lg rounded-lg p-4 text-center cursor-pointer hover:shadow-xl transition duration-300" onClick={() => sessionStorage.setItem("visitedFromList", "true")}>
                        <img src={character.image} alt={character.name} className="w-full rounded-lg" />
                        <h2 className="text-lg font-semibold mt-2">{character.name}</h2>
                        <p className="text-gray-500">{character.species}</p>
                    </Link>
                ))}
         </div>
         
            <div className="flex justify-center items-center mt-6 gap-4">
                <button
                    className="btn bg-gray-200 px-4 py-2 rounded disabled:opacity-50"
                    disabled={page === 1}
                    onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                >
                    « Anterior
                </button>

                <span className="font-semibold text-lg">
                    Página {page} de {totalPages}
                </span>

                <button
                    className="btn bg-gray-200 px-4 py-2 rounded disabled:opacity-50"
                    disabled={page === totalPages}
                    onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                >
                    Siguiente »
                </button>
            </div>
            <dialog id="no_results_modal" className="modal">
                <div className="modal-box">
                    <h3 className="font-bold text-lg">¡Ups!</h3>
                    <p className="py-4">{errorMessage}</p>
                    <div className="modal-action">
                        <form method="dialog">
                            <button className="btn">Cerrar</button>
                        </form>
                    </div>
                </div>
            </dialog>
        </div>
    );
}
