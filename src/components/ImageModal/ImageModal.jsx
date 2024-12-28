import React from 'react';
import Modal from 'react-modal';
import styles from './ImageModal.module.css';

const ImageModal = ({ isOpen, onRequestClose, image }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Image Modal"
      className={styles.modal}
      overlayClassName={styles.overlay}
      shouldCloseOnOverlayClick={true}
      shouldCloseOnEsc={true}
    >
      <div className={styles.content}>
        <button onClick={onRequestClose} className={styles.closeButton}>
          Закрити
        </button>
        {image && (
          <>
            <img
              src={image.urls.regular}
              alt={image.alt_description || 'Image'}
              className={styles.image}
            />
            <div className={styles.info}>
              <h3>{image.alt_description || 'Немає опису'}</h3>
              <p>Автор: {image.user.name}</p>
              <p>Подобається: {image.likes}</p>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
};

export default ImageModal;
