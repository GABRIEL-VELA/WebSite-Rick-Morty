"use client"; // Asegura que se ejecute en el cliente

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

// Definir la estructura de un personaje
interface Character {
  id: number;
  name: string;
  status: string;
  species: string;
  gender: string;
  image: string;
  origin: {
    name: string;
    url: string;
  };
  location: {
    name: string;
    url: string;
  };
}

export default function CharacterDetail() {
  const { id } = useParams<{ id: string }>(); // Tipamos el parámetro ID como string
  const router = useRouter();
  const [character, setCharacter] = useState<Character | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (!id) return;

    // Si el usuario no vino desde la lista, redirigir a la página principal
    const visited = sessionStorage.getItem("visitedFromList");
    if (!visited) {
      router.push("/");
      return;
    }

    const fetchCharacter = async () => {
      try {
        const res = await fetch(`https://rickandmortyapi.com/api/character/${id}`);
        if (!res.ok) throw new Error("No se pudo cargar el personaje.");
        const data: Character = await res.json();
        setCharacter(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error desconocido");
      } finally {
        setLoading(false);
      }
    };

    fetchCharacter();
  }, [id, router]);

  if (loading) return <p>Cargando personaje...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!character) return <p>No se encontró el personaje.</p>;

  return (
    <div className="container mx-auto p-6 text-center">
      <h1 className="text-3xl font-bold">{character.name}</h1>
      <img src={character.image} alt={character.name} className="mx-auto rounded-lg shadow-lg" />
      <p><strong>Especie:</strong> {character.species}</p>
      <p><strong>Género:</strong> {character.gender}</p>
      <p><strong>Estado:</strong> {character.status}</p>
      <p><strong>Origen:</strong> {character.origin.name}</p>
      <p><strong>Ubicación actual:</strong> {character.location.name}</p>
    </div>
  );
}
