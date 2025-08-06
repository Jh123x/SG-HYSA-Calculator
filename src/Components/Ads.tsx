import React from "react";


export const Ads = () => {
    const showAds = localStorage.getItem('showAds') !== 'false';

    if (!showAds) document.getElementById('ads')?.remove();
    return <></>
}