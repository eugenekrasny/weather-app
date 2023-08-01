import React, { useState, useCallback, useRef } from 'react';
import 'material-design-icons/iconfont/material-icons.css';

import InlineLoader from '../components/InlineLoader';
import '../css/citySelection.css';

interface CitySelectionViewProps {
  onCitySearchClick: (city: string) => Promise<void>;
  onUseCurrentPositionClick: () => Promise<void>;
}

const errorMessageFromError = (error: unknown): string => {
  if (typeof error === 'string') {
    return error;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return error ? String(error) : 'Error';
};

function CitySelectionView({
  onCitySearchClick,
  onUseCurrentPositionClick,
}: CitySelectionViewProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>();

  const inputRef = useRef<HTMLInputElement>(null);

  const onSearchClick = useCallback(async () => {
    const inputValue = inputRef.current?.value;
    if (inputValue && 0 < inputValue.length) {
      setIsLoading(true);
      try {
        await onCitySearchClick(inputValue);
      } catch (error) {
        setErrorMessage(errorMessageFromError(error));
      } finally {
        setIsLoading(false);
      }
    }
  }, [onCitySearchClick]);

  const getCurrentLocation = useCallback(async () => {
    setIsLoading(true);
    try {
      await onUseCurrentPositionClick();
    } catch (error) {
      setErrorMessage(errorMessageFromError(error));
    } finally {
      setIsLoading(false);
    }
  }, [onUseCurrentPositionClick]);

  if (isLoading) {
    return <InlineLoader />;
  }

  return (
    <div className="city-selection">
      <form className="city-selection__search-form" onSubmit={onSearchClick}>
        <input
          className="city-selection__search-field"
          type="text"
          placeholder="City"
          ref={inputRef}
          maxLength={20}
        />
        <button type="submit" className="city-selection__search-button">
          <i className="material-icons">&#xE8B6;</i>
        </button>
      </form>
      <p className="city-selection__or-caption">or</p>
      <p>
        use my{' '}
        <span
          className="city-selection__use-current-position"
          onClick={getCurrentLocation}
        >
          current position
        </span>
      </p>
      {!!errorMessage && (
        <h4 className="city-selection__error-message">Error: {errorMessage}</h4>
      )}
    </div>
  );
}

export default CitySelectionView;
