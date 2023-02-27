import {useState, useEffect, useCallback} from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import '../index.css';
import { api } from "../utils/API";
import Header from './Header';
import Main from './Main';
import Footer from './Footer';
import {Login} from './Login';
import {Register} from './Register';
import ImagePopup from './ImagePopup';
import { EditProfilePopup } from './EditProfilePopup';
import { EditAvatarPopup } from './EditAvatarPopup';
import { AddPlacePopup } from './AddPlacePopup';
import { PopupWithForm } from './PopupWithForm';
import {CurrentUserContext} from '../contexts/CurrentUserContext';
import ProtectedRouteElement from './ProtectedRoute';
import {checkAuth, signin, signup} from '../utils/auth';
import { InfoTooltip } from './InfoTooltip';

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [isEditProfilePopupOpen, setEditProfilePopupState] = useState(false);
  const [isAddPlacePopupOpen, setAddPlacePopupState] = useState(false);
  const [isEditAvatarPopupOpen, setEditAvatarPopupState] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [cards, setCards] = useState([])
  const [isLoading, setIsLoading] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [isInfoTooltipOpen, setInfoTooltipOpen] = useState(false);
  const [infoTooltipStatus, setInfoTooltipStatus] = useState(false);
  const [userEmail, setUserEmail] = useState('')

  const navigate = useNavigate();

  const handleSignup = useCallback(async (data) => {
    try { 
      await signup(data);
      setInfoTooltipOpen(true);
      setInfoTooltipStatus('success');
      navigate('/sign-in')
    } catch (err) {
      setInfoTooltipOpen(true);
      setInfoTooltipStatus('error')
    }
  },[navigate]);

  const handleSignin = useCallback(async (data) => {
    const {token} = await signin(data);
    localStorage.setItem('jwt', token);
    setLoggedIn(true);
    navigate('/');
  },[navigate])

  const handleSignout = () => {
    localStorage.removeItem('jwt');
    navigate('/sign-in', {replace: true})
  }

  useEffect (()=>{
    const jwt = localStorage.getItem('jwt');
    if (jwt) {
      checkAuth(jwt).then((data)=>{
        setLoggedIn(true);
        setUserEmail(data.data.email);
        navigate('/');
      })
    }
  }, [navigate])

  function handleInfoTooltipClose() {
    setInfoTooltipOpen(false);
    setInfoTooltipStatus('');
    closeAllPopups();
  }

  useEffect(()=>{
    if (loggedIn) {
      api.getUserInfo()
      .then((data) => setCurrentUser(data))
      .catch((err) => console.log(err))
    }
  }, [loggedIn]);

  useEffect(()=>{
    if (loggedIn) {
      api.getCardsList()
      .then((cards) => setCards(cards))
      .catch((err) => console.log(err))
    }
  }, [loggedIn]);  

  function handleCardLike(card) {
    const isLiked = card.likes.some(i => i._id === currentUser._id);
    api.changeLikeCardStatus(card._id, !isLiked)
        .then((newCard) => {
          setCards((state) => state.map((c) => c._id === card._id ? newCard : c));
        })
        .catch((err) => console.log(err))
  }

  function handleCardClick(card) {
    setSelectedCard(card)
  }

  function handleCardDelete(card) {
    api.deleteCard(card._id)    
        .then(() => {
          setCards((state) => state.filter((c) => c._id != card._id));
        })
        .catch((err) => console.log(err))
  }

  function handleEditAvatarClick(){
    setEditAvatarPopupState(true)
  }

  function handleEditProfileClick(){
    setEditProfilePopupState(true)
  }

  function handleAddPlaceClick(){
    setAddPlacePopupState(true)
  }

  function closeAllPopups(){
    setEditAvatarPopupState(false)
    setAddPlacePopupState(false)
    setEditProfilePopupState(false)
    setSelectedCard(null)
  }

  function closeOnOverlayClick(evt) {
    if (evt.target.classList.contains("popup")) {
      closeAllPopups();
    }
  }

  const isOpen = isEditAvatarPopupOpen || isEditProfilePopupOpen || isAddPlacePopupOpen || isInfoTooltipOpen || selectedCard

  useEffect(() => {
    function closeByEscape(evt) {
      if(evt.key === 'Escape') {
        closeAllPopups();
      }
    }
    if(isOpen) {
      document.addEventListener('keydown', closeByEscape);
      return () => {
        document.removeEventListener('keydown', closeByEscape);
      }
    }
  }, [isOpen]) 

  function handleUpdateUser(data){
    setIsLoading(true);
    api.editUserInfo(data)
      .then((updatedUserInfo) =>{
        setCurrentUser(updatedUserInfo);
        closeAllPopups();
      })
      .catch((err) => console.log(err))
      .finally(()=>setIsLoading(false))
  }

  function handleUpdateAvatar(data) {
    setIsLoading(true);
    api.updateAvatar(data)
      .then((updatedAvater) =>{
        setCurrentUser(updatedAvater);
        closeAllPopups();
      })
      .catch((err) => console.log(err))
      .finally(()=>setIsLoading(false))
  }

  function handleAddPlaceSubmit(data) {
    setIsLoading(true);
    api.createCard(data)
      .then((newCard) =>{
        setCards([newCard, ...cards]);
        closeAllPopups()
      })
      .catch((err) => console.log(err))
      .finally(()=>setIsLoading(false))
  }

  return (
    <CurrentUserContext.Provider value={currentUser}>
        <Header email={userEmail} onSignoutClick={handleSignout}/>
        <Routes>
          <Route path='/' element={
            <ProtectedRouteElement
              element={Main}
              loggedIn={loggedIn}
              cards = {cards}
              onCardLike = {handleCardLike}
              onCardDelete = {handleCardDelete}
              onCardClick = {handleCardClick}
              onEditProfile = {handleEditProfileClick} 
              onAddPlace = {handleAddPlaceClick} 
              onEditAvatar = {handleEditAvatarClick}/>
          }/>
          <Route path='/sign-in' element={<Login onSubmit={handleSignin}/>} />
          <Route path='/sign-up' element={<Register onSubmit={handleSignup}/>}/>
        </Routes>
        <InfoTooltip
            isOpen={isInfoTooltipOpen}
            onOverlay={closeOnOverlayClick}
            onClose={handleInfoTooltipClose}
            status={infoTooltipStatus}/>
        <ImagePopup 
            card={selectedCard}
            onOverlay={closeOnOverlayClick} 
            onClose={closeAllPopups}/>
        <EditProfilePopup 
            isOpen={isEditProfilePopupOpen}
            onOverlay={closeOnOverlayClick} 
            onClose={closeAllPopups} 
            onUpdateUser={handleUpdateUser}
            buttonText={isLoading? 'Saving...' : 'Save'}/> 
        <AddPlacePopup 
            isOpen={isAddPlacePopupOpen}
            onOverlay={closeOnOverlayClick}
            onClose={closeAllPopups}
            onAddPlace={handleAddPlaceSubmit}
            buttonText={isLoading? 'Saving...' : 'Save'}/> 
        <PopupWithForm 
            title = 'Are you sure?' 
            name = 'delete-card'
            buttonText = 'Yes' />
        <EditAvatarPopup 
            isOpen={isEditAvatarPopupOpen} 
            onOverlay={closeOnOverlayClick}
            onClose={closeAllPopups} 
            onUpdateAvatar={handleUpdateAvatar}
            buttonText={isLoading? 'Saving...' : 'Save'}/>   
        <Footer />
    </CurrentUserContext.Provider>
  );
}

export default App;
