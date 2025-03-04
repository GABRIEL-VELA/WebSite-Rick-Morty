import { useEffect, useState } from "react";

interface SearchBarProps {
    onSearch: (query: string) => void;
}

export default function SearchBar({ onSearch }: SearchBarProps) {
    const [query, setQuery] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        console.log('value: ', value);
        setQuery(value);
        onSearch(value);
    };

    return (
        <div className="absolute top-4 right-4">
            <input
                type="text"
                placeholder="Buscar personaje..."
                value={query}
                onChange={handleChange}
                className="px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
        </div>
    );
}
