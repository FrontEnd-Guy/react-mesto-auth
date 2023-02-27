function ImagePopup({card, onOverlay, onClose}) {
    return (
        <div className={`popup popup_action_view-photo ${card ? 'popup_opened' : ''}`} onClick={onOverlay}>
            <figure className="popup__figure">
                <img className="popup__image" src={card?.link} alt={card?.name}/>
                <figcaption className="popup__figcaption">{card?.name}</figcaption>
                <button aria-label='Close' type="button" className="popup__close" onClick={onClose}></button>
            </figure>
        </div>
    )
}

export default ImagePopup