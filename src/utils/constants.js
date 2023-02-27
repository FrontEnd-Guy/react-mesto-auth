//Конфиг

// const validationConfig = {
//     formSelector: '.popup__form',
//     inputSelector: '.popup__input',
//     submitButtonSelector: '.popup__save-button',
//     inactiveButtonClass: 'popup__save-button_disabled',
//     inputErrorClass: 'popup__input_type_error',
//     errorClass: 'popup__input-error_visible'
// };

const apiConfig = {
  baseUrl: 'https://mesto.nomoreparties.co/v1/cohort-56',
  headers: {
    'authorization': '92d2b0f4-0f2d-4b0a-a7d7-4567fc3463f5',
    'Content-Type': 'application/json'
  },
}

export {apiConfig}