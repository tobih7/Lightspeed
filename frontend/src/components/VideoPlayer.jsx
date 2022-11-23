import React, { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { VideoPosterURL } from "../assets/constants";
import { Video } from "../styles/videoPlayerStyles";

const VideoPlayer = ({ src }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    if (src) {
      videoRef.current.srcObject = src;
      videoRef.current.play();

      // // when video is muted autoplay works without interacting first, otherwise this is required
      // function play() {
      //   videoRef.current.play();
      //   setTimeout(play, 1000);
      // }
      // play();
    }
  }, [src]);

  return (
    <Video
      ref={videoRef}
      playsInline
      autoPlay
      // controls
      muted
      // poster={VideoPosterURL}
    ></Video>
  );
};

export default VideoPlayer;

VideoPlayer.propTypes = {
  src: PropTypes.object,
};
