export default function Loader({ text = 'Загрузка...' }) {
    return (
        <div className="loader">
            <div className="loader__ring" />
            <p className="loader__text">{text}</p>
        </div>
    );
}