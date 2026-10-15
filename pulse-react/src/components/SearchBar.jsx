export default function SearchBar({ value, onChange, placeholder = 'Поиск...' }) {
    return (
        <div className="search">
            <span className="search__icon">🔍</span>
            <input
                className="search__input"
                type="text"
                value={value}
                placeholder={placeholder}
                onChange={(event) => onChange(event.target.value)}
            />
            {value && (
                <button
                    className="search__clear"
                    onClick={() => onChange('')}
                    aria-label="Очистить поиск"
                    type="button"
                >
                    ✕
                </button>
            )}
        </div>
    );
}