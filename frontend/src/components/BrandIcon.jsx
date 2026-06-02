import React from "react";
import { SiSpotify, SiNetflix, SiYoutube } from "react-icons/si";

const map = {
  spotify: SiSpotify,
  netflix: SiNetflix,
  youtube: SiYoutube,
};

export const BrandIcon = ({ name, className = "", style }) => {
  const Icon = map[name];
  if (!Icon) return null;
  return <Icon className={className} style={style} />;
};
