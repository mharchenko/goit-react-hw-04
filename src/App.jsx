import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './components/App/App.module.css';
import toast, { Toaster } from 'react-hot-toast';
import ErrorMessage from './components/ErrorMessage/ErrorMessage';
import SearchBar from './components/SearchBar/SearchBar';
import ImageGallery from './components/ImageGallery/ImageGallery';
import LoadMoreBtn from './components/LoadMoreBtn/LoadMoreBtn';
import ImageModal from './components/ImageModal/ImageModal';
import Loader from './components/Loader/Loader';
import Modal from 'react-modal';

const ACCESS_KEY = '8t8ZD3BsZlyVUN33HEjeJiMm6VS-5wogQllRs6NoC1Y';
Modal.setAppElement('#root');

const App = () => {
  const [query, setQuery] = useState('');
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [modalData, setModalData] = useState({ isOpen: false, image: null });

  const fetchImages = async (newQuery, newPage) => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get(
        'https://api.unsplash.com/search/photos',
        {
          params: { query: newQuery, page: newPage, per_page: 12 },
          headers: { Authorization: `Client-ID ${ACCESS_KEY}` },
        }
      );

      const newImages = response.data.results;
      if (newPage === 1) {
        setImages(newImages);
      } else {
        setImages((prevImages) => [...prevImages, ...newImages]);
      }

      if (newImages.length === 0) {
        toast.error('Зображення не знайдено. Спробуйте ще раз...');
      }
    } catch (err) {
      setError('Не вдалося завантажити зображення. Спробуйте ще раз...');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (newQuery) => {
    setQuery(newQuery);
    setPage(1);
    fetchImages(newQuery, 1);
  };

  const loadMoreImages = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchImages(query, nextPage);
  };

  const openModal = (image) => setModalData({ isOpen: true, image });
  const closeModal = () => setModalData({ isOpen: false, image: null });

  useEffect(() => {
    if (query) {
      fetchImages(query, page);
    }
  }, [query, page]);

  return (
    <div className={styles.app}>
      <Toaster position="top-right" />
      <SearchBar onSubmit={handleSearchSubmit} />
      {error && <ErrorMessage message={error} />}
      {images.length > 0 && (
        <ImageGallery images={images} onImageClick={openModal} />
      )}
      {loading && <Loader />}
      {images.length > 0 && !loading && (
        <LoadMoreBtn onClick={loadMoreImages} />
      )}
      {modalData.isOpen && modalData.image && (
        <ImageModal
          isOpen={modalData.isOpen}
          onRequestClose={closeModal}
          image={modalData.image}
        />
      )}
    </div>
  );
};

export default App;
