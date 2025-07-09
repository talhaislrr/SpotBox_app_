import React from 'react';
import { Image, StyleSheet } from 'react-native';
import { Cloudinary } from '@cloudinary/url-gen';
import { auto } from '@cloudinary/url-gen/actions/resize';
import { autoGravity } from '@cloudinary/url-gen/qualifiers/gravity';

// Initialize Cloudinary instance
const cld = new Cloudinary({
  cloud: { cloudName: 'dcp1cc0zd' },
});

/**
 * CloudImage renders an optimized Cloudinary image in React Native via Image component.
 * @param {Object} props
 * @param {string} props.publicId - Cloudinary public ID of the image
 * @param {number} [props.width=300]
 * @param {number} [props.height=300]
 * @param {object} [props.style]
 */
const CloudImage = ({ publicId, width = 300, height = 300, style }) => {
  const cldImg = cld
    .image(publicId)
    .format('auto')
    .quality('auto')
    .resize(
      auto()
        .gravity(autoGravity())
        .width(width)
        .height(height),
    );
  const uri = cldImg.toURL();

  return <Image source={{ uri }} style={[{ width, height }, style]} />;
};

export default CloudImage; 