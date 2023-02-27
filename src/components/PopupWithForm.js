export function PopupWithForm({name, title, isOpen, onOverlay, onClose, onSubmit, children, buttonText}) {
    return(
        <div className={`popup popup_action_${name} ${isOpen ? 'popup_opened' : ''}`} onClick={onOverlay}>
            <div className="popup__container">
            <button aria-label='Close' type="button" className="popup__close" onClick={onClose}></button>
            <h2 className="popup__title">{title}</h2>
            <form className="popup__form" name={name} onSubmit={onSubmit}>
                {children}
                <button type='submit' className="popup__save-button">{buttonText}</button>
            </form>
            </div>
        </div>
    )
}