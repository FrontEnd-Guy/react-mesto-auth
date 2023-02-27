import signUpFail from '../images/signup-fail.svg';
import signUpSuccess from '../images/signup-success.svg';

export function InfoTooltip({isOpen, onOverlay, onClose, status}) {

    return (
        <div className={`popup ${isOpen ? "popup_opened" : ""}`} onClick={onOverlay}>
            <div className="popup__container popup_action_signup-status">
                <button
                    className="popup__close"
                    type="button"
                    aria-label="Close"
                    onClick={onClose}>    
                </button>
                <img src={status === 'error' ? signUpFail : signUpSuccess}/>
                <h2 className="popup__title popup__title_signup-status">{
                    status === 'error' 
                        ? 'Something went wrong! Try again.'
                        : 'You have successfully signed up!'
                    }
                </h2>
            </div>
        </div>
    );
  }