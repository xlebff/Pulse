import { useEffect } from 'react';

export default function Modal({ isOpen, title, onClose, children, footer }) {
    useEffect(() => {
        if (!isOpen) return undefined;

        function handleKeyDown(event) {
            if (event.key === 'Escape') onClose();
        }

        document.addEventListener('keydown', handleKeyDown);
        document.body.style.overflow = 'hidden';

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = '';
        }
        }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="modal" onClick={onClose}>
            <div className="modal__window" onClick={(event) => event.stopPropagation()}>
                <div className="modal__head">
                    <h3 className="modal__title">{title}</h3>
                    <button className="modal__close" onClick={onClose} aria-label="Закрыть">
                    ✕
                    </button>
                </div>
            <div className="modal__body">{children}</div>
            {footer && <div className="modal__footer">{footer}</div>}
        </div>
    </div>
    );
}