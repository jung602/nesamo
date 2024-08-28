import React from 'react';
import ReactDOM from 'react-dom';
import CardPopup from './CardPopup';
import { Card } from '../data/cardData';

interface CardPopupWrapperProps {
  card: Card;
  onClose: () => void;
}

const CardPopupWrapper: React.FC<CardPopupWrapperProps> = ({ card, onClose }) => {
  return ReactDOM.createPortal(
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="fixed inset-0 bg-black opacity-50" onClick={onClose}></div>
      <div className="relative z-10">
        <CardPopup card={card} onClose={onClose} />
      </div>
    </div>,
    document.body
  );
};

export default CardPopupWrapper;