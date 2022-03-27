import React, { FC } from 'react';
import PropTypes, { InferProps } from 'prop-types';
import Spinner from 'react-bootstrap/Spinner';

const LoaderProps = {
  text: PropTypes.string,
};

const LoaderDefaults = {
  text: 'Loading...',
};

type LoaderType = InferProps<typeof LoaderProps>;
const Loader: FC<LoaderType> = ({ text }) => {
  return (
    <>
      <Spinner animation="border" role="status">
        <span className="visually-hidden">{text}</span>
      </Spinner>
      <span>{text}</span>
    </>
  );
};

Loader.propTypes = LoaderProps;
Loader.defaultProps = LoaderDefaults;

export default Loader;
