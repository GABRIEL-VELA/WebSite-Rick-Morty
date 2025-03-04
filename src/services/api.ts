import { strict } from "assert";

export async function getCharacters(page: number, filters: any) {
    const params = new URLSearchParams();
    params.append("page", page.toString());

    // Agregar filtros solo si tienen valores
    Object.entries(filters).forEach(([key, value]) => {
        if (value && value.toString().trim().length > 1) {
            params.append(key, value.toString());
        }
    });

    const url = `https://rickandmortyapi.com/api/character?${params.toString()}`;

    const response = await fetch(url);

    if (!response.ok) {
        if (response.status === 404) {
            return { results: [], info: { pages: 1 } };
        }
        throw new Error(`Error del servidor: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Personajes Obtenidos : ', data);

    return data;
}