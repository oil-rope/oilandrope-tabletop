import React, { FC } from 'react';
import PropTypes, { InferProps } from 'prop-types';
import Spinner from 'react-bootstrap/Spinner';

const LoaderPropTypes = {
  text: PropTypes.string,
};
const LoaderDefaults = {
  text: 'Loading...',
};

type LoaderTypes = InferProps<typeof LoaderPropTypes>;
const Loader: FC<LoaderTypes> = ({ text }) => {
  return (
    <>
      <Spinner animation="border" />
      <span>{text}</span>
    </>
  );
};

Loader.propTypes = LoaderPropTypes;
Loader.defaultProps = LoaderDefaults;

export default Loader;
